

export type PowerMenuAction = "sleep" | "reboot" | "logout" | "shutdown" | "dismiss"

const Action:Record<PowerMenuAction, string> = {
    sleep: "systemctl suspend",
    reboot: "systemctl reboot",
    logout: "hyprctl dispatch exit",
    shutdown: "shutdown now",
    dismiss: "echo dismiss", // do nothing
}

const hyprland = await Service.import('hyprland')
export class PowerMenu extends Service {
    static {
        Service.register(this, {})
    }

    action(action: PowerMenuAction) {
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
