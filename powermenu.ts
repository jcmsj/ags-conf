import {powermenu, PowerMenuAction} from "./services/powermenu.js"
import { prepToggle } from "./utils/toggle.js"
const hyprland = await Service.import('hyprland')
export const SysBtn = (action:PowerMenuAction, icon:string, args?:Parameters<typeof Widget.Button>['0']) => Widget.Button({
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
        globalThis.togglePowerMenu()
    },
    ...args
})
export const PowerMenuButton = () => Widget.Button({
    classNames: ["taskbar-item, nixos-btn"],
    child: Widget.Icon({
        icon: "nixos-symbolic",
        classNames: ["nixos-btn-icon"],
    }),
    attribute: {
        togglePowermenu: prepToggle(Name, PowerWindow),
    },
    on_clicked(self) {
        self.attribute.togglePowermenu()
    },
})

export const PowerMenu = () => Widget.Box({
    name: "powermenu-widget",
    classNames: ["powermenu"],
    vertical: true,
    spacing: 6,
    children: [
        SysBtn("dismiss", "window-close-symbolic"),
        SysBtn("shutdown", "system-shutdown-symbolic"),
        SysBtn("reboot", "system-reboot-symbolic"),
        SysBtn("logout", "system-log-out-symbolic"),
        SysBtn("sleep", "Kanata_Logo"),
    ],
})
export const Name = "powermenu"
// Create a window in the center of the screen
export const PowerWindow = () =>  Widget.Window({
    name: Name,
    keymode: "exclusive",
    anchor: [], // Leave empty to center the window
    child: PowerMenu(),
    setup(self) {
        self.keybind("Escape", prepToggle(Name, PowerWindow))
        self.grab_focus()
    },
})


globalThis.togglePowerMenu = prepToggle(Name, PowerWindow)
