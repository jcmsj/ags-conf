import { clock } from "./time/clock.js";
import { taskBar } from "./taskbar.js";
import { unifiedPanel } from "./unifiedPanel.js";
const hyprland = await Service.import('hyprland')
const styleRoot = `${App.configDir}/styles`
const css = `${styleRoot}/main.css`
App.addIcons(`${App.configDir}/assets`)

App.config({ 
    windows: [
      ...hyprland.monitors.map(monitor => taskBar(monitor.id)),
      ...hyprland.monitors.map(monitor => clock.window(monitor.id)),
      ...hyprland.monitors.map(monitor => unifiedPanel.window(monitor.id)),
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

// const botBar = (monitor: number) => Widget.Window({
//     name: `bar-${monitor}`,
//     anchor: ['top', 'left', 'right'],
//     child: Widget.Box({
//         children: [
//             NetworkIndicator(),
//         ],
//     }),
// })
