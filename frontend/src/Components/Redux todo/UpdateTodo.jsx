import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeTodo, updateTodo } from '../../Features/todo/todoSlice';

const UpdateTodo = ({ todo }) => {
  const [newText, setNewText] = useState(todo.text);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateTodo({ id: todo.id, newText }));
  };

  return (
    <div className="flex justify-center items-center ">
      <form onSubmit={handleSubmit} className="space-x-3">
        <input
          type="text"
          className="bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          placeholder="Update Todo..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button
          type="submit"
          className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
        >
          Update Todo
        </button>
      </form>
    </div>
  );
};

export default UpdateTodo;
