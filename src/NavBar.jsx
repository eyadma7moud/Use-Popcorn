import { Search } from "./Search";

export function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
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
