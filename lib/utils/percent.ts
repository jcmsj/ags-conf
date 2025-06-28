export function percent(value:number, fractionDigits:number=0): string {
    return `${(value * 100).toFixed(fractionDigits)}%`;
}
