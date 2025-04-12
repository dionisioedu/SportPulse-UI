import React, { useState } from 'react';
import './Search.css'

const Search = ({ apiUrl, onSearchChange }) => {
    const [value, setValue] = useState([]);

    const onTextChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);
        onSearchChange(event.target.value);
    };

    return (
        <div className="search">
            <input
                type="search"
                value={value}
                onChange={onTextChange}
                placeholder="Search..."
                className="search-input"
            />
        </div>
    );
};

export default Search;