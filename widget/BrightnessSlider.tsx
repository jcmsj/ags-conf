import { createBinding, createComputed } from "ags"
import Brightness from "../lib/brightness"
import { percent } from "../lib/utils/percent"
import { Gtk } from "ags/gtk4"

export function BrightnessSlider() {
  const brightness = Brightness.get_default()
  const brightnessValue = createBinding(brightness, "screen")
  const brightnessLabel = createComputed([brightnessValue], percent)
  const tooltip = createComputed([brightnessValue], (value) => {
    // Brightness: <value>%
    return `Brightness: ${value * 100}%`
  })
  return <box name="BrightnessPanel" class="Brightness Panel SingleItem">
    <menubutton widthRequest={5} heightRequest={5} tooltipText={tooltip}>
      <image iconName="display-brightness-symbolic" />
      <popover>
        <box orientation={Gtk.Orientation.VERTICAL}>
          <label label={brightnessLabel} cssName="BrightnessLabel" />
          <slider
            max={100}
            min={10}
            widthRequest={10}
            heightRequest={100}
            vexpand
            orientation={Gtk.Orientation.VERTICAL}
            // flip 180
            class="flip-180"
            value={brightnessValue.get() * 100}
            onValueChanged={(slider) => {
              brightness.screen = slider.value / 100
            }}
          />
        </box>
      </popover>
    </menubutton>
  </box>
}
