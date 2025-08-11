#!/bin/bash

# WiFi Network Switcher
# Switches between `SJF_5GHz` and `vivo V40 lite` networks using NetworkManager CLI

# Define the two WiFi networks
NETWORK1="SJF_5GHz"
NETWORK2="vivo V40 Lite"

# Get currently connected WiFi network
current_network=$(nmcli -t -f active,ssid dev wifi | grep '^yes' | cut -d: -f2)

echo "Currently connected to: $current_network"

# Determine which network to switch to
if [ "$current_network" = "$NETWORK1" ]; then
    target_network="$NETWORK2"
elif [ "$current_network" = "$NETWORK2" ]; then
    target_network="$NETWORK1"
else
    # If not connected to either, default to the first network
    echo "Not connected to either target network. Connecting to $NETWORK1..."
    target_network="$NETWORK1"
fi

echo "Switching to: $target_network"

# Attempt to connect to the target network
if nmcli dev wifi connect "$target_network"; then
    echo "Successfully connected to $target_network"
else
    echo "Failed to connect to $target_network"
    echo "Available networks:"
    nmcli dev wifi list
    exit 1
fi
