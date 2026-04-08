import "./App.css";

import React from "react";

export default function App({ number }) {
  return <p>Your ticket number: 
    {number.map((n,i) => <span key={i}>{n} </span>)}</p>;
}
