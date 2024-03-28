const network = await Service.import('network');

const bindWifiSSID = () => network.wifi.bind('ssid').as(ssid => ssid || 'Unknown');
const WifiIndicator = () => Widget.Icon({
    tooltipText: bindWifiSSID(),
    icon: network.wifi.bind('icon_name'),
})
const WiredIndicator = () => Widget.Icon({
    icon: network.wired.bind('icon_name'),
});

export const NetworkSSID = () => Widget.Label({
    label: bindWifiSSID(),
});
export const Indicator = () => Widget.Stack({
    children: {
        wifi: WifiIndicator(),
        wired: WiredIndicator(),
    },
    shown: network.bind('primary').as(p => p || 'wifi'),
});

export function PanelEntry() {
    return Widget.Box({
        spacing: 5,
        children: [
            Indicator(),
            NetworkSSID(),
        ],
    });
}
