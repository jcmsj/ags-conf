import { createBinding, For } from "ags";
import { Gdk } from "ags/gtk4";
import Niri from "../lib/niri";

export function WorkspacePanel(monitor:Gdk.Monitor) {
    // shows the apps active in the current niri workspace
    const niri = Niri.get_default()
    // TODO: filter monitor windows by monitor
    // TODO: handle case: null monitor
    const windows = createBinding(niri, "windows")
    return (
        <box class="Workspace Panel SingleItem">
            <For each={windows}>
                {(window) => (
                    // show button for each window, use app_id for the iconName, add a tooltip of the window title
                    // TODO: context menu actions
                    <button
                        class={'WorkspaceButton ' + (window.is_focused ? 'ActiveWindow' : '')}
                        tooltipText={window.title}
                        iconName={window.app_id}

                        onClicked={() => {
                            niri.focusWindow(window.id)
                        }}
                    >
                        <image iconName={window.app_id} />
                    </button>
                )}
            </For>

        </box>
    )
}
