export function convertDuration(time: any) {
    if (time) {
        const duration: number = +time.slice(0, time.length - 1);
        const mode: string = time.slice(-1);
        // Hours
        if (mode === 'h' || mode === 'H') {
            return duration * 60 * 60;
        }
        // Minutes.
        if (mode === 'm' || mode === 'M') {
            return duration * 60;
        }
        // Seconds.
        if (mode === 's' || mode === 'S') {
            return duration;
        }
    }
    return 1 * 60 * 60; // 1 Hour.
}
