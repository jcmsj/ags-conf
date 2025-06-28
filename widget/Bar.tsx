import app from "ags/gtk4/app"
import { Astal, Gdk } from "ags/gtk4"
import { BatteryPercentage } from "./BatteryPercentage"
import { DateTime } from "./DateTime"
import { BrightnessSlider } from "./BrightnessSlider"
import { VolumeSlider } from "./VolumeSlider"
import { PowerPanel } from "./Power"
import { NetworkPanel } from "./Network"
import { TrayPanel } from "./Tray"
import { WorkspacePanel } from "./Workspace"
const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
export default function Bar(gdkmonitor: Gdk.Monitor) {
    console.log(gdkmonitor.geometry.x, gdkmonitor.geometry.y)

  return (
    <window
      visible
      name="bar"
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox cssName="centerbox" >
        <box $type='start'>
          {/* left */}
          <PowerPanel />
          &nbsp;
          <WorkspacePanel monitor={gdkmonitor} />
        </box>
        {/* center */}
        <box $type='center'>
            <DateTime />
        </box>
        {/* right */}
        <box $type='end' >
          <TrayPanel />
          &nbsp;
          <NetworkPanel />
          &nbsp;
          <BrightnessSlider />
          &nbsp;
          <VolumeSlider />
          &nbsp;
          <BatteryPercentage />
        </box>
      </centerbox>
    </window>
  )
}
