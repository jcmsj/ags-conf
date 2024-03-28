const battery = await Service.import('battery');

export function BatteryIndicator() {
    const value = battery.bind("percent").as(p => p > 0 ? p / 100 : 0)
    const icon = battery.bind("percent").as(p =>
        `battery-level-${Math.abs(Math.floor(p / 10) * 10)}-symbolic`)

    return Widget.Box({
        class_name: "battery",
        visible: battery.bind("available"),
        tooltipText: battery.bind("percent").as(p => `${p}%`),
        children: [
            Widget.Icon({ icon }),
            // Widget.LevelBar({
            //     widthRequest: 140,
            //     vpack: "center",
            //     value,
            // }),
        ],
    })
}

