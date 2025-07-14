import app from "ags/gtk4/app"
import style from "./style.scss"
import { exec } from "ags/process"
import { ActiveWorkspaceSwitcher } from "./widget/ActiveWorkspaceSwitcher";
import NiriWindowHandler from "./lib/niri/WindowHandler";
import NiriWorkspaceHandler from "./lib/niri/WorkspaceHandler";

app.start({
    css: style,
    instanceName: "NiriActiveWorkspaceSwitcher",
    main() {
        const activeWorkspace = JSON.parse(exec("niri msg --json focused-output"));
        app.get_monitors().forEach((monitor) => {
            if (monitor.connector !== activeWorkspace.name) return;
            ActiveWorkspaceSwitcher(monitor)
        });
        // algo:
        // get active workspace
        // list apps for that workspace
        // display component in workspace's monitor
    },
    // requestHandler(request, response) {
    //     // --next
    //     const niri = NiriWindowHandler.get_default();
    //     const ws = NiriWorkspaceHandler.get_default();
    //     if (request == "--next") {
    //         const workspace = ws.activeWorkspace``;
    //     } else if (request == "--prev") {

    //     }




    //     // --prev
    // }
})
