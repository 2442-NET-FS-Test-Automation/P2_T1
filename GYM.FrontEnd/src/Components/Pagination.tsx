interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <nav className="d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">
            Page <span className="text-white fw-bold">{currentPage}</span> of{" "}
            <span className="text-white fw-bold">{totalPages}</span>
        </small>

        <ul className="pagination pagination-sm mb-0">
            {/* Botón Anterior */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
                className="page-item-link btn btn-sm btn-outline-secondary me-1 text-white"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &laquo; Prev
            </button>
            </li>

            {/* Números de página */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page} className="page-item">
                <button
                className={`btn btn-sm me-1 ${
                    currentPage === page
                    ? "btn-gq-aqua text-dark fw-bold"
                    : "btn-outline-secondary text-white"
                }`}
                onClick={() => onPageChange(page)}
                >
                {page}
                </button>
            </li>
            ))}

            {/* Botón Siguiente */}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
                className="page-item-link btn btn-sm btn-outline-secondary text-white"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next &raquo;
            </button>
            </li>
        </ul>
        </nav>
    );
}