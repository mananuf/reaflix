import { useEffect, useState, type JSX } from "react";
import Search from "./components/Search";
import Loader from "./components/Loader";
import MovieCard, {type MovieCardProps} from "./components/cards/MovieCard.tsx";
import {useDebounce} from "react-use";

const API_BASE_URL:string = "https://api.themoviedb.org/3/";
const API_TOKEN:string = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`
  }
};

const App = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [movies, setMovies] = useState<MovieCardProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState<string>('');

  // Debounce search term to prevent unnecessary API calls
  // Debounces key strokes to 500ms
  useDebounce(() => setDebounceSearchTerm(searchTerm), 600, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true)
    try {
      const response = await fetch(query !== '' ? `${API_BASE_URL}search/movie?query=${encodeURIComponent(query)}`:`${API_BASE_URL}discover/movie?language=en-US&sort_by=popularity.desc`, options);
      if(!response.ok) {
        throw new Error('Failed To fetch movies');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.error || 'Failed To fetch movies');
        setMovies([]);

        return;
      }

      console.log(data.results);
      setMovies(data.results);

    } catch (error) {
      console.log("Error fetching movies:", error);
      setErrorMessage("Error Fetching Movies, try again!");
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchMovies(debounceSearchTerm)
  }, [debounceSearchTerm])
  return(
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="hero" />
          <h1 className="font-semibold">Find <span className="text-gradient capitalize">Movies</span> you'll Love </h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading 
            ? (
              <div className="flex justify-center">
                <Loader/>
              </div>
            )
            : errorMessage ? 
              ( <div id="alert-additional-content-2" className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
              <div className="flex items-center">
                <svg className="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <span className="sr-only">Info</span>
                <h3 className="text-lg font-medium">Error!</h3>
              </div>
              <div className="mt-2 mb-4 text-sm">
                {errorMessage}
              </div>
              <div className="flex">
                <button type="button" className="text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-red-600 dark:border-red-600 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800" data-dismiss-target="#alert-additional-content-2" aria-label="Close">
                  Dismiss
                </button>
              </div>
            </div>)
            : (<ul>
                {movies.map((movie, id) => (
                  <MovieCard key={id} title={movie.title} vote_average={movie.vote_average} poster_path={movie.poster_path} release_date={movie.release_date} original_language={movie.original_language} />
                )
              )}
            </ul>
            )}
        </section>     
      </div>
    </main>
  )
}

export default App;