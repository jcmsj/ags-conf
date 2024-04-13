import { SliderProps } from 'types/widgets/slider.js';
import brightness from './services/brightness.js';

export const Slider = (props:SliderProps = {}) => Widget.Slider({
    ...props,
    hexpand: true,
    drawValue: false,
    on_change: self => brightness.screen_value = Math.round(self.value),
    value: brightness.bind("screen_value"),
});

export const Icon = () => Widget.Icon({
    icon: "display-brightness-symbolic",
});

export const Label = () => Widget.Label({
    label: brightness.bind("screen_value").as(v => `${v * 100}`),
});

export function PanelEntry() {
    return Widget.Box({
        spacing: 5,
        children: [
            Icon(),
            Slider(),
            Label(),
        ],
    });
}
