import { useState } from 'react';

export const useRouter = () => {
  const [currentPage, setCurrentPage] = useState('home');
  
  const navigate = (page) => {
    setCurrentPage(page);
  };
  
  return { 
    currentPage, 
    navigate 
  };
};