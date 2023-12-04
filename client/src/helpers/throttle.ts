export function throttle<Fn extends (...args: any[]) => any>(callback: Fn, delay: number) {
    let isThrottled = false;
    function wrapper(...args: any[]) {
        if (isThrottled) {
            return;
        }
        callback.apply(null, args);
        isThrottled = true;
        setTimeout(() => {
            isThrottled = false;
        }, delay);
    }

    return wrapper;
}