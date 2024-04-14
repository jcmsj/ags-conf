const battery = await Service.import('battery');

function Percent() {
    return battery.bind("percent").as(p => `${p}%`)
}
export function BatteryIndicator() {
    const icon = battery.bind("icon_name")
    return Widget.Box({
        class_name: "battery",
        tooltipText: Percent(),
        children: [
            Widget.Icon({ icon }),
        ],
    })
}

function secToHours(seconds:number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}hr ${minutes.toString().padStart(2, '0')}m`;
}
export function PanelEntry() {
    const timeTilFullCharge = battery.bind("time_remaining")
        .as(r => {
            if (!battery.charging || battery.charged) {
                return ""
            }

            return `${secToHours(r)} to full`
        });
    const icon = battery.bind("icon_name")

    return Widget.Box({
        children: [
            Widget.Icon({ icon }),
            
            Widget.Label({
                label: Percent(),
                margin: 4,
            }),
            Widget.Label({
                label: timeTilFullCharge,
                margin: 4,
            }),
        ],
    })
}
