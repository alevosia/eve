export const formatMilliseconds = (ms: number | null): string => {
    if (!ms) return '00:00:00'

    let x = Math.floor(ms / 1000)
    let seconds: number | string = x % 60

    x = Math.floor(x / 60)
    let minutes: number | string = x % 60

    x = Math.floor(x / 60)
    let hours: number | string = x % 24

    let days: number | string = Math.floor(x / 24)

    seconds = `${'0'.repeat(2 - seconds.toString().length)}${seconds}`
    minutes = `${'0'.repeat(2 - minutes.toString().length)}${minutes}`
    hours = `${'0'.repeat(2 - hours.toString().length)}${hours}`
    days = `${'0'.repeat(Math.max(0, 2 - days.toString().length))}${days}`

    return `${days === '00' ? '' : `${days}:`}${hours}:${minutes}:${seconds}`
}
