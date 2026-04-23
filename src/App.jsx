import { ColorRing } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { NavBar, NumResults } from "./NavBar";
import { Main } from "./Main";
import { Search } from "./Search";
import Box from "./Box";
import MoviesList from "./MoviesList";
import { WatchedMovieList } from "./WatchedMovies";
import { WatchedSummary } from "./WatchedMovies";
import { StarRating } from "./StarRating";
import { useMovie } from "./useMovie";

const KEY = "5e575cbf";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");

  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return storedValue ? JSON.parse(storedValue) : [];
  });
  
  const [movies, isLoading, error] = useMovie(query);

  function handleSelectMovie(id) {
    setSelectedId(id === selectedId ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      if (selectedId !== null) {
        document.addEventListener("keydown", function (e) {
          if (e.code === "Escape") {
            handleCloseMovie();
            console.log("Closing");
          }
        });
      }
    },
    [selectedId],
  );

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched],
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults moviesNum={movies.length} />
      </NavBar>

      <Main>
        <Box
          element={
            error ? (
              <ErrorMessage message={error} />
            ) : isLoading ? (
              <div className="loader-container">
                <ColorRing
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{}}
                  wrapperClass="color-ring-wrapper"
                  colors={[
                    "#6741d9",
                    "#7950f2",
                    "#343a40",
                    "#adb5bd",
                    "#dee2e6",
                  ]}
                />
              </div>
            ) : (
              <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
            )
          }
        />

        <Box
          element={
            selectedId ? (
              <MovieDetails
                id={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedMovieList
                  watched={watched}
                  onDeleteMovie={handleDeleteMovie}
                />
              </>
            )
          }
        />
      </Main>
    </>
  );
}

function MovieDetails({ id, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rate, setRate] = useState(null);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: id,
      title,
      year,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      userRating: rate,
    };

    if (isWatched) return;
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  const isWatched = watched.some((movie) => movie.imdbID === id);

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${id}`,
        );
        const data = await res.json();

        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [id],
  );

  useEffect(
    function () {
      document.title = title ? `Movie | ${title}` : "Use Popcorn";
      return function () {
        document.title = "Use Popcorn";
      };
    },
    [title],
  );

  return (
    <div className="details">
      {isLoading ? (
        <div className="loader-container">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#6741d9", "#7950f2", "#343a40", "#adb5bd", "#dee2e6"]}
          />
        </div>
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>

              <p>{genre}</p>
              <p>⭐ {imdbRating} IMDb rating</p>
            </div>
          </header>

          <section>
            {!isWatched ? (
              <div className="rating">
                <StarRating
                  maxRating={10}
                  size={26}
                  messages="Rate the movie"
                  onSetRating={setRate}
                />
                {rate > 0 && (
                  <button className="btn-add" onClick={handleAdd}>
                    + Add to Watched List
                  </button>
                )}
              </div>
            ) : (
              <div className="rating">
                <p>This Movie was added to your watched list before</p>
                your rating:{" "}
                {watched.find((movie) => movie.imdbID === id).userRating}⭐
              </div>
            )}

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function ErrorMessage({ message }) {
  return <p className="error">⛔{message}</p>;
}
