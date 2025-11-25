import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  current: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  current,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePageClick = (data: { selected: number }) => {
    onPageChange(data.selected + 1);
  };

  return (
    <nav className={css.paginationWrapper}>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={totalPages}
        forcePage={current - 1}
        previousLabel="<"
        renderOnZeroPageCount={null}
        containerClassName={css.pagination}
        pageLinkClassName={css.pageLink}
        activeLinkClassName={css.activeLink}
        previousLinkClassName={css.prevNextLink}
        nextLinkClassName={css.prevNextLink}
        breakLinkClassName={css.breakLink}
        disabledClassName={css.disabled}
      />
    </nav>
  );
}
