import GObject, { getter, register, setter } from "ags/gobject"
import { exec, subprocess } from "ags/process"
import AstalIO from "gi://AstalIO?version=0.1"
import { NiriEvent, niriEventStream, NiriWorkspace } from "./events"

@register({ GTypeName: "NiriWorkspaceHandler" })
export default class NiriWorkspaceHandler extends GObject.Object {
    static instance: NiriWorkspaceHandler
    static get_default() {
        if (!this.instance)
            this.instance = new NiriWorkspaceHandler()

        return this.instance
    }

    #workspaces: Record<string, NiriWorkspace> = {};
    #activeWorkspaceId: number = -1;
    #handle: AstalIO.Process | null = null;

    @getter<Record<string, NiriWorkspace>>(Object)
    get workspaces(): Record<string, NiriWorkspace> {
        return this.#workspaces;
    }

    @getter<NiriWorkspace | null>(Object)
    get activeWorkspace() {
        if (this.#activeWorkspaceId) {
            return this.#workspaces[this.#activeWorkspaceId] || null;
        }
        return null;
    }

    listen() {
        this.#handle = niriEventStream((ev: NiriEvent) => {
            if (ev.WorkspacesChanged && ev.WorkspacesChanged.workspaces) {
                this.onWorkspacesChanged(ev.WorkspacesChanged);
            }

            if (ev.WorkspaceActiveWindowChanged) {
                // console.log("WorkspaceActiveWindowChanged", ev.WorkspaceActiveWindowChanged);
                const { workspace_id, active_window_id } = ev.WorkspaceActiveWindowChanged;
                const workspace = this.#workspaces[workspace_id];
                if (workspace) {
                    workspace.active_window_id = active_window_id.toString();
                    this.notify('workspaces');
                }
            }

            if (ev.WorkspaceActivated) {
                // console.log("WorkspaceActivated", ev.WorkspaceActivated);
                // find current active workspace
                // set is_focused to false
                const prevActiveWorkspace = Object.values(this.#workspaces)
                    .find(ws => ws.is_focused);
                if (prevActiveWorkspace) {
                    prevActiveWorkspace.is_focused = false;
                }

                const { id, focused } = ev.WorkspaceActivated;
                const workspace = this.#workspaces[id];
                if (workspace) {
                    workspace.is_focused = focused;
                }

                this.#workspaces = this.#workspaces; // Trigger notification
                this.notify('workspaces');
            }
        })
    }

    onWorkspacesChanged(e: Exclude<NiriEvent["WorkspacesChanged"], undefined>) {
        // console.log("WorkspacesChanged", e.workspaces);
        this.#workspaces = {};
        e.workspaces.forEach((ws: NiriWorkspace) => {
            this.#workspaces[ws.id] = ws;
        });
        this.#activeWorkspaceId = e.workspaces.find(ws => ws.is_focused)?.id || -1;
        this.notify('workspaces');
    }

    constructor() {
        super();
        this.listen();
    }

    destroy() {
        this.#handle?.kill();
    }
}
