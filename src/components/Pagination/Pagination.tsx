import React from 'react';
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, currentPage, onPageChange }) => (
  <ReactPaginate
    pageCount={pageCount}
    forcePage={currentPage - 1}
    onPageChange={item => onPageChange(item.selected + 1)}
    containerClassName={css.pagination}
    activeClassName={css.active}
  />
);

export default Pagination;
