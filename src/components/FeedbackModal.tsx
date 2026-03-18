// No imports needed for this component's current structure

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCorrect: boolean;
  explanation: string;
}

export function FeedbackModal({ isOpen, onClose, isCorrect, explanation }: FeedbackModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6 z-50 backdrop-blur-sm">
      <div className={`max-w-sm w-full border-2 p-6 sm:p-8 space-y-6 shadow-2xl ${
        isCorrect ? 'border-green-500/50 bg-green-950/90' : 'border-red-500/50 bg-red-950/90'
      }`}>
        <div className="space-y-2 text-center">
          <h2 className={`text-2xl font-black font-mono tracking-tighter uppercase ${
            isCorrect ? 'text-green-400 shadow-green-500/20' : 'text-red-500 shadow-red-500/20'
          }`}>
            {isCorrect === true ? 'SURVIVED' : 'TERMINATED'}
          </h2>
          <div className={`h-1 w-full ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`} />
        </div>
        
        <p className="text-xs sm:text-sm font-mono text-green-300/90 leading-relaxed text-center italic">
          "{explanation}"
        </p>
        
        <button
          onClick={onClose}
          className={`w-full py-4 font-mono font-bold border transition-all uppercase tracking-[0.2em] text-sm ${
            isCorrect 
              ? 'bg-green-600 hover:bg-green-500 text-black border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
              : 'bg-red-600 hover:bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
          }`}
        >
          [CONTINUE]
        </button>
      </div>
    </div>
  );
}
