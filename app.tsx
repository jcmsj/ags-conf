import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widget/Bar"
import { createBinding, For } from "ags"
import { Gtk } from "ags/gtk4"


function main() {
  const monitors = createBinding(app, "monitors")

  return (
    <For each={monitors} cleanup={(win) => (win as Gtk.Window).destroy()
    }>
      {(m) => <Bar gdkmonitor={m} />}
    </For>
  )
}

app.start({
  css: style,
  main,
});
