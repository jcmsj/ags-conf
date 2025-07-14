import GObject, { getter, register } from "ags/gobject"
import AstalIO from "gi://AstalIO?version=0.1"
import { NiriEvent, niriEventStream, NiriWorkspace } from "./events"

@register({ GTypeName: "NiriActiveWorkspaceHandler" })
export default class ActiveWorkspaceHandler extends GObject.Object {
    static instance: ActiveWorkspaceHandler
    static get_default() {
        if (!this.instance)
            this.instance = new ActiveWorkspaceHandler()

        return this.instance
    }

    #activeWorkspace: NiriWorkspace | null = null;
    #handle: AstalIO.Process | null = null;

    @getter<NiriWorkspace | null>(Object)
    get activeWorkspace(): NiriWorkspace | null {
        return this.#activeWorkspace;
    }

    @getter<number | null>(Number)
    get activeWorkspaceId(): number | null {
        return this.#activeWorkspace?.id ?? null;
    }

    @getter<string | null>(String)
    get activeWorkspaceName(): string | null {
        return this.#activeWorkspace?.name ?? null;
    }

    @getter<string | null>(String)
    get activeWorkspaceOutput(): string | null {
        return this.#activeWorkspace?.output ?? null;
    }

    @getter<boolean>(Boolean)
    get hasActiveWorkspace(): boolean {
        return this.#activeWorkspace !== null;
    }

    listen() {
        this.#handle = niriEventStream((ev: NiriEvent) => {
            if (ev.WorkspacesChanged && ev.WorkspacesChanged.workspaces) {
                this.onWorkspacesChanged(ev.WorkspacesChanged);
            }

            if (ev.WorkspaceActiveWindowChanged) {
                const { workspace_id, active_window_id } = ev.WorkspaceActiveWindowChanged;
                
            }
        })
    }

    onWorkspacesChanged(e: Exclude<NiriEvent["WorkspacesChanged"], undefined>) {
        const focusedWorkspace = e.workspaces.find(ws => ws.is_focused);
        
        if (focusedWorkspace) {
            const prevActiveId = this.#activeWorkspace?.id;
            this.#activeWorkspace = focusedWorkspace;
            
            // Only notify if the active workspace actually changed
            if (prevActiveId !== focusedWorkspace.id) {
                console.log("Active workspace changed:", focusedWorkspace);
                this.notify('active-workspace');
                this.notify('active-workspace-id');
                this.notify('active-workspace-name');
                this.notify('active-workspace-output');
                this.notify('has-active-workspace');
            }
        }
    }

    constructor() {
        super();
        this.listen();
        this.notify('ready');
    }

    destroy() {
        this.#handle?.kill();
    }
}
