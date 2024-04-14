

export type PowerMenuAction = "sleep" | "reboot" | "logout" | "shutdown" | "dismiss"

const Action:Record<PowerMenuAction, string> = {
    sleep: "systemctl suspend",
    reboot: "systemctl reboot",
    logout: "hyprctl dispatch exit",
    shutdown: "shutdown now",
    dismiss: "", // do nothing
}

const hyprland = await Service.import('hyprland')
export class PowerMenu extends Service {
    static {
        Service.register(this, {})
    }

    action(action: PowerMenuAction) {
        // [this.#cmd, this.#title] = {
        //     sleep: [sleep.value, "Sleep"],
        //     reboot: [reboot.value, "Reboot"],
        //     logout: [logout.value, "Log Out"],
        //     shutdown: [shutdown.value, "Shutdown"],
        // }[action]
        hyprland.monitors.forEach(monitor => {
            App.removeWindow(`powermenu-${monitor.id}`)
        })
        Utils.execAsync(Action[action])
        // this.notify("cmd")
        // this.notify("title")
        // this.emit("changed")
        // App.closeWindow("powermenu")
        // App.openWindow("verification")
    }
}

export const powermenu = new PowerMenu
Object.assign(globalThis, { powermenu })
// export default powermenu
