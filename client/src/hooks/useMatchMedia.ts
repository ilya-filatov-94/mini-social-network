import {useState, useLayoutEffect} from 'react';

const queries = [
    '(max-width: 480px)',
    '(min-width: 481px) and (max-width: 960px)',
    '(min-width: 961px)',
];


type IReturnMatchMedia = () => Record<string, boolean>;

export const useMatchMedia: IReturnMatchMedia  = () => {
    const mediaQueryLists = queries.map(query => matchMedia(query));

    const getValues = () => mediaQueryLists.map(mql => mql.matches);

    const [values, setValues] = useState(getValues);

    useLayoutEffect(() => {
        const handler = () => setValues(getValues);

        mediaQueryLists.forEach(mql => mql.addEventListener('change', handler));

        return () => mediaQueryLists.forEach(mql => mql.removeEventListener('change', handler));
    // eslint-disable-next-line
    }, [getValues]);

    return ['isMobile', 'isTablet', 'isDesktop'].reduce((acc, screen, index) => ({
        ...acc,
        [screen]: values[index],
    }), {});
}
