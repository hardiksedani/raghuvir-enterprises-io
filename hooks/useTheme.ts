'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
  const [mode, setMode] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return stored || (prefersDark ? 'dark' : 'light');
  });
  const [mounted] = useState(() => typeof window !== 'undefined');

  useEffect(() => {
    document.documentElement.classList.toggle('light', mode === 'light');
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', mode);
    }
  }, [mode]);

  const toggle = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    document.documentElement.classList.toggle('light', next === 'light');
    localStorage.setItem('theme', next);
  };

  return { mode, toggle, mounted };
}
