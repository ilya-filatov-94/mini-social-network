module.exports = function formatRelativeDate(inputDate) {
    let diff = new Date() - inputDate;
  
    if (diff < 1000) {
      return "прямо сейчас";
    }
  
    let sec = Math.floor(diff / 1000);
    if (sec < 60) {
      return sec + " сек. назад";
    }
  
    let min = Math.floor(diff / 60000);
    if (min < 60) {
      return min + " мин. назад";
    }
  
    let hours = Math.floor(diff / (3600*1000));
    if (hours < 24) {
      if (hours === 1) return hours + " час назад";
      if (hours <= 4 && hours >= 2) return hours + " часа назад";
      if (hours > 5) return hours + " часов назад";
    }
  
    let localDate = inputDate.toLocaleString('ru-Ru', {timeZone: 'Europe/Moscow'});
    let position1 =  localDate.indexOf(', ');
    let position2 =  localDate.indexOf(':');
    let currentHours = localDate.slice(position1+1, position2);
    const dateArr = [
      '0' + currentHours,
      '0' + inputDate.getMinutes(),
      '0' + inputDate.getDate(),
      '0' + (inputDate.getMonth() + 1),
      '' + inputDate.getFullYear(),
    ].map(component => component.slice(-2));
    return dateArr.slice(0, 2).join(':') + ' ' + dateArr.slice(2).join('.');
}
