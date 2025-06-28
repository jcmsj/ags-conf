import GObject, { getter, register, setter } from "ags/gobject"
import { exec, subprocess } from "ags/process"
import AstalIO from "gi://AstalIO?version=0.1"

@register({ GTypeName: "Niri" })
export default class Niri extends GObject.Object {
    static instance: Niri
    static get_default() {
        if (!this.instance)
            this.instance = new Niri()

        return this.instance
    }

    #windows: Object[] = [];
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
        this.notify('activeWindow');
    }

    listen() {
        this.#handle = subprocess("niri msg --json event-stream", (stdout) => {
            const event = JSON.parse(stdout.toString())
            if (event.WindowOpenedOrChanged) {
                console.log("WindowOpenedOrChanged", event)
                const win = event.WindowOpenedOrChanged.window;
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
            } else if (event.WindowFocusChanged) {
                console.log("WindowFocusChanged")
                this.activeWindow = event.WindowFocusChanged.id
                this.windows = this.windows.map(w => {
                    if (w.id === event.WindowFocusChanged.id) {
                        return { ...w, is_focused: true };
                    }
                    return { ...w, is_focused: false };
                });
            } else if (event.WindowClosed) {
                console.log("WindowClosed")
                this.windows = this.windows.filter(w => w.id !== event.WindowClosed.id)
            } else if (event.WindowsChanged) {
                console.log("WindowsChanged")
                this.windows = event.WindowsChanged.windows
            }
        })
    }

    focusWindow(windowId: string) {
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
