import React, { useState } from 'react';
import {pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`;

const PDFViewerPopup = ({ pdfUrl, isModalOpen, closeModal }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Callback to set the number of pages when PDF is loaded
  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Close the modal when clicking outside the modal content
  const handleClose = () => {
    closeModal();
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-3/4 max-w-2xl relative">
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
              >
                Close
              </button>
            </div>

            <div className="pdf-container mt-6">
              <Document
                file={pdfUrl}
                onLoadSuccess={onLoadSuccess}
                className="w-full h-full"
              >
                <Page pageNumber={pageNumber} />
              </Document>
            </div>

            {/* Pagination controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPageNumber(pageNumber - 1)}
                disabled={pageNumber <= 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
              >
                Previous
              </button>
              <span>
                Page {pageNumber} of {numPages}
              </span>
              <button
                onClick={() => setPageNumber(pageNumber + 1)}
                disabled={pageNumber >= numPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFViewerPopup;
