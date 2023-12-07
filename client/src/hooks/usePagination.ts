import {useMemo} from 'react';

interface IPagination {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}

type TypeHookPagination = (params: IPagination) => (number | string )[] | undefined;

/*
totalCount : представляет общее количество данных, доступных из источника.
currentPage : представляет текущую активную страницу. Для нашего значения мы будем использовать индекс, отсчитываемый от 1, вместо традиционного индекса, отсчитываемого от 0 currentPage.
pageSize : представляет максимальный объем данных, видимых на одной странице.
onPageChange : коллбэк, вызываемый с обновленным значением страницы при изменении страницы.
siblingCount (необязательно): представляет минимальное количество кнопок страницы, отображаемых с каждой стороны кнопки текущей страницы. По умолчанию 1.
*/

export const DOTS = `&#8230;`;

export const usePagination: TypeHookPagination = ({
    totalCount,
    pageSize,
    siblingCount = 1,
    currentPage
  }) => {
    const paginationRange = useMemo(() => {

        const range = (start: number, end: number) => {
            let length = end - start + 1;
            return Array.from({length}, (_, index) => index + start);
        };
        const totalPageCount = Math.ceil(totalCount / pageSize);
        const totalPageNumbers = siblingCount + 5;
    
        if (totalPageNumbers >= totalPageCount) {
          return range(1, totalPageCount);
        }
        
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
          currentPage + siblingCount,
          totalPageCount
        );

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;
    
        if (!shouldShowLeftDots && shouldShowRightDots) {
          let leftItemCount = 3 + 2 * siblingCount;
          let leftRange = range(1, leftItemCount);
          return [...leftRange, DOTS, totalPageCount];
        }
    
        if (shouldShowLeftDots && !shouldShowRightDots) {
          let rightItemCount = 3 + 2 * siblingCount;
          let rightRange = range(
            totalPageCount - rightItemCount + 1,
            totalPageCount
          );
          return [firstPageIndex, DOTS, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
          let middleRange = range(leftSiblingIndex, rightSiblingIndex);
          return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
      }, [totalCount, pageSize, siblingCount, currentPage]);
    
    return paginationRange;
};



