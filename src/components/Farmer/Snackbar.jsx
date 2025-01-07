// Snackbar.js
import React from "react";

const Snackbar = ({ message, active }) => {
  return (
    active && (
      <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-md transition-opacity duration-300 ease-in-out">
        {message}
      </div>
    )
  );
};

export default Snackbar;
