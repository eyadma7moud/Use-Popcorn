import { useState } from "react";
import { Search } from "./Search";

export function NavBar({ movies }) {
  const [query, setQuery] = useState("");

  return (
    <nav className="nav-bar">
      <Logo />
      <Search query={query} setQuery={setQuery} />
      <NumResults moviesNum={movies.length} />
    </nav>
  );
}
export function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

export function NumResults({ moviesNum }) {
  return (
    <p className="num-results">
      Found <strong>{moviesNum}</strong> results
    </p>
  );
}
