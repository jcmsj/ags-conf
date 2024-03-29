import * as network from "./network.js"
import { createPopup } from "./popup/popup.js"
import * as bt from "./bluetooth.js"
import * as brightness from "./brightness.js"
import * as volume from './volume.js'
export const UnifiedPanel = () => createPopup({
    indicator: Widget.Box({
        spacing: 2,
        children: [
            bt.Indicator(),
            network.Indicator(),
            volume.Indicator()
        ],
    }),
    child: Widget.Box({
        vertical:true,
        css: "padding: 0.5rem;",
        widthRequest: 200,
        children: [
            network.PanelEntry(),
            bt.PanelEntry(),
            brightness.PanelEntry(),
            volume.PanelEntry(),
        ],
    }),
    windowProps: {
        name: "unified",
        anchor: ['bottom','right'],
    },
    revealerProps: {
        transitionDuration: 200,
        transition: 'slide_up',
    },
})

