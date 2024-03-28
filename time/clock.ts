import { createPopup } from "../popup/popup.js"

const date = Variable("", {
    poll: [1000, 'date "+%I:%M %p"'],
})
export function ClockIndicator() {
    return Widget.Label({
        class_name: "clock",
        label: date.bind(),
    })
}

export const Clock = () => createPopup({
    indicator: ClockIndicator(),
    windowProps: {
        name: 'clock',
        anchor: ['bottom', 'right'],
    },
    revealerProps: {
        transitionDuration: 300, // in ms
        transition: 'slide_up',
    },
    child: Widget.Calendar({

    })
})
