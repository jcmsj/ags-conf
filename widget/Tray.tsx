import { For,Accessor, createBinding } from "ags";
import Tray from "gi://AstalTray";
export function TrayPanel() {
    const tray = Tray.get_default();

    const items = createBinding(tray, 'items');
    return (
        <box class="Tray Panel SingleItem">
        <menubutton widthRequest={5} heightRequest={5} tooltipText="Tray Options">
            <image iconName="pan-down-symbolic"/>
            <popover>
                <box orientation="vertical" class={'text-left'}>
                    <For each={items}>
                        {(item) => (
                            <button
                                tooltipText={item.tooltipText}
                                iconName={item.iconName}
                                onClicked={() => {
                                    item.activate(0,0)
                                }}
                            >
                            </button>
                        )}
                        </For>
                </box>
            </popover>
        </menubutton>
        </box>
    );
}
