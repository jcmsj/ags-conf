import { SliderProps } from "types/widgets/slider.js"
const audio = await Service.import('audio')
const icons = {
    101: "overamplified",
    67: "high",
    34: "medium",
    1: "low",
    0: "muted",
}
function getIcon() {
    const icon = audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
        threshold => threshold <= audio.speaker.volume * 100)!
        
    return `audio-volume-${icons[icon]}-symbolic`
}
export const Slider = (props:SliderProps = {}) => Widget.Slider({
    ...props,
    hexpand: true,
    draw_value: false,
    on_change: ({ value }) => audio.speaker.volume = value,
    setup: self => self.hook(audio.speaker, () => {
        self.value = audio.speaker.volume || 0
    }),
})
export function Indicator() {
    const icon = Widget.Icon({
        icon: Utils.watch(getIcon(), audio.speaker, getIcon),
    })
    return icon
}

export const Label = () => Widget.Label({
    label: audio.speaker.bind("volume").as(v => `${Math.round(v * 100)}`),
    setup: self => self.hook(audio.speaker, () => {
        self.label = `${Math.round(audio.speaker.volume * 100)}`
    }),
})
export function PanelEntry() {
    return Widget.Box({
        spacing: 5,
        children: [
            Indicator(),
            Slider(),
            Label(),
        ],
    })
}
