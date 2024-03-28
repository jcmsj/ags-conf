/**
 * attaches a destroy event to the window
 */
export default function Win(...args: Parameters<typeof Widget.Window>) {
    return Widget.Window(...args)
    .on('destroy', self => {
        App.removeWindow(self)
    })
}
