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
  console.log(name)
  // check if taskbar runs in the monitor already:
  const exists = App.windows.find(w => w.name === `taskBar-${name}`)
  if (exists) return
  // else, add a new taskbar
  App.addWindow(taskBar(Number(name)))
})

