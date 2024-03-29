import { createPopup } from "./popup/popup.js";
import { TrayItem } from "resource:///com/github/Aylur/ags/service/systemtray.js";

const systemtray = await Service.import('systemtray')

const SysTrayItem = (item:TrayItem) => Widget.Button({
    name: `tray-${item.id}`,
    child: Widget.Icon().bind('icon', item, 'icon'),
    tooltipMarkup: item.bind('tooltip_markup'),
    onPrimaryClick: (_, event) => item.activate(event),
    onSecondaryClick: (_, event) => item.openMenu(event),
});

export const sysTray = () => {
    return Widget.Box({
        hpack: "center",
        children: systemtray.bind('items')
            .as(items => items.map(SysTrayItem)),
    });
}

export const Indicator =  () => Widget.Icon({
    icon : 'go-up-symbolic'
})

export const SysTray = () => createPopup({
    child: sysTray(),
    indicator: Indicator(),
    windowProps: {
        name: "systray",
        anchor: ['bottom','right'],
        hpack: "baseline",
        css: "background: none",
    },
    revealerProps: {
        transitionDuration: 200,
        marginEnd: 110,
        css: "padding: 0.2em;",
        widthRequest: 100,
        transition: 'slide_up',
    },
})
