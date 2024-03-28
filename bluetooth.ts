const bluetooth = await Service.import('bluetooth')
// const ConnectedList = () => Widget.Box({
//     setup: self => self.hook(bluetooth, self => {
//         self.children = bluetooth.connected_devices
//             .map(({ icon_name, name }) => Widget.Box([
//                 Widget.Icon(icon_name + '-symbolic'),
//                 Widget.Label(name),
//             ]));

//         self.visible = bluetooth.connected_devices.length > 0;
//     }, 'notify::connected-devices'),
// })

const _conenctedWithBat = () => {
    return bluetooth.connected_devices
    .map(({ icon_name, name, battery_percentage, ...rest}) => {
        // console.log(rest)
        return Widget.Box({
            spacing: 2,
            children: [
                Widget.Icon(icon_name + '-symbolic'),
                Widget.Label(name),
                Widget.Label(battery_percentage),
            ]
        });
    });
}

const ConnectedWithBattery = () => Widget.Box({
    children: _conenctedWithBat(),
    vertical: true,
    setup: self => self.hook(bluetooth, self => {
        self.children = _conenctedWithBat()
        self.visible = bluetooth.connected_devices.length > 0;
    }, 'notify::connected-devices'),
})

export const Indicator = () => Widget.Icon({
    icon: bluetooth.bind('enabled').as(on =>
        `bluetooth-${on ? 'active' : 'disabled'}-symbolic`),
})

export function PanelEntry() {
    return Widget.Box({
        spacing: 5,
        children: [
            Indicator(),
            ConnectedWithBattery(),
        ],
    })
}
