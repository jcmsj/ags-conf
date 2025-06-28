import { Gtk } from "ags/gtk4";
import Network from "gi://AstalNetwork";

export function NetworkPanel() {
    const network = Network.get_default()!;
    // for now, no actions, just show network status
    // for the popup button, just show the wired/wireless and network strength via icons
    
    // for the popover content,
    // show network name, type (wired/wireless), and strength
    return (
        <box class="Network Panel SingleItem">
            <menubutton widthRequest={5} heightRequest={5} tooltipText="Network Options">
                {/* popup button via image */}
                {
                    network.wifi.enabled ?
                    <image iconName={network.wifi.iconName} tooltipText={network.wifi.activeConnection.id} /> :

                    network.wired.enabled ?
                    <image iconName={network.wired.iconName} tooltipText={network.wired.connection.id} />
                    :
                    <image iconName="network-disconnected-symbolic" tooltipText="No Network Connection" />
                }
                
                {/* <image iconName={ ? "network-wireless-connected-symbolic" : "network-wireless-disconnected-symbolic"} /> */}
                <popover>
                    <box orientation={Gtk.Orientation.VERTICAL} class={'text-left'}>
                        {/* diff results based on wifi/wired/disabled */}
                        {
                            network.wifi.enabled ? (
                                <>
                                    <label label={`Wi-Fi: ${network.wifi.activeConnection.id}`} />
                                    <label label={`Signal Strength: ${network.wifi.strength}%`} />
                                </>
                            ) : network.wired.enabled ? (
                                <>
                                    <label label={`Wired: ${network.wired.connection.id}`} />
                                    <label label={`Speed: ${network.wired.speed} Mbps`} />
                                    <image iconName={network.wired.iconName} />
                                </>
                            ) : (
                                <label label="No Network Connection" />
                            )
                        }
                        </box>
                </popover>
            </menubutton>
        </box>
    );
}
