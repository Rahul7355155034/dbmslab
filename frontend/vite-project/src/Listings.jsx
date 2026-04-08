import { useEffect, useState } from "react";
import "./Listings.css"
export default function Listings() {

  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/listings")
      .then((res) => res.json())
      .then((data) => setListings(data));
  }, []);

  return (
    <div className="row row-cols-lg-3">

      {listings.map((result) => (
        <a
          href={`/listings/${result.id}`}
          className="listing-link"
          key={result.id}
        >
          <div className="card">

            <img
              className="card-img-top"
              src={result.image.url}
              alt="hotel"
            />

            <div className="card-body">

              <h5>{result.title}</h5>

              ₹ {result.price.toLocaleString("en-IN")} /night

              <br />

              {result.location}

              <br />

              {result.country}

            </div>

          </div>
        </a>
      ))}

    </div>
  );
}