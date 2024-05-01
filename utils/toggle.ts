import { Window } from "resource:///com/github/Aylur/ags/widget.js"
import { Hyprland, Monitor } from "types/service/hyprland"

export enum ToggleState {
    Skipped,
    Added,
    Removed
}
const hyprland = await Service.import('hyprland')

/**
 * Opens or closes a window for all monitors
 */
// export function prepToggle(
//     Name: (monitor: Monitor) => string, 
//     WindowConstructor: (monitor: Monitor) => ReturnType<typeof Window>
// ){  
//     function toggle(name:string) {
//         if (App.getWindow(name)) {
//             App.removeWindow(name)
//             console.log(`Removed ${name}`)
//             return ToggleState.Removed
//         } else {
//             App.addWindow(WindowConstructor(monitor))
//             console.log(`Added ${name}`)
//             return ToggleState.Added
//         }
//     }
//     function toggleAll() {
//         return hyprland.monitors.map((monitor) => {
//             if (monitor.dpmsStatus == false) {
//                 console.log(`Monitor(${monitor.id}, ${monitor.name}) is off`)
//                 return ToggleState.Skipped
//             }
//             toggle(Name(monitor))
//         })
//     }

//     return toggle
// }

export function prepToggle(
    name:string,
    WindowConstructor: () => ReturnType<typeof Window>
) {
    function toggle() {
        if (App.getWindow(name)) {
            App.removeWindow(name)
            console.log(`Removed ${name}`)
            return ToggleState.Removed
        } else {
            App.addWindow(WindowConstructor())
            console.log(`Added ${name}`)
            return ToggleState.Added
        }
    }

    return toggle
}
