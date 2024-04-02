import { taskBar } from "./taskbar.js";
const hyprland = await Service.import('hyprland')
const styleRoot = `${App.configDir}/styles`
const css = `${styleRoot}/main.css`
App.addIcons(`${App.configDir}/assets`)

App.config({ 
    windows: [
      ...hyprland.monitors.map(monitor => taskBar(monitor.id)),
    ], 
    onConfigParsed(app) {
      App.applyCss(css)
    },
});

Utils.monitorFile(
  // directory that contains the scss files
  styleRoot,
  // reload function
  function() {
      // main scss file
      // const scss = `${App.configDir}/style.scss`

      // target css file
      // compile, reset, apply
      // Utils.exec(`sassc ${scss} ${css}`)
      App.resetCss()
      App.applyCss(css)
  },
)
hyprland.connect("monitor-added", (h, name:string) => {
  console.log("Added monitor", name)
  const monitor = hyprland.monitors.find(m => m.name === name)
  // check if taskbar runs in the monitor already:
  if (!monitor) {
    console.log("Monitor is not found", name)
    return
  }
  if (!monitor.dpmsStatus) {
    console.log(`Monitor(${monitor.id}, ${name}) is off`)
    return
  }
  const exists = App.windows.find(w => w.name === `taskBar-${monitor.id}`)
  if (exists) {
    console.log("Taskbar already exists")
    return
  }
  // else, add a new taskbar
  App.addWindow(taskBar(monitor.id))
})
