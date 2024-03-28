import Gtk from 'gi://Gtk?version=3.0';
import { EventBoxProps } from 'types/widgets/eventbox';
import { RevealerProps } from 'types/widgets/revealer';
// Given:
// 1. Window
// 2. Indicator
// Create:
// 1. Revealer
// 2. Variable
export function createPopup({
    child,
    indicator,
    windowProps,
    revealerProps,
    eventBoxProps,
    initialyRevealed = false,
}: {
    child: Gtk.Widget,
    indicator: Gtk.Widget,
    // cant use WindowProps cause it doesnt have monitor.id
    // TODO: Improve types to prevent redeclaring the same field
    windowProps: Parameters<typeof Widget.Window>[0], 
    revealerProps: RevealerProps,
    eventBoxProps?: EventBoxProps,
    initialyRevealed?: boolean,
}) {
    const revealerChild = Variable(initialyRevealed)
    const revealer = Widget.Revealer({
        ...revealerProps,
        child: child,
        revealChild: revealerChild.bind(),
    })
    return {
        indicator: Widget.EventBox({
            ...eventBoxProps,
            child: indicator,
            onPrimaryClick: () => {
                revealerChild.setValue(!revealerChild.value)
            },
        }),
        window: (monitor:number) => Widget.Window({
            ...windowProps,
            name: `${windowProps?.name}-${monitor}`,
            monitor,
            // need to add a padding cause of an ags bug
            // see https://github.com/Aylur/ags/issues/59
            child: Widget.Box({
                css: "padding: 1px;", 
                child:revealer
            })
        }),
    }
}

