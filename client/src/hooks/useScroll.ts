import {
    useRef, 
    MutableRefObject,
    useCallback
} from 'react';

type refElem = HTMLHeadingElement | HTMLDivElement | HTMLParagraphElement;
type TypeHookScroll = (position: ScrollLogicalPosition | undefined) => [() => void, MutableRefObject<null | refElem>];

export const useScroll: TypeHookScroll = (position) => {
    const elRef = useRef<refElem>(null);
    const executeScroll = useCallback(() => elRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: position 
    }), [position]);
    return [executeScroll, elRef];
};

