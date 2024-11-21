import React from 'react';

const ConfirmDelete = ({ onConfirm, onCancel }) => (
  <div>
    <p>Are you sure you want to delete this contact?</p>
    <div className="flex justify-between mt-2">
      <button
        onClick={onConfirm}
        className="bg-red-500 text-white px-3 py-1 rounded mr-2"
      >
        Yes
      </button>
      <button
        onClick={onCancel}
        className="bg-gray-300 text-black px-3 py-1 rounded"
      >
        No
      </button>
    </div>
  </div>
);

export default ConfirmDelete;
