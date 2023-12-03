
export function debounce<Fn extends (...args: any[]) => any>(callback: Fn, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function(...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback.apply(null, args);
      }, delay);
    }
}
