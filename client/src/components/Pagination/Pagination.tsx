import {FC} from 'react';
import styles from './Pagination.module.scss';
import { usePagination, DOTS } from '../../hooks/usePagination';
import {useAppSelector} from '../../hooks/useTypedRedux';

interface IPaginationProps {
  onPageChange: (page: number) => void;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  className?: string;
  siblingCount?: number;
}

const Pagination: FC<IPaginationProps> = ({
  onPageChange,
  totalCount,
  currentPage,
  pageSize,
  className,
  siblingCount = 1,
}) => {

  const currentTheme = useAppSelector(state => state.reducerTheme.themeMode);
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (paginationRange) {
  //Если в диапазоне нумерации страниц меньше 2 элементов, то компонент не отображается
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }
  
  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className={`${styles.paginationContainer}
      ${currentTheme ==='darkMode' ? styles['theme-dark'] : styles['theme-light']}`}>
       {/* Левая стрелка навигации */}
      <li
        className={`${styles.paginationItem} 
        ${currentPage === 1 ? styles.disabled : ''}
        ${className ? className : ''}`}
        onClick={onPrevious}
      >
        <div className={`${styles.arrow} ${styles.left}`} />
      </li>
      {paginationRange.map((pageNumber, index) => {
        // Если paginationItem - DOT, то отрендерить unicode символ DOT (троеточие)
        if (pageNumber === DOTS) {
          return (
          <li
            key={pageNumber + '' + index}
            className={`${styles.paginationItem} ${styles.dots}`}>
              {DOTS}
          </li>
          );
        }
        // Рендер остальных элементов пагинации
        return (
          <li
            key={pageNumber + '' + index}
            className={`${styles.paginationItem} ${pageNumber === currentPage ? styles.selected : ''}`}
            onClick={() => onPageChange(Number(pageNumber))}
          >
            <span>{pageNumber}</span>
          </li>
        );
      })}
      {/*  Правая стрелка навигации */}
      <li
        className={`${styles.paginationItem} ${currentPage === lastPage ? styles.disabled : ''}`}
        onClick={onNext}
      >
        <div className={`${styles.arrow} ${styles.right}`} />
      </li>
    </ul>
  );
  } else {
    return null;
  }
};

export default Pagination;
