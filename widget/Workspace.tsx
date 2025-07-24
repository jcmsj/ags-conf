import { createBinding, createComputed, For } from "ags";
import { Gdk } from "ags/gtk4";
import NiriWindowHandler from "../lib/niri/WindowHandler";
import NiriWorkspaceHandler from "../lib/niri/WorkspaceHandler";

export function WorkspacePanel({ monitor }: { monitor: Gdk.Monitor }) {
    // shows the apps active in the current niri workspace
    const niri = NiriWindowHandler.get_default()
    const ws = NiriWorkspaceHandler.get_default();
    const workspaces = createBinding(ws, "workspaces");
    const allWindows = createBinding(niri, "windows");
    const windows = createComputed([workspaces, allWindows], (workspaces, allWindows) => {
        const workspacesInMonitor = Object.values(workspaces)
            .filter((ws) => ws.output == monitor.connector).sort(
                // sort by workspace index
                (a, b) => a.idx - b.idx
            );
            // console.log("Workspaces in monitor:", workspacesInMonitor);

        const windowsForAllWorkspaces = workspacesInMonitor.flatMap((ws) =>
            allWindows.filter((window) => 
            window.workspace_id == ws.id));
        return windowsForAllWorkspaces;
    });
    console.log("WorkspacePanel", monitor, windows)
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
