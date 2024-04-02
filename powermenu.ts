import { makeWinName } from "./utils.js"
import {powermenu, PowerMenuAction} from "./services/powermenu.js"
const hyprland = await Service.import('hyprland')
export const SysBtn = (action:PowerMenuAction, icon:string) => Widget.Button({
    classNames: ["sys-btn"],
    child: Widget.Box({
        spacing: 5,
        children: [
            Widget.Icon({
                icon,
            }),
            Widget.Label({
                label: action,
            }),
        ],
    }),
    on_clicked() {
        powermenu.action(action)
    },
})
export const PowerMenuButton = () => Widget.Button({
    classNames: ["taskbar-item, nixos-btn"],
    child: Widget.Icon({
        icon: "nixos-symbolic",
    }),
    on_clicked() {
        toggle()
    },
})

export const PowerMenu = () => Widget.Box({
    name: "powermenu-widget",
    vertical: true,
    spacing: 5,
    children: [
        // SysBtn("sleep", "system-lockscreen-symbolic"),
        SysBtn("reboot", "system-reboot-symbolic"),
        SysBtn("logout", "system-log-out-symbolic"),
        SysBtn("shutdown", "system-shutdown-symbolic"),
    ],
})
export const Name = makeWinName("powermenu")

// Create a window in the center of the screen
export const PowerWindow = (monitor:{id:number}) =>  Widget.Window({
    name: Name(monitor),
    monitor: monitor.id,
    keymode: "exclusive",
    setup(self) {
        self.keybind("Escape", () => {
            toggle()
        })
        self.get_focus()
    },
    anchor: [], // Leave empty to center the window
    child: PowerMenu(),
})

export enum ToggleState {
    Skipped,
    Added,
    Removed
}

/**
 * Opens or closes the power menu for all monitors
 */
export function toggle() {
    return hyprland.monitors.map((monitor) => {
        if (monitor.dpmsStatus == false) {
            console.log(`Monitor(${monitor.id}, ${monitor.name}) is off`)
            return ToggleState.Skipped
        }
        const name = Name(monitor)
        if (App.getWindow(name)) {
            App.removeWindow(name)
            console.log(`Removed ${name}`)
            return ToggleState.Removed
        } else {
            App.addWindow(PowerWindow(monitor))
            console.log(`Added ${name}`)
            return ToggleState.Added
        }
    })
}

globalThis.togglePowerMenu = toggle
