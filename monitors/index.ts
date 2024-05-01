import { Monitor } from "types/service/hyprland"
import Win from "../win.js"
import Gtk30 from "gi://Gtk?version=3.0"
import { prepToggle } from "../utils/toggle.js"

const hyprland = await Service.import('hyprland')

export function Indicator() {
    return Widget.Button({
        label: 'Monitors',
        on_clicked() {
            if (App.getWindow(NAME)) {
                App.removeWindow(NAME)
            } else {
                App.addWindow(MonitorWindow())
            }
        }
    })
}

const NAME = 'MonitorWindow'
/**TODOS
 * - [x] show number of monitors
 * - [ ] set mode
 *  - [ ] mirror
 *  - [x] extend
 * - [x] show number of active monitors
 * - [x] allow changing order of monitors
 * - [ ] persist monitor order
 * - [ ] manipulate refresh rate
 * - [ ] manipulate resolution
 * 
 */

async function setDPMS(monitor: Monitor, dpms: 'on' | 'off') {
    return hyprland.messageAsync(`dispatch dpms ${dpms} ${monitor.name}`)
}

async function setMonitorStatus(monitor: Monitor, on: boolean) {
    const status = on ? 'enable' : 'disable'
    return await hyprland.messageAsync(`keyword monitor ${monitor.name}, ${status}`)
}
/**
 * example: 1920x1080@60hz
 */
function monitorInfo(monitor: Monitor) {
    return `${monitor.width}x${monitor.height}@${monitor.refreshRate.toFixed()}hz`
}

interface Mon extends Monitor {
    disabled: boolean
}

async function mirror(target: Monitor, mirroredDisplay: Monitor) {
    return await hyprland.messageAsync(`keyword monitor ${target.name}, preferred, auto, 1, mirror, ${mirroredDisplay.name}`)
}
export function MonitorWidget(monitor: Mon) {
    return Widget.Box({
        vertical: true,
        classNames: ['monitor-widget'],
        children: [
            Widget.Label({ label: monitor.name }),
            // resolution@rr
            Widget.Label({ label: monitorInfo(monitor) }),

            // enable/disable
            Widget.Box({
                halign: Gtk30.Align.CENTER,
                hexpand: true,
                children: [
                    Widget.Switch({
                        active: !monitor.disabled,
                        onActivate(self) {
                            setMonitorStatus(monitor, self.active).then(console.log)
                        },
                        setup(self) {
                            ['monitor-added', 'monitor-removed'].forEach(event => {
                                self.hook(hyprland, () => {
                                    self.active = !monitor.disabled
                                }, event)
                            })
                        },
                    }),
                ]
            })
        ]
    })
}

// sort monitor.x
function positionalOrder(a: Monitor, b: Monitor) {
    return a.x - b.x
}

function MonitorSwapper(left: Monitor, right: Monitor) {
    return Widget.Button({
        hexpand: false,
        attribute: {
            left,
            right
        },
        classNames: ['monitor-swapper'],
        child: Widget.Icon({
            icon: 'object-flip-horizontal-symbolic',
        })
    })
}

function swapPosition(monitor: Monitor, other: Monitor) {
    console.log(`swapping ${monitor.name} with ${other.name}`)
    setXPosition(monitor, other),
        setXPosition(other, monitor)
}
// monitor=name,resolution,position,scale
function setXPosition(m: Monitor, pos: { x: number, y: number }, scale = 1) {
    const command = `keyword monitor ${m.name}, highrr, ${pos.x}x${pos.y}, ${scale}`
    console.log(command)
    return hyprland.message(command)
}

function addSwapperInBetween(monitors: Mon[]): (ReturnType<typeof MonitorSwapper> | ReturnType<typeof MonitorWidget>)[] {
    const stopAt = monitors.length - 1
    return monitors.map((monitor, index) => {
        if (index === stopAt) {
            return MonitorWidget(monitor)
        }
        const swapper = MonitorSwapper(monitor, monitors[index + 1])
        swapper.on_clicked = () => {
            swapPosition(swapper.attribute.left, swapper.attribute.right)
        }
        return [
            MonitorWidget(monitor),
            swapper
        ]
    }).flat()
}

/**
 * Gets all monitors from hyprland, including disabled ones
 */
function allMonitors(): Mon[] {
    return JSON.parse(hyprland.message('j/monitors all'))
}
const MonitorWidgets = () => Widget.Box({
    spacing: 2,
    children: hyprland.bind('monitors')
        .as(() => addSwapperInBetween(allMonitors().sort(positionalOrder)))
})
export function MonitorWindow() {
    const w = Win({
        name: NAME,
        classNames: ['monitor-window'],
        keymode: "exclusive",
        setup(self) {
            self.keybind("Escape", prepToggle(NAME, MonitorWindow))
            self.grab_focus()
        },
        child: Widget.Box({
            vertical: true,
            spacing: 8,
            children: [
                MonitorWidgets(),
                Widget.Box({
                    hexpand: true,
                    spacing: 8,
                    halign: Gtk30.Align.CENTER,
                    children: [
                        MirrorBtn(),
                        ExtendBtn(),
                    ]
                })
            ]
        }),
    })
    return w;
}

function MirrorBtn() {
    return Widget.Button({
        label: 'Mirror',
        async onClicked(self) {
            const [toBeMirrored, ...rest] = hyprland.monitors
            const r = await Promise.all(rest.map(m => mirror(m, toBeMirrored)))
            console.log('Mirror mode', r)
        }
    })
}
async function highrr(m:Monitor) {
    // hyprctl "keyword monitor $name, highrr, auto, 1"
    return await hyprland.messageAsync(`keyword monitor ${m.name}, highrr, auto, 1`)
}
function ExtendBtn() {
    return Widget.Button({
        label: 'Extend',
        async onClicked(self) {
            const r = await Promise.all(hyprland.monitors.map(highrr))
            console.log('Extend mode', r)
        }
    })
}
