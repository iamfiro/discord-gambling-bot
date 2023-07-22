export function numberWithCommas(x: number | bigint) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}