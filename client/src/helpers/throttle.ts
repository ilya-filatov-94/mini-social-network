export function throttle<Fn extends (...args: any[]) => any>(callback: Fn, delay: number) {
    let isThrottled = false;
    let savedArgs: any;
    function wrapper(...args: any[]) {
        if (isThrottled) {
            savedArgs = args.slice();
            return;
        }
        callback.apply(null, args);
        isThrottled = true;
        setTimeout(() => {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(null, savedArgs);
                savedArgs = null;
            }
        }, delay);
    }

    return wrapper;
}