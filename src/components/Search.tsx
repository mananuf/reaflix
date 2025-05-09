import type React from "react";
import type { Dispatch, JSX, SetStateAction } from "react";

type SearchProps = {
    searchTerm: string,
    setSearchTerm: Dispatch<SetStateAction<string>>,
}
const Search = ({searchTerm, setSearchTerm}: SearchProps): JSX.Element => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    };
    console.log("search:", searchTerm)
    return(
        <div className="search relative">
            <img src="/search.svg" alt="search" className="absolute top-1/3 left-7"/>
            <input 
                type="text" 
                className="border-white border-2 rounded-full" 
                value={searchTerm} 
                onChange={e => handleSearch(e)}
                placeholder="Search movies" 
            />
        </div>
    )
}

export default Search;