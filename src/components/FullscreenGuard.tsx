import { useState, useEffect } from 'react';
import { Maximize2 } from 'lucide-react';

export function FullscreenGuard() {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFSChange);
    document.addEventListener('webkitfullscreenchange', handleFSChange);
    document.addEventListener('mozfullscreenchange', handleFSChange);
    document.addEventListener('msfullscreenchange', handleFSChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFSChange);
      document.removeEventListener('webkitfullscreenchange', handleFSChange);
      document.removeEventListener('mozfullscreenchange', handleFSChange);
      document.removeEventListener('msfullscreenchange', handleFSChange);
    };
  }, []);

  const requestFS = () => {
    const doc = document.documentElement as any;
    const req = doc.requestFullscreen || doc.webkitRequestFullscreen || doc.mozRequestFullScreen || doc.msRequestFullscreen;
    if (req) {
      req.call(doc).catch((e: any) => console.warn("FS Guard request failed", e));
    }
  };

  if (isFullscreen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
      onClick={requestFS}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900 via-transparent to-transparent opacity-50 animate-pulse" />
      </div>
      
      <div className="relative space-y-6 max-w-sm animate-in fade-in zoom-in duration-300">
        <div className="relative">
          <Maximize2 className="w-16 h-16 text-green-500 mx-auto group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 blur-xl bg-green-500/20 animate-pulse rounded-full" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black font-mono text-green-400 tracking-tighter uppercase">
            INTEGRITY_COMPROMISED
          </h2>
          <p className="text-xs font-mono text-red-500 uppercase tracking-widest animate-pulse">
            [WINDOWED_MODE_DETECTED]
          </p>
        </div>

        <div className="bg-green-950/20 border border-green-800 p-4 font-mono text-[10px] text-green-500/70 uppercase leading-relaxed">
          The Glitch Protocol requires deep immersion for neural synchronization. 
          Tap anywhere to restore full-screen semantic integrity.
        </div>

        <div className="text-[8px] font-mono text-green-900 group-hover:text-green-500 transition-colors uppercase tracking-[0.5em]">
          {'>'} RESTORE_FULLSCREEN_LINK_ACTIVE
        </div>
      </div>
    </div>
  );
}
