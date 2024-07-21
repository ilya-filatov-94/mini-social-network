export const getRelativeTimeString = function (timeStamp: number, lang = navigator.language) {
    const deltaSeconds = Math.floor((timeStamp - Date.now())/1000);
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
        return new Intl.DateTimeFormat(lang, dateOptions).format(new Date(timeStamp));
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

export const getCurrentDateTimeString = function (): string {
  const currentTime = new Date();
  const currentDateString = `${
  currentTime.getFullYear()
    }-${
      currentTime.getMonth() < 10 ? '0'+(+currentTime.getMonth()+1) : (+currentTime.getMonth()+1)
    }-${
      currentTime.getDate() < 10 ? '0'+currentTime.getDate() : currentTime.getDate()
    }T${
      currentTime.getUTCHours() < 10 ? '0'+currentTime.getUTCHours() : currentTime.getUTCHours()
    }:${
      currentTime.getMinutes() < 10 ? '0'+currentTime.getMinutes() : currentTime.getMinutes()
    }:${
      currentTime.getSeconds() < 10 ? '0'+currentTime.getSeconds() : currentTime.getSeconds()
    }.${
      currentTime.getMilliseconds()
    }Z`;
  return currentDateString;
}