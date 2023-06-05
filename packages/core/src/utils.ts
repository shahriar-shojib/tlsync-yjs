import { useEffect } from 'react';

export const getRandomHexColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 3; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const useCleanup = (cleanup: () => void) => {
  useEffect(() => {
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('close', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
      window.removeEventListener('close', cleanup);
      cleanup();
    };
  }, [cleanup]);
};
