import GObject, { register, property, getter } from "ags/gobject"
import { execAsync } from "ags/process"

export type PowerMenuAction = "sleep" | "reboot" | "logout" | "shutdown"

const Action:Record<PowerMenuAction, string> = {
    sleep: "systemctl suspend",
    reboot: "systemctl reboot",
    logout: "niri msg action quit",
    shutdown: "poweroff",
}

@register({ GTypeName: "SystemPower" })
export default class SystemPower extends GObject.Object {
    static instance: SystemPower
    static get_default() {
        if (!this.instance)
            this.instance = new SystemPower()

        return this.instance
    }

    action(action: PowerMenuAction) {
        const cmd = Action[action]
        if (!cmd) {
            console.error(`Unknown action: ${action}`)
            return
        }
        console.log(`Executing action: ${action} with command: ${cmd}`)
        // Execute the command using execAsync or similar method
        execAsync(cmd).catch(err => console.error(`Failed to execute command: ${err}`))
    }
}
