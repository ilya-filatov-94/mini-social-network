import {
    useRef, 
    MutableRefObject,
} from 'react';

type refElem = HTMLHeadingElement | HTMLDivElement;

type TypeHookScroll = () => [() => void, MutableRefObject<null | refElem>];

export const useScroll: TypeHookScroll = () => {
    const elRef = useRef<refElem>(null);
    const executeScroll = () => elRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return [executeScroll, elRef];
};

