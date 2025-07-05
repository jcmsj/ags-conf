import { createComputed } from "ags";
import { Gtk } from "ags/gtk4"
import { createPoll, } from "ags/time";
// mm/dd hh:mm AM/PM
// type VIEW_MODES = '12hrtime' | 'mmm dd' | 'datetime'
// const VIEW_MODES_ARRAY: VIEW_MODES[] = ['datetime', '12hrtime', 'mmm dd']
// // ph manila
// const OPTIONS: Record<VIEW_MODES, Intl.DateTimeFormatOptions> = {
//     'datetime': { hour: '2-digit', minute: '2-digit', month: 'short', day: '2-digit' },
//     // e.g: 12:34 PM
//     '12hrtime': { hour: '2-digit', minute: '2-digit' },
//     // e.g: Dec 31
//     'mmm dd': { month: 'short', day: '2-digit',dateStyle: 'short' }
// }
function now(): string {
    const d = new Date()
    const pht = new Intl.DateTimeFormat('en-PH', {
        timeZone: 'Asia/Manila',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
    return pht.format(d)
}
export function DateTime() {
    // const [viewModeIndex, setViewModeIndex] = createState(0);
    const clock = createPoll('', 1000, 'date');
    const viewLabel = createComputed([clock], now);

    return <menubutton
        hexpand
        class="DateTime Panel SingleItem"
        halign={Gtk.Align.CENTER}
    >
        <label label={viewLabel} />
        <popover>
            <Gtk.Calendar />
        </popover>
    </menubutton>
}
