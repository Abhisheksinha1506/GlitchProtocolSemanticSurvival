import { useCallback, useEffect, useState } from 'react';
import { Heart, Zap, Target } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { updateGameSession, endGameSession, generateScenario } from '../utils/api';
import { GlitchText } from './GlitchText';
import { FeedbackModal } from './FeedbackModal';
import { playSuccess, playError, playTimerTick, playGlitch } from '../utils/audio';
import { GameScenario } from '../types/game';

export function SurvivalPhase() {
  const {
    currentSector,
    setCurrentSector,
    score,
    setScore,
    corruptedDefinitions,
    sessionId,
    playerName,
    setPhase,
    lives,
    setLives,
  } = useGame();

  const [scenario, setScenario] = useState<GameScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadScenario = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    setSelectedOption(null);
    setTimeLeft(20);

    try {
      const data = await generateScenario(currentSector, corruptedDefinitions);
      setScenario(data);
    } catch (error) {
      console.error('Error loading scenario:', error);
      setScenario({
        scenario: 'System error. Unable to generate scenario.',
        option1: 'Retry',
        option2: 'Continue',
        correctOption: 1,
        explanation: 'System failure',
      });
    } finally {
      setLoading(false);
      playGlitch();
    }
  }, [currentSector, corruptedDefinitions]);

  const handleChoice = useCallback(async (choice: number) => {
    if (feedback || !scenario) return;

    // Special handling for System Error fallback
    if (scenario.scenario === 'System error. Unable to generate scenario.') {
      if (choice === 1) { // Retry
        loadScenario();
        return;
      } else { // Continue (lose life)
        playError();
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
           if (sessionId) await endGameSession(sessionId, score, currentSector, playerName);
           setPhase('gameover');
        } else {
           loadScenario();
        }
        return;
      }
    }

    setSelectedOption(choice);
    const isCorrect = choice === scenario.correctOption;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setShowModal(true);

    if (isCorrect) {
      playSuccess();
      const points = 100 + (timeLeft * 5);
      const newScore = score + points;
      setScore(newScore);

      if (sessionId) {
        await updateGameSession(sessionId, { score: newScore });
      }
    } else {
      playError();
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        if (sessionId) {
          await endGameSession(sessionId, score, currentSector, playerName);
        }
      }
    }
  }, [feedback, scenario, loadScenario, lives, setLives, sessionId, score, currentSector, playerName, setPhase, timeLeft, setScore]);

  useEffect(() => {
    loadScenario();
  }, [loadScenario]);

  useEffect(() => {
    if (timeLeft > 0 && !feedback && !loading) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        playTimerTick();
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !feedback && !loading) {
      handleChoice(0);
    }
  }, [timeLeft, feedback, loading, handleChoice]);

  const handleModalClose = () => {
    setShowModal(false);
    
    if (feedback === 'correct') {
      setCurrentSector(currentSector + 1);
      setPhase('corruption');
    } else {
      if (lives <= 0) {
        setPhase('gameover');
      } else {
        setFeedback(null);
        setSelectedOption(null);
        setTimeLeft(20);
        loadScenario();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="text-2xl font-mono animate-pulse">
          [GENERATING SCENARIO...]
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-4 sm:p-6 flex flex-col overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto flex flex-col flex-1 gap-4">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-2 font-mono text-[10px] sm:text-xs">
          <div className="bg-green-950/10 border border-green-900/50 p-2 flex items-center gap-2">
            <Target className="w-3 h-3 text-yellow-500" />
            <span>SEC: {currentSector}</span>
          </div>
          <div className="bg-green-950/10 border border-green-900/50 p-2 flex items-center gap-2">
            <Zap className="w-3 h-3 text-green-500" />
            <span>SCR: {score}</span>
          </div>
          <div className="bg-green-950/10 border border-green-900/50 p-2 flex items-center gap-2">
            <Heart className={`w-3 h-3 ${lives === 0 ? 'text-red-500 animate-pulse' : 'text-red-400'}`} />
            <span>LVS: {lives}</span>
          </div>
          <div className={`bg-green-950/10 border border-green-900/50 p-2 flex items-center justify-center font-bold text-sm sm:text-base ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
            {timeLeft}s
          </div>
        </div>

        {/* Active Corruptions - Compact for mobile */}
        <div className="bg-green-950/5 border border-green-900/30 p-2">
          <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto custom-scrollbar">
            {corruptedDefinitions.map((def, i) => (
              <span key={i} className="text-[8px] sm:text-[10px] font-mono whitespace-nowrap bg-black/50 px-1 border border-green-900/50">
                {def.original}→{def.corrupted}
              </span>
            ))}
          </div>
        </div>

        {/* Main Scenario Container */}
        <div className={`flex flex-col flex-1 border p-4 sm:p-6 gap-6 sm:gap-8 min-h-0 ${
          feedback === 'correct' ? 'border-green-500/50 bg-green-950/20' :
          feedback === 'wrong' ? 'border-red-500/50 bg-red-950/20' :
          'border-green-800/50 bg-black/40 shadow-inner'
        }`}>
          <div className="flex flex-col items-center text-center space-y-4 overflow-y-auto custom-scrollbar pr-1">
            <div className="bg-yellow-500/10 px-3 py-1 border border-yellow-500/30">
               <GlitchText text="SITUATION_CRITICAL" className="text-[10px] sm:text-xs text-yellow-500 font-mono tracking-widest uppercase" />
            </div>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-green-300 font-mono">
              {scenario?.scenario}
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 mt-auto">
            {[1, 2].map((optionNum) => {
              const isSelected = selectedOption === optionNum;
              const isCorrect = optionNum === scenario?.correctOption;

              let buttonClass = 'w-full p-4 text-xs sm:text-sm md:text-base font-mono border transition-all duration-300 text-left relative overflow-hidden ';

              if (feedback) {
                if (isSelected && isCorrect) {
                  buttonClass += 'bg-green-600 border-green-400 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'bg-red-600 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]';
                } else if (isCorrect) {
                  buttonClass += 'bg-green-900/50 border-green-500/50 text-green-400';
                } else {
                  buttonClass += 'bg-gray-900/30 border-gray-800 text-gray-700';
                }
              } else {
                buttonClass += 'bg-black/80 border-green-900 hover:border-green-500 hover:bg-green-950/50 group';
              }

              return (
                <button
                  key={optionNum}
                  onClick={() => handleChoice(optionNum)}
                  disabled={!!feedback}
                  className={buttonClass}
                >
                  <span className="opacity-30 mr-2">[{optionNum}]</span>
                  {scenario ? (scenario as any)[`option${optionNum}`] : ''}
                  {!feedback && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-green-500 transform translate-x-full group-hover:translate-x-0 transition-transform" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Terminal Log Output */}
        <div className="bg-black/80 border border-green-900/30 p-2 font-mono text-[8px] sm:text-[10px] h-12 flex flex-col justify-end opacity-40">
           <p className="truncate text-green-900 animate-pulse">{'>'} NEURAL_STATIC: {timeLeft}s remaining...</p>
           <p className="truncate text-red-900">{'>'} [LOG] SECTOR_{currentSector}_BUFFER_OVERFLOW</p>
        </div>
      </div>

      <FeedbackModal
        isOpen={showModal}
        onClose={handleModalClose}
        isCorrect={feedback === 'correct'}
        explanation={scenario?.explanation || ''}
      />
    </div>
  );
}
