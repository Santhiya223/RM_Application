import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import IconifyIcon from '../wrappers/IconifyIcon';

const getVisiblePages = (totalPages, currentPage) => {
  const pages = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, '...', totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
  }
  return pages;
};

const DsPagination = ({
  pageSize,
  rowsPerPageList = [5, 10, 25, 50, 100],
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => {
  const [visiblePages, setVisiblePages] = useState([1]);
  const [pageSizeVal, setPageSize] = useState(pageSize || rowsPerPageList[0]);

  const isDisablePreviousBtn = currentPage === 1 || totalPages === 0;
  const isDisableNextBtn = currentPage === totalPages || totalPages === 0;

  useEffect(() => {
    setVisiblePages(getVisiblePages(totalPages, currentPage));
  }, [currentPage, totalPages]);

  const handlePageClick = (page) => {
    if (page !== '...' && onPageChange) {
      onPageChange(page - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  return (
    <div className="align-items-center justify-content-between row g-0 text-center text-sm-start">
      <div className="col-sm">
        <div className="d-flex align-items-center gap-2">
          <div className="text-muted text-nowrap">
            Showing <span className="fw-semibold">{currentPage}</span> of <span className="fw-semibold">{totalPages}</span> Pages
          </div>
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="page-size-select">Show: </label>
            <select
              name="page-size-select"
              id="page-size-select"
              className="form-select w-auto"
              value={pageSizeVal}
              onChange={handlePageSizeChange}
            >
              {rowsPerPageList.map(pageSizeVal => (
                <option key={pageSizeVal} value={pageSizeVal}>
                  {pageSizeVal}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <Col sm="auto" className="mt-3 mt-sm-0">
        <ul className="pagination pagination-rounded m-0">
          <li className="page-item">
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={isDisablePreviousBtn}
              className={clsx('page-link', { disabled: isDisablePreviousBtn })}
            >
              <IconifyIcon icon="fa-solid:chevron-left" height={8} width={8} />
            </button>
          </li>
          {visiblePages.map((page, idx) => (
            <li
              key={idx}
              className={clsx('page-item', {
                active: page === currentPage,
                disabled: page === '...'
              })}
            >
              {page === '...' ? (
                <span className="page-link">...</span>
              ) : (
                <button onClick={() => handlePageClick(page)} className="page-link">
                  {page}
                </button>
              )}
            </li>
          ))}
          <li className="page-item">
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={isDisableNextBtn}
              className={clsx('page-link', { disabled: isDisableNextBtn })}
            >
              <IconifyIcon icon="fa-solid:chevron-right" height={8} width={8} />
            </button>
          </li>
        </ul>
      </Col>
    </div>
  );
};

export default DsPagination;
