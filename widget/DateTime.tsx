import { createComputed, createState } from "ags";
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createPoll } from "ags/time";
// mm/dd hh:mm AM/PM
type VIEW_MODES = '12hrtime' | 'mmm dd' | 'datetime'
const VIEW_MODES_ARRAY: VIEW_MODES[] = ['datetime', '12hrtime', 'mmm dd']
// ph manila
const timezone_diff = 8;
const OPTIONS: Record<VIEW_MODES, Intl.DateTimeFormatOptions> = {
    'datetime': { hour: '2-digit', minute: '2-digit', month: 'short', day: '2-digit' },
    // e.g: 12:34 PM
    '12hrtime': { hour: '2-digit', minute: '2-digit' },
    // e.g: Dec 31
    'mmm dd': { month: 'short', day: '2-digit',dateStyle: 'short' }
}
function derive(time: string, viewModeIndex: number): string {
    const d = new Date(time)
    d.setHours(d.getHours() + timezone_diff)
    const viewMode = VIEW_MODES_ARRAY[viewModeIndex]
    return d.toLocaleString('en-US', OPTIONS[viewMode])
}
export function DateTime() {
    const [viewModeIndex, setViewModeIndex] = createState(0);
    const time = createPoll('', 1000, 'date');
    const viewLabel = createComputed([time, viewModeIndex], (time, viewModeIndex) => {
        return derive(time, viewModeIndex)
    })

    return <menubutton
        hexpand
        class="DateTime Panel SingleItem"
        // onButtonPressed={() => {
        //     const currentIndex = viewModeIndex.get()
        //     const nextIndex = (currentIndex + 1) % VIEW_MODES_ARRAY.length
        //     setViewModeIndex(nextIndex)
        //     console.log('viewMode', VIEW_MODES_ARRAY[nextIndex])
        // }}
        halign={Gtk.Align.CENTER}
    >
        <label label={viewLabel} />
        <popover>
            <Gtk.Calendar />
        </popover>
    </menubutton>
}
