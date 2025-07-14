import { subprocess } from "ags/process";

export interface NiriWorkspace {
    id: number;
    idx: number;
    name?: string;
    output: string;
    is_urgent: boolean;
    is_focused: boolean;
    active_window_id: string;
}

export interface NiriWindow {
    id: number;
    title: string;
    app_id: string;
    pid: number;
    workspace_id: number;
    is_focused: boolean;
    is_floating: boolean;
    is_urgent: boolean;
}

export type NiriEvent = {
    WorkspacesChanged?: {
        workspaces: NiriWorkspace[];
    };

    WindowOpenedOrChanged?: {
        window: NiriWindow;
    };
    WindowClosed?: {
        id: number;
    };

    WindowFocusChanged?: {
        id: number;
    };

    WindowsChanged?: {
        windows: NiriWindow[];
    };

    WorkspaceActiveWindowChanged?: {
        workspace_id: number;
        active_window_id: number;
    };

    WorkspaceActivated?: {
        id: number;
        focused: boolean;
    }
};

export function niriEventStream(callback: (event: NiriEvent) => void) {
    return subprocess("niri msg --json event-stream", (stdout) => {
        const event: NiriEvent = JSON.parse(stdout.toString());
        callback(event);
    });
}
