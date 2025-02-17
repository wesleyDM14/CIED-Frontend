import { PaginationButton, PaginationContainer } from "./styles";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    setPage: (value: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, setPage }) => {
    const maxVisivleButtons = 7;
    const pageNumbers = [];

    if (totalPages <= maxVisivleButtons) {
        for (let index = 1; index <= totalPages; index++) {
            pageNumbers.push(index);
        }
    } else {
        pageNumbers.push(1);

        let start = Math.max(2, currentPage - 2);
        let end = Math.min(totalPages - 1, currentPage + 2);

        if (currentPage <= 4) {
            end = 5;
        }

        if (currentPage >= totalPages - 3) {
            start = totalPages - 4;
        }

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        pageNumbers.push(totalPages);
    }

    return (
        <PaginationContainer>
            {
                pageNumbers.map((pageNumber, index) => (
                    <PaginationButton
                        key={index}
                        onClick={() => setPage(pageNumber)}
                        disabled={currentPage === pageNumber}
                    >
                        {pageNumber}
                    </PaginationButton>
                ))
            }
        </PaginationContainer>
    );
}

export default Pagination;