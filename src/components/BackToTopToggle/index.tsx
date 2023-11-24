'use client';

import React, { useEffect, useState } from 'react';
import { Fab, Zoom } from '@mui/material';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

export default function BackToTopToggle() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setShowButton(isScrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={showButton} timeout={200}>
      <Fab
        size="small"
        variant="circular"
        onClick={handleScrollToTop}
        style={{
          position: 'fixed',
          display: 'flex',
          justifyContent: 'center',
          bottom: '1em',
          opacity: '0.7',
        }}
      >
        <KeyboardDoubleArrowUpIcon />
      </Fab>
    </Zoom>
  );
}
