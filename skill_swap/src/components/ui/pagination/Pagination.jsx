import Button from '../../ui/button/Button.jsx'; // Assuming you have a Button component in your UI



const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="flex justify-center items-center space-x-2 my-8" aria-label="Pagination">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="secondary"
        className="px-3 py-1 text-sm md:px-4 md:py-2"
      >
        Previous
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={currentPage === page ? 'primary' : 'secondary'}
          className="px-3 py-1 text-sm md:px-4 md:py-2"
        >
          {page}
        </Button>
      ))}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="secondary"
        className="px-3 py-1 text-sm md:px-4 md:py-2"
      >
        Next
      </Button>
    </nav>
  );
};

export default Pagination;