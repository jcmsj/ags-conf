import { PowerMenu, PowerMenuButton } from "./powermenu.js"
import { Application } from "types/service/applications"
import { Client } from "types/service/hyprland"
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

export const taskBar = (monitor: number) => Widget.Window({
    name: `taskBar-${monitor}`,
    monitor,
    exclusivity: "exclusive",
    anchor: ['bottom', 'left', 'right'],
    child: Widget.Box({
        children: [
            PowerMenuButton(),
            taskBarItems(),
        ],
    }),
    setup(self) {
        self.hook(hyprland, (h, name?:string) => {
            self.child
        }, "monitor-added")
    },
})

hyprland.connect("monitor-added", (h, name:string) => {
    console.log(name)
    // TODO
    App.addWindow(taskBar(Number(name)))
})
