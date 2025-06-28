import { Gtk } from "ags/gtk4";
import SystemPower from "../lib/SystemPower";

export function PowerPanel() {
    const systemPower = SystemPower.get_default();
    return (
        <box class="Power Panel SingleItem">
            <menubutton widthRequest={5} heightRequest={5} tooltipText="Power Options">
                <image iconName="system-shutdown-symbolic" />
                <popover>
                    <box orientation={Gtk.Orientation.VERTICAL} class={'text-left'}>
                        <SysBtn
                            iconName="system-shutdown-symbolic"
                            label="Shutdown"
                            onClicked={() => systemPower.action('shutdown')} />
                        <SysBtn
                            iconName="system-reboot-symbolic"
                            label="Restart"
                            onClicked={() => systemPower.action('reboot')} />
                        <SysBtn
                            iconName="system-suspend-symbolic"
                            label="Sleep"
                            onClicked={() => systemPower.action('sleep')} />
                        <SysBtn
                            iconName="system-log-out-symbolic"
                            label="Logout"
                            onClicked={() => systemPower.action('logout')} />
                    </box>
                </popover>
            </menubutton>
        </box>
    );
}

function SysBtn({ iconName, label, onClicked }: { iconName: string; label: string; onClicked: () => void }) {
    return (
        <button onClicked={onClicked}>
            <box>
                <image iconName={iconName} />
                &nbsp;
                <label label={label} />
            </box>
        </button>
    );
}
