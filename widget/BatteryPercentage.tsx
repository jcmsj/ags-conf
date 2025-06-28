import { createBinding, createComputed } from "ags"
import Battery from "gi://AstalBattery"
import { percent } from "../lib/utils/percent";

function secsToHrsAndMins(secs: number): string {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export function BatteryPercentage() {
  const bat = Battery.get_default()
  const batteryIconName = createBinding(bat, 'battery_icon_name');
  const percentage = createBinding(bat, 'percentage');
  const percentLabel = createComputed([percentage], percent);
  const timeToFull= createBinding(bat, 'timeToFull');
  const timeToEmpty = createBinding(bat, 'time_to_empty');

  const estimateText = createComputed([timeToFull,timeToEmpty], (toFull, toEmpty) => {
    if (bat.charging) {
      return `Time to full: ${secsToHrsAndMins(toFull)}`;
    } else {
      return `Time left: ${secsToHrsAndMins(toEmpty)}`;
    }
  })
  return <box class="Battery Panel" name="BatteryPanel"  tooltipText={
      // estimate
      // show time to full if charging or time to empty if discharging
      estimateText
    }>
    <label label={percentLabel} cssName="BatteryPercentage" />
    &nbsp;
    <image iconName={batteryIconName} />
    {/* percent label */}
  </box>
}
