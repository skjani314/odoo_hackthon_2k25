import React, { useState } from 'react';
import Button from '../../ui/button/Button'; // Assuming you have a Button component in your UI library


const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  const [query, setQuery] = useState('');
  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };
  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl mx-auto mb-8">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-grow shadow appearance-none border rounded-l-lg py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label={placeholder}
      />
      <Button type="submit" className="rounded-l-none">Search</Button>
    </form>
  );
};

export default SearchBar;