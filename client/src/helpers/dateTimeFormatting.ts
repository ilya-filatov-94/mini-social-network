export const getRelativeTimeString = function (date: Date, lang = navigator.language) {
    const time = date.getTime();
    const deltaSeconds = Math.floor((time - Date.now())/1000);
    const offsetTime = [60, 3600, 86400, 86400*7, 86400*30, 86400*365, Infinity];
    const units: Intl.RelativeTimeFormatUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
    const unitIndex = offsetTime.findIndex(offsetTime => offsetTime >= Math.abs(deltaSeconds));
    if (offsetTime[unitIndex] >= 86400) {
        const dateOptions: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        }
        return new Intl.DateTimeFormat(lang, dateOptions).format(date);
    } else {
        const divisor = unitIndex ? offsetTime[unitIndex-1] : 1;
        const rtf = new Intl.RelativeTimeFormat(lang, {
            numeric: 'always',
            style: 'long',
            localeMatcher: 'best fit'
        });
        return rtf.format(Math.floor(deltaSeconds/divisor), units[unitIndex]);
    }
}
