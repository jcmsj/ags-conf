import app from "ags/gtk4/app"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import NiriWindowHandler from "../lib/niri/WindowHandler"
import { createBinding, createComputed, createState, For } from "ags"
import NiriWorkspaceHandler from "../lib/niri/WorkspaceHandler"
import { NiriWindow } from "../lib/niri"

export function ActiveWorkspaceSwitcher(monitor: Gdk.Monitor) {
  const niri = NiriWindowHandler.get_default()
  const ws = NiriWorkspaceHandler.get_default();
  const workspaces = createBinding(ws, "workspaces");
  const allWindows = createBinding(niri, "windows");
  const [windowTitle, setWindowTitle] = createState("");
  const windows = createComputed([workspaces, allWindows], (workspaces, allWindows) => {
    const workspacesInMonitor = Object.values(workspaces)
      .filter((ws) => ws.output == monitor.connector && ws.is_focused);
    console.log("Workspaces in monitor:", workspacesInMonitor);

    const windowsForAllWorkspaces = workspacesInMonitor.flatMap((ws) =>
      allWindows.filter((window) =>
        window.workspace_id == ws.id));
    setWindowTitle(windowsForAllWorkspaces.find(w => w.is_focused)?.title || "");
    return windowsForAllWorkspaces;
  });

  // set initial title from focused window
  return (
    <window
      visible
      class="Bar Switcher"
      name="active-workspace-switcher"
      gdkmonitor={monitor}
      application={app}
      keymode={Astal.Keymode.ON_DEMAND}
      onShow={() => {
        const focusedWindow = windows.get().find(w => w.is_focused);
        if (focusedWindow) {
          setWindowTitle(focusedWindow.title);
        }
      }}
    >
      <box class="Workspace Panel SingleItem" orientation={Gtk.Orientation.VERTICAL}>
      <Gtk.EventControllerKey
        onKeyPressed={({ widget }, keyval: number, arg1, modifier) => {
          if (keyval === Gdk.KEY_Escape) {
            app.quit();
          }
        }}
      >
      </Gtk.EventControllerKey>
        <box halign={Gtk.Align.CENTER}>
          <label label={windowTitle} class="WindowTitle" />
        </box>
        <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} class="WorkspaceSwitcher">
          <For each={windows}>
            {(window) => (
              // show button for each window, use app_id for the iconName, add a tooltip of the window title
              // TODO: context menu actions
              <button
              // focus the active window automatically
                class={'WorkspaceButton Switcher ' + (window.is_focused ? 'ActiveWindow' : '')}
                tooltipText={window.title}
                iconName={window.app_id}
                onActivate={e => {
                  if (window.is_focused) {
                    setWindowTitle(`${window.title}`);
                  }
                }}
                widthRequest={80}
                heightRequest={80}
                onClicked={() => {
                  niri.focusWindow(window.id)
                  app.quit()
                }}
                onNotifyHasFocus={(e) => {
                  setWindowTitle(`${window.title}`)
                }}
              >
                <image iconName={window.app_id} pixelSize={64} />
              </button>
            )}
          </For>
        </box>
      </box>
    </window>
  )
}
