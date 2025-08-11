import { createBinding, createComputed } from "ags";
import { exec } from "ags/process";
import Network from "gi://AstalNetwork";
import AstalNetwork from "gi://AstalNetwork?version=0.1";

export function NetworkPanel() {
    const network = Network.get_default()!;
    const wifi = createBinding(network, "wifi");
    const activeConnection = createBinding(network.wifi, 'activeConnection')
    const wired = createBinding(network, "wired");
    const connectionText = createComputed([wifi,activeConnection], (wifi,activeConnection) => {
        if (!wifi.enabled) {
            return `Wi-Fi: Disabled`;
        } else if (activeConnection) {
            return `Wi-Fi: ${activeConnection.id}`;
        } 

        return `Wi-Fi: Disconnected`;
    });
    const signalStrength = createComputed([wifi], (wifi) => {
        return `Signal Strength: ${wifi.enabled ? wifi.strength.toString() + "%" : "N/A"}`;
    });
    const handleNetworkClick = () => {
        exec("rofi-network-manager");
    };

    const tooltipText = createComputed([connectionText,wired,wifi,signalStrength], (connectionText,wired,wifi,signalStrength) => {
      if (wifi.enabled) {
            return `${connectionText}\n${signalStrength}`;
        } else if (wired.internet == AstalNetwork.Internet.CONNECTED && wired.device.activeConnection !== null) {
            return `Wired: ${wired.device.activeConnection.id}\nSpeed: ${wired.speed} Mbps`;
        } else {
            return "No Network Connection";
        }
    })

    const iconName = createComputed([wired,wifi], (wired,wifi) => {
        if (wifi.enabled) {
            return wifi.iconName;
        } else if (wired.internet == AstalNetwork.Internet.CONNECTED)  {
            return wired.iconName;
        }
        return "network-disconnected-symbolic";
    })
    return (
        <box class="Network Panel SingleItem">
            <button
                widthRequest={5}
                heightRequest={5}
                tooltipText={tooltipText}
                onClicked={handleNetworkClick}
            >
            <image iconName={iconName} />
            </button>
        </box>
    );
}
