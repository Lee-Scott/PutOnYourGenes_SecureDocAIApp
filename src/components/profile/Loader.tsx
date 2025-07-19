import React from 'react'

// TODO: dynamically pass in how many columns to show

const Loader = () => {
  return (
    <>
      <h4 className="mb-3">Loading...</h4>
      <hr />
      <p className="card-text placeholder-glow">
        <span className="placeholder col-12"></span>
        <span className="placeholder col-12"></span>
        <span className="placeholder col-12"></span>
        <span className="placeholder col-12"></span>
        <span className="placeholder col-12"></span>
        <span className="placeholder col-12"></span>
        <span className="placeholder col-12"></span>
      </p>
    </>
  )
}

export default Loader;