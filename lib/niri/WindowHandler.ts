import GObject, { getter, register, setter } from "ags/gobject"
import { exec } from "ags/process"
import AstalIO from "gi://AstalIO?version=0.1"
import { niriEventStream, NiriWindow } from "./events"

@register({ GTypeName: "NiriWindowHandler" })
export default class NiriWindowHandler extends GObject.Object {
    static instance: NiriWindowHandler
    static get_default() {
        if (!this.instance)
            this.instance = new NiriWindowHandler()
        return this.instance
    }

    #windows: NiriWindow[] = [];
    #handle: AstalIO.Process | null = null;
    // todo: workspaces
    @getter(Array)
    get windows() {
        return this.#windows;
    }

    @setter(Array)
    set windows(value) {
        this.#windows = value;
        this.notify('windows');
    }

    #activeWindow: number  = -1;
    @getter<number>(Number)
    get activeWindow() {
        return this.#activeWindow;
    }

    @setter(Number)
    set activeWindow(value: number) {
        this.#activeWindow = value ?? -1;
    }

    listen() {
        this.#handle = niriEventStream((ev) => {
            if (ev.WindowOpenedOrChanged) {
                // console.log("WindowOpenedOrChanged", ev)
                const win = ev.WindowOpenedOrChanged.window;
                const existingIndex = this.windows.findIndex(w => w.id === win.id)
                if (existingIndex >= 0) {
                    const windows = [...this.windows];
                    console.log(win)
                    windows[existingIndex] = win; // Update the existing window
                    this.windows = windows;
             
                } else {
                    this.windows = [...this.windows, win]
                }
                if (win.is_focused) {
                    this.activeWindow = win.id
                }
            } else if (ev.WindowFocusChanged) {
                // console.log("WindowFocusChanged")
                this.activeWindow = ev.WindowFocusChanged.id
                this.windows = this.windows.map(w => {
                    if (w.id === ev.WindowFocusChanged!.id) {
                        return { ...w, is_focused: true };
                    }
                    return { ...w, is_focused: false };
                });
            } else if (ev.WindowClosed) {
                // console.log("WindowClosed")
                this.windows = this.windows.filter(w => w.id !== ev.WindowClosed!.id)
            } else if (ev.WindowsChanged) {
                // console.log("WindowsChanged")
                this.windows = ev.WindowsChanged.windows
            }
        })
    }

    focusWindow(windowId: number) {
        // Focus a specific window by its ID
        console.log(`Focusing window with ID: ${windowId}`)
        exec(`niri msg action focus-window --id ${windowId}`)
    }

    constructor() {
        super()
        // Initialize any properties or state here
        this.listen();
        this.notify('ready');
    }

    destroy() {
        this.#handle?.kill();
    }
}
