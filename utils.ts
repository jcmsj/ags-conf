export function makeWinName(prefix:string) {
    return (monitor:{id:number}) => `${prefix}-${monitor.id}`
}
