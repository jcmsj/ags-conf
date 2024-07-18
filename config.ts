import { NotificationPopups } from "./notification.js";
import { TaskBar, Name as TaskBarName } from "./taskbar.js";
const hyprland = await Service.import('hyprland')
const styleRoot = `${App.configDir}/styles`
const css = `${styleRoot}/main.css`
App.addIcons(`${App.configDir}/assets`)

App.config({
  windows: [
    ...hyprland.monitors.map(monitor => TaskBar(monitor.id)),
    ...hyprland.monitors.map(monitor => NotificationPopups(monitor.id)),
  ],
  onConfigParsed(app) {
    App.applyCss(css)
  },
});

Utils.monitorFile(
  // directory that contains the scss files
  styleRoot,
  // reload function
  function () {
    // main scss file
    // const scss = `${App.configDir}/style.scss`

    // target css file
    // compile, reset, apply
    // Utils.exec(`sassc ${scss} ${css}`)
    App.resetCss()
    App.applyCss(css)
  },
)

hyprland.connect("monitor-added", (h, name: string) => {
  hyprland.monitors.forEach(m => {
    if (!m.dpmsStatus) {
      console.log(`Monitor(${m.id}, ${name}) is off`)
      return
    }
    App.removeWindow(TaskBarName(m.id)) // assures no duplicates
    App.addWindow(TaskBar(m.id))
  })
  const summary = `Monitor:${name} added`
  Utils.notify({
    summary,
    appName: "hyprland",
    timeout: 5000,
  })
  console.log(summary)
})

hyprland.connect("monitor-removed", (h, name: string) => {
  const monitor = hyprland.monitors.find(m => m.name === name)
  if (!monitor) return
  App.removeWindow(TaskBarName(monitor.id))
})
