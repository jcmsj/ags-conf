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

function focus(client:Client) {
    hyprland.messageAsync(`dispatch focuswindow address:${client.address}`)
}
const overrides = {
    byInitialClass: {
        "firefox-aurora": "Firefox DevEdition",
        "org.gnome.nautilus":"Files",
        "org.gnome.texteditor": "Text Editor",
    }
}
function item(client: Client) {
    const target = {
        initialTitle: client.initialTitle.toLowerCase(),
        initialClass: client.initialClass.toLowerCase(),
        title: client.title.toLowerCase(),
        class: client.class.toLowerCase(),
    }

    const override = overrides["byInitialClass"][target.initialClass]
    let app:Application|undefined = undefined
    // check overrides
    if (override) app = apps.list.find(app => app.name === override)
    // by initial title
    if (!app ) app= apps.list.find(app => {
        const name = app.name.toLowerCase()
        return name == target.initialTitle || name == target.initialClass || app.icon_name == target.class
    })
    // by initial class
    if (!app) app = apps.list.find(app => app.name.toLowerCase() === target.initialClass)
    
    const data = {
        icon: app?.icon_name || "application-x-executable",
    }
    return Widget.Button({
        classNames: ["taskbar-item"],
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
}

function clientByAddress(address:string) {
    return hyprland.clients.find(client => client.address.localeCompare(address) === 0)
}   
function taskBarItems() {
    return Widget.Box({
        children: hyprland.clients.map(item),
        setup: self =>
            self.hook(hyprland, (w, address?: string) => {
                // TODO: Sort
                if (!address) return
                const client = clientByAddress(address)
                if (!client) return
                console.log("Client added", client)
                self.children = [...self.children, item(client)]
            }, "client-added")
        .hook(hyprland, (w, address?: string) => {
            if (!address) return
            self.children = self.children.filter(child =>
                child.name !== `client-${address}`
            )
        }, "client-removed")
    })
}

function groupByWorkspace(clients: Client[]) {
    return clients.reduce((acc, client) => {
        const workspace_box = acc[client.workspace.id]
        if (workspace_box !== undefined) {
            workspace_box.children = [...workspace_box.children, item(client)]
        } else {
            acc[client.workspace.id] = Widget.Box({
                classNames: ["taskbar-group"],
                children:[item(client)]
            })
        }
        return acc
    }, {} as Record<string, ReturnType<typeof Widget.Box>>)
}
function groupedTaskBarItems() {
    function asBoxes(grouped: Record<string, ReturnType<typeof Widget.Box>>) {
        return Object.entries(grouped).map(([id, box]) => Widget.Box({
            children: [
                box,
            ]
        }))
    }
    return Widget.Box({
        children: asBoxes(groupByWorkspace(hyprland.clients)),
        setup: self => {
            self.hook(hyprland, (w, address?: string) => {
                const grouped = groupByWorkspace(hyprland.clients)
                self.children = asBoxes(grouped)
            }, "client-added")
            self.hook(hyprland, (w, address?: string) => {
                const grouped = groupByWorkspace(hyprland.clients)
                self.children = asBoxes(grouped)
        }, "client-removed")
        }
    })
}

export function Name(monitorid:number) {
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

