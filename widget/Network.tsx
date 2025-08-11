import { createBinding, createComputed } from "ags";
import { exec } from "ags/process";
import Network from "gi://AstalNetwork";
import AstalNetwork from "gi://AstalNetwork?version=0.1";

export function NetworkPanel() {
    const network = Network.get_default()!;
    const wifi = createBinding(network, "wifi");
    const wired = createBinding(network, "wired");
    const activeConnectionId = createComputed([wifi], (wifi) => {
        if (!wifi.enabled) {
            return `Wi-Fi: Disabled`;
        } else if (wifi.activeConnection) {
            return `Wi-Fi: ${wifi.activeConnection.id}`;
        } 

        return `Wi-Fi: Disconnected`;
    });
    const signalStrength = createComputed([wifi], (wifi) => {
        return `Signal Strength: ${wifi.enabled ? wifi.strength.toString() + "%" : "N/A"}`;
    });
    const handleNetworkClick = () => {
        exec("rofi-network-manager");
    };

    const getTooltipText = () => {
        if (wifi.get().enabled) {
            return `${activeConnectionId.get()}\n${signalStrength.get()}`;
        } else if (wired.get().internet == AstalNetwork.Internet.CONNECTED) {
            return `Wired: ${network.wired.connection.id}\nSpeed: ${network.wired.speed} Mbps`;
        } else {
            return "No Network Connection";
        }
    };

    return (
        <box class="Network Panel SingleItem">
            <button
                widthRequest={5}
                heightRequest={5}
                tooltipText={getTooltipText()}
                onClicked={handleNetworkClick}
            >
                {
                    wifi.as(it => it.enabled) ?
                        <image iconName={wifi.get().iconName} /> :
                        wired.as(it => it.internet == AstalNetwork.Internet.CONNECTED) ?
                            <image iconName={wired.get().iconName} />
                            :
                            <image iconName="network-disconnected-symbolic" />
                }
            </button>
        </box>
    );
}
