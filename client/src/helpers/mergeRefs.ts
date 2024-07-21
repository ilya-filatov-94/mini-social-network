import type {MutableRefObject, RefCallback } from 'react';

type MutableRefList<T> = Array<RefCallback<T> | MutableRefObject<T> | undefined | null>;

function setRef<T>(val: T, ...refs: MutableRefList<T>): void {
  refs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(val);
    } else if (ref != null) {
      ref.current = val;
    }
  });
}

export function mergeRefs<T>(...refs: MutableRefList<T>): RefCallback<T> {
    return (val: T) => {
      setRef(val, ...refs);
    };
}