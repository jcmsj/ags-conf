import { Monitor } from "types/service/hyprland"
import Win from "../win.js"
import Gtk30 from "gi://Gtk?version=3.0"

const hyprland = await Service.import('hyprland')

export function Indicator() {
    return Widget.Button({
        label: 'Monitors',
        on_clicked() {
            const name = Name()
            if (App.getWindow(name)) {
                App.removeWindow(name)
            } else {
                App.addWindow(MonitorWindow())
            }
        }
    })
}

function Name() {
    return 'MonitorWindow'
}
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

export function MonitorWidget(monitor: Monitor) {
    return Widget.Box({
        vertical: true,
        classNames: ['monitor-widget'],
        children: [
            Widget.Label({ label: monitor.name }),
            // resolution@rr
            Widget.Label({ label: `${monitor.width}x${monitor.height}@${monitor.refreshRate.toFixed()}hz` }),

            // enable/disable
            Widget.Box({
                halign: Gtk30.Align.CENTER,
                hexpand: true,
                children: [
                    Widget.Switch({
                        active: monitor.dpmsStatus, onActivate(self) {
                            setDPMS(monitor, monitor.dpmsStatus ? 'off' : 'on')
                                .then(it => {
                                    console.log(it)
                                })
                        },
                        setup(self) {
                            ['monitor-added', 'monitor-removed'].forEach(event => {
                                self.hook(hyprland, () => {
                                    self.active = monitor.dpmsStatus
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

function addSwapperInBetween(monitors: Monitor[]): (ReturnType<typeof MonitorSwapper> | ReturnType<typeof MonitorWidget>)[] {
    const stopAt = monitors.length - 1
    return monitors.map((monitor, index) => {
        if (index === stopAt) {
            return MonitorWidget(monitor)
        }
        const swapper = MonitorSwapper(monitor, monitors[index+1])
        swapper.on_clicked = () => {
            swapPosition(swapper.attribute.left, swapper.attribute.right)
        }
        return [
            MonitorWidget(monitor),
            swapper
        ]
    }).flat()
}

export function MonitorWindow() {
    const monitorWidgets = Widget.Box({
        spacing: 2,
        children: hyprland.bind('monitors')
            .as(ms => addSwapperInBetween(ms.sort(positionalOrder)))
    })

    const w = Win({
        name: Name(),
        classNames: ['monitor-window'],
        child: Widget.Box({
            vertical: true,
            spacing: 8,
            setup(self) {
                function s() {
                    self.children = [
                        monitorWidgets,
                        Widget.Box({
                            hexpand: true,
                            spacing: 8,
                            halign: Gtk30.Align.CENTER,
                            children: [
                                Widget.Button({ label: 'Mirror' }),
                                Widget.Button({ label: 'Extend' }),
                            ]
                        })
                    ]
                }
                s()
            },
        })
    })

    return w;
}
