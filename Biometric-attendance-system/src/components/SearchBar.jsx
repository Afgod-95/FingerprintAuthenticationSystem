import React from 'react';
import { CiSearch } from "react-icons/ci";
import './Searchbar.css';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

const SearchBar = ({ setSearch, search, placeholder }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
 
  return (
    <motion.div className="search-bar" 
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 5, stiffness: 100, delay: 0.5 }}
    >
      <CiSearch className='search-icon' 
        style={{
          left: isMobile && '10px'
        }}
      />
      <input 
        type="text" 
        placeholder= { placeholder }
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        style={{
          paddingLeft: isMobile && '45px'
        }}
      />
    </motion.div>
  );
};

export default SearchBar;
