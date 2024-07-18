import { BatteryIndicator } from "./battery.js"
import { PowerMenuButton } from "./powermenu.js"
import { Application } from "types/service/applications"
import { Client } from "types/service/hyprland"
import { Clock } from "./time/clock.js"
import { notificationIndicator } from "./notification.js"
import { UnifiedPanel } from "./unifiedPanel.js"
import Win from "./win.js"
import { SysTray } from "./systray.js"
const hyprland = await Service.import('hyprland')
const apps = await Service.import('applications')

function focus(client: Client) {
    hyprland.messageAsync(`dispatch focuswindow address:${client.address}`)
}

function item(client: Client) {
    let candidates = apps.query(client.initialTitle);

    if (candidates.length === 0) {
        candidates = apps.query(client.initialClass)
    }

    const app: Application | undefined = candidates.length ? candidates[0]: undefined
    const data = {
        icon: app?.icon_name || "application-x-executable",
    }
    const self = Widget.Button({
        // will be used to toggle active class
        attribute: {
            clientAddress: client.address,
            initialClass: client.initialClass,
        },
        classNames: [
            "taskbar-item",
        ],
        name: `client-${client.address}`,
        child: Widget.Icon({
            icon: data.icon,
        }),
        tooltipText: client.title,
        on_clicked(self) {
            console.log("Focusing:", client.title)
            focus(client)
        },
    })
    return self
}

function sortByInitialClass<T extends {attribute:{ initialClass: string}}>(...clients: T[]) {
    return clients.sort((a, b) => {
        if (a.attribute.initialClass < b.attribute.initialClass) return -1
        if (a.attribute.initialClass > b.attribute.initialClass) return 1
        return 0
    })
}
// function groupBy
function groupByWorkspace(clients: Client[]) {
    return clients.reduce((acc, client) => {
        const workspace_box = acc[client.workspace.id]
        if (workspace_box !== undefined) {
            // need to make a new array
            workspace_box.children = sortByInitialClass(...workspace_box.children, item(client))
        } else {
            acc[client.workspace.id] = Widget.Box({
                name: `workspace-${client.workspace.id}`,
                classNames: ["taskbar-group"],
                children: [item(client)]
            })
        }
        return acc
    }, {} as Record<string, ReturnType<typeof Widget.Box<ReturnType<typeof item>>>>)
}
function asBoxes<T>(grouped: Record<string, T>) {
    return Object.entries(grouped).map(([id, box]) => box)
}
function groupedTaskBarItems() {
    return Widget.Box({
        children: asBoxes(groupByWorkspace(hyprland.clients)),
        setup: self => {
            self.hook(hyprland, (w, address?: string) => {
                const grouped = groupByWorkspace(hyprland.clients)
                self.children = asBoxes(grouped)
            }, "client-added")
            self.hook(hyprland, (w, address?: string) => {
                self.children.map(
                    box => box.children
                    .find(item => item.attribute.clientAddress === address)?.destroy())
            }, "client-removed")
            self.hook(hyprland, (data: string, name: string) => {
                // https://wiki.hyprland.org/IPC/#events-list
                if (name == "movewindow" || name == "movewindowv2") {
                    const grouped = groupByWorkspace(hyprland.clients)
                    self.children = asBoxes(grouped)
                }
            }, "event")
            // update active class
            const highlightActiveWindow = () => {
                self.children.forEach(workspaceBox => {
                    workspaceBox.children.forEach(taskbarItem => {
                        taskbarItem.toggleClassName(
                            "active", 
                            taskbarItem.attribute?.clientAddress === hyprland.active.client.address
                        )
                    })
                })
            }
            self.hook(hyprland.active.client, highlightActiveWindow)
        }
    })
}

export function Name(monitorid: number) {
    return `taskbar-${monitorid}`
}
export const TaskBar = (monitorId: number) => {
    const clock = Clock()
    const unifiedPanel = UnifiedPanel()
    const systray = SysTray()
    const uP = unifiedPanel.window(monitorId)
    const clockWin = clock.window(monitorId)
    const systrayWin = systray.window(monitorId)
    App.addWindow(uP)
    App.addWindow(clockWin)
    App.addWindow(systrayWin)
    return Win({
        name: Name(monitorId),
        monitor: monitorId,
        exclusivity: "exclusive",
        anchor: ['bottom', 'left', 'right'],
        setup(self) {
            self.on('destroy', self => {
                uP.destroy()
                clockWin.destroy()
                systrayWin.destroy()
            })
        },
        child: Widget.CenterBox({
            startWidget: Widget.Box({
                name: `left-${monitorId}`,
                children: [
                    PowerMenuButton(),
                    groupedTaskBarItems(),
                ],
            }),
            centerWidget: Widget.Box({
                name: `center-${monitorId}`,
            }),
            endWidget: Widget.Box({
                name: `right-${monitorId}`,
                spacing: 5,
                marginEnd: 4,
                hpack: "end",
                children: [
                    systray.indicator,
                    unifiedPanel.indicator,
                    BatteryIndicator(),
                    clock.indicator,
                    notificationIndicator(),
                ],
            }),
        }),
    })
}

