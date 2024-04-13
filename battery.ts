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

export function PanelEntry() {
    const timeTilFullCharge = battery.bind("time_remaining")
        .as(r => {
            if (battery.charged) {
                return ""
            }

            return `Time to full: ${r}`
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
