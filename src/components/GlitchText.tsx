import { useEffect, useState } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [glitched, setGlitched] = useState(text);

  useEffect(() => {
    const chars = '!<>-_\\/[]{}—=+*^?#_@$%&';
    let frame = 0;

    const interval = setInterval(() => {
      if (frame % 10 === 0) {
        const newText = text.split('').map((char, i) => {
          if (Math.random() < 0.1) {
            return chars[Math.floor(Math.random() * chars.length)];
          }
          return char;
        }).join('');
        setGlitched(newText);

        setTimeout(() => setGlitched(text), 50);
      }
      frame++;
    }, 100);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={`font-mono ${className}`}>
      {glitched}
    </span>
  );
}
