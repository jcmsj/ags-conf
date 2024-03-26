import {powermenu, PowerMenuAction} from "./services/powermenu.js"
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
        console.log("Powermenu clicked")
        // Get focused window in hyprland
        if (App.getWindow("powermenu")) {
            App.removeWindow("powermenu")
        } else {
            App.addWindow(PowerWindow())
        }
        // const powermenu = PowerMenu()
        // powermenu.show()
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

// Create a window in the center of the screen
export const PowerWindow = (monitor?:number) =>  Widget.Window({
    name: "powermenu",
    monitor,
    keymode: "exclusive",
    setup(self) {
        self.keybind("Escape", () => {
            console.log("Escape")
            App.removeWindow(self)
        })
        self.get_focus()
    },
    anchor: [], // Leave empty to center the window
    child: PowerMenu(),
})
