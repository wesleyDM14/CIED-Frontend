import { FaSearch } from "react-icons/fa";
import { SearchContainer, SearchIcon, SearchInput } from "./styles";

interface SearchBarProps {
    search: string;
    setSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    return (
        <SearchContainer>
            <SearchIcon>
                <FaSearch />
            </SearchIcon>
            <SearchInput
                id="search"
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={handleChange}
            />
        </SearchContainer>
    )
};

export default SearchBar;