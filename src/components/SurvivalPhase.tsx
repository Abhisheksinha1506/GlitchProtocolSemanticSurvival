import { useEffect, useState } from 'react';
import { Heart, Zap, Target } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { updateGameSession, endGameSession, generateScenario } from '../utils/api';
import { GlitchText } from './GlitchText';
import { playSuccess, playError, playTimerTick, playGlitch } from '../utils/audio';

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

  const [scenario, setScenario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    loadScenario();
  }, [currentSector]);

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
  }, [timeLeft, feedback, loading]);

  const loadScenario = async () => {
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
  };

  const handleChoice = async (choice: number) => {
    if (feedback) return;

    setSelectedOption(choice);
    const isCorrect = choice === scenario.correctOption;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      playSuccess();
      const points = 100 + (timeLeft * 5);
      const newScore = score + points;
      setScore(newScore);

      if (sessionId) {
        await updateGameSession(sessionId, { score: newScore });
      }

      setTimeout(() => {
        setCurrentSector(currentSector + 1);
        setPhase('corruption');
      }, 2000);
    } else {
      playError();
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        if (sessionId) {
          await endGameSession(sessionId, score, currentSector, playerName);
        }
        setTimeout(() => setPhase('gameover'), 2000);
      } else {
        setTimeout(() => {
          setFeedback(null);
          setSelectedOption(null);
          setTimeLeft(20);
          loadScenario();
        }, 2000);
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
    <div className="min-h-screen bg-black text-green-400 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-6">
        <div className="flex justify-between items-center bg-black border-2 border-green-600 p-4 font-mono">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <span>SECTOR: <span className="text-yellow-400 font-bold">{currentSector}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span>SCORE: <span className="text-green-400 font-bold">{score}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className={`w-5 h-5 ${lives <= 1 ? 'text-red-500 animate-pulse' : 'text-red-400'}`} />
            <span>LIVES: <span className={`font-bold ${lives <= 1 ? 'text-red-500' : 'text-red-400'}`}>{lives}</span></span>
          </div>
          <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
            {timeLeft}s
          </div>
        </div>

        <div className="bg-green-950/20 border-2 border-green-600 p-4">
          <div className="text-sm text-green-500 mb-2 font-mono">ACTIVE CORRUPTIONS:</div>
          <div className="flex flex-wrap gap-2">
            {corruptedDefinitions.map((def, i) => (
              <span key={i} className="bg-black border border-green-700 px-3 py-1 text-xs font-mono">
                {def.original}→{def.corrupted}
              </span>
            ))}
          </div>
        </div>

        <div className={`border-2 p-8 space-y-6 ${
          feedback === 'correct' ? 'border-green-500 bg-green-950/30' :
          feedback === 'wrong' ? 'border-red-500 bg-red-950/30' :
          'border-yellow-500 bg-black'
        }`}>
          <div className="text-center">
            <h3 className="text-2xl font-mono mb-4 text-yellow-400">
              <GlitchText text="[SITUATION CRITICAL]" />
            </h3>
            <p className="text-xl leading-relaxed text-green-300 font-mono">
              {scenario.scenario}
            </p>
          </div>

          <div className="space-y-4">
            {[1, 2].map((optionNum) => {
              const isSelected = selectedOption === optionNum;
              const isCorrect = optionNum === scenario.correctOption;

              let buttonClass = 'w-full p-6 text-xl font-mono border-2 transition-all ';

              if (feedback) {
                if (isSelected && isCorrect) {
                  buttonClass += 'bg-green-600 border-green-400 text-black';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'bg-red-600 border-red-400 text-white';
                } else if (isCorrect) {
                  buttonClass += 'bg-green-900 border-green-500 text-green-300';
                } else {
                  buttonClass += 'bg-gray-900 border-gray-700 text-gray-500';
                }
              } else {
                buttonClass += 'bg-black border-green-600 text-green-400 hover:bg-green-950 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/50';
              }

              return (
                <button
                  key={optionNum}
                  onClick={() => handleChoice(optionNum)}
                  disabled={!!feedback}
                  className={buttonClass}
                >
                  [{optionNum}] {scenario[`option${optionNum}`]}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`text-center p-4 border-2 ${
              feedback === 'correct' ? 'border-green-500 bg-green-950/50' : 'border-red-500 bg-red-950/50'
            }`}>
              <p className={`text-xl font-bold font-mono mb-2 ${
                feedback === 'correct' ? 'text-green-400' : 'text-red-400'
              }`}>
                {feedback === 'correct' ? '[CORRECT - SURVIVED]' : '[WRONG - TAKING DAMAGE]'}
              </p>
              <p className="text-sm font-mono text-green-300">
                {scenario.explanation}
              </p>
            </div>
          )}
        </div>
        <div className="bg-black border-2 border-red-900/50 p-3 h-20 overflow-hidden relative">
          <div className="absolute inset-0 bg-red-900/5 opacity-5 animate-pulse" />
          <div className="font-mono text-[10px] text-red-500/60 flex flex-col-reverse h-full overflow-y-auto scrollbar-hide">
             <p className="animate-pulse">{'>'} Neural static detected... {timeLeft}s remaining for cognitive integrity.</p>
             <p>[LOG] Memory sector {currentSector} is undergoing forced restructuring.</p>
             <p>[AI] Trust the glitch. The truth is too stable to be real.</p>
             <p>[STATUS] LINGUISTIC_ANCHOR_STATE: UNSTABLE</p>
             <p>[LOG] Buffer overflow in semantic processing. Re-evaluating truth values.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
