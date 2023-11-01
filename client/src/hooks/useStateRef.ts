import { useRef, useState, RefObject } from 'react';

// to get the value of a ref from `useRef`
export function getRefValue<T>(ref: RefObject<T>) {
  return ref.current as T;
}

// extension of `useState` to be able to access the state as a ref
export function useStateRef<T>(
  defaultValue: T
): [T, (value: T) => void, RefObject<T>] {
  const ref = useRef<T>(defaultValue);
  const [state, _setState] = useState<T>(defaultValue);
  const setState = (value: T) => {
    _setState(value);
    ref.current = value;
  };

  return [state, setState, ref];
}