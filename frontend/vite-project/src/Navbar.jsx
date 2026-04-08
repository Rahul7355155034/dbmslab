export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-md bg-body-tertiary">
      <div className="container-fluid">

        <a className="navbar-brand" href="/listings">
          <i className="fa-solid fa-compass"></i>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">

          <div className="navbar-nav">
            <a className="nav-link" href="/listings">Explore</a>
          </div>

          <form action="/filter" method="get" className="d-flex ms-3">

            <label htmlFor="filter" className="me-2">
              Find
            </label>

            <input
              name="filter"
              type="text"
              className="form-control me-2"
            />

            <button className="btn btn-outline-success">
              Search
            </button>

          </form>

          <div className="navbar-nav ms-auto">
            <a className="nav-link" href="/listings/new">Add new</a>
          </div>

          <div className="navbar-nav">
            <a className="nav-link" href="/my-bookings">Show mybooking</a>
          </div>

          <div className="navbar-nav">
            <a className="nav-link" href="/listings/register">Register</a>
          </div>

          <div className="navbar-nav">
            <a className="nav-link" href="/listings/login">Login</a>
          </div>

        </div>
      </div>
    </nav>
  );
}