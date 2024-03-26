

export type PowerMenuAction = "sleep" | "reboot" | "logout" | "shutdown"

const Action:Record<PowerMenuAction, string> = {
    sleep: "systemctl suspend",
    reboot: "systemctl reboot",
    logout: "hyprctl dispatch exit",
    shutdown: "shutdown now",
}

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
        App.closeWindow("powermenu")
        Utils.exec(Action[action])
        // this.notify("cmd")
        // this.notify("title")
        // this.emit("changed")
        // App.closeWindow("powermenu")
        // App.openWindow("verification")
    }

    // readonly shutdown = () => {
    //     this.action("shutdown")
    // }
}

export const powermenu = new PowerMenu
Object.assign(globalThis, { powermenu })
// export default powermenu
