import { createBinding, createComputed, createState } from "ags";
import Wp from "gi://AstalWp";
import { percent } from "../lib/utils/percent";
import { Gtk } from "ags/gtk4";

function getVolumeIcon(speaker: Wp.Endpoint): string {
  if (speaker.mute) return "audio-volume-muted-symbolic";
  if (speaker.volume <= 0.33) return "audio-volume-low-symbolic";
  if (speaker.volume <= 0.66) return "audio-volume-medium-symbolic";
  if (speaker.volume <= 1) return "audio-volume-high-symbolic";
  return "audio-volume-overamplified-symbolic";
}

const STEP_SIZE = 1 //%
export function VolumeSlider() {
  const wp = Wp.get_default()!;
  const [volumeIcon, setVolumeIcon] = createState('')
  const speaker = wp.audio.defaultSpeaker;

  speaker.connect("notify::mute", () => setVolumeIcon(getVolumeIcon(speaker)));
  speaker.connect("notify::volume", () => setVolumeIcon(getVolumeIcon(speaker)));
  const volumeValue = createBinding(speaker, 'volume');
  const volumeLabel = createComputed([volumeValue], percent);
  const speakerName = createBinding(speaker, 'name');
  // wp.connect('ready', () => {
  //   setVolumeIcon(getVolumeIcon(speaker));
  // })

  const tooltip = createComputed([speakerName,volumeLabel], (name,volumeLabel) => {
    // <speaker name>: <volume>%
    return `${name ?? 'Default'}: ${volumeLabel}`;
  });
  return (
    <menubutton class="Audio Panel SingleItem" tooltipText={tooltip}>
      <image iconName={volumeIcon} tooltipText={volumeLabel} />
      {/* TODO: mute button */}
      <popover>
        <box orientation={Gtk.Orientation.VERTICAL}>
          <label label={volumeLabel} />
          <slider
            max={150}
            min={0}
            vexpand
            orientation={Gtk.Orientation.VERTICAL}
            widthRequest={10}
            heightRequest={100}
            step={STEP_SIZE}
            class="flip-180"
            value={volumeValue.get()*100}
            onValueChanged={(slider) => {
              speaker.volume = slider.value/100;
            }}
          />
        </box>
      </popover>
    </menubutton>
  )
}
