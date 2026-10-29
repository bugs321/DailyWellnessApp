import React, { useState, useEffect, useRef } from 'react';
import { MeditationSession } from '../types';
import { getTodayDateString } from '../utils/dateHelper';
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Heart,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface MeditationViewProps {
  meditationSessions: MeditationSession[];
  onAddSession: (durationMinutes: number, technique: string) => void;
  onBack: () => void;
}

type BoxBreathPhase = 'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)';

export const MeditationView: React.FC<MeditationViewProps> = ({
  meditationSessions,
  onAddSession,
  onBack,
}) => {
  const todayStr = getTodayDateString();
  const todaySessions = meditationSessions.filter((s) => s.date === todayStr);
  const totalMinutesToday = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customMinutesInput, setCustomMinutesInput] = useState('7');

  // 4-Phase Box Breathing cycle: Inhale (4s), Hold (4s), Exhale (4s), Hold (4s)
  const [breathPhase, setBreathPhase] = useState<BoxBreathPhase>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  // Play Tibetan / Solfeggio 528Hz bell chime using Web Audio API
  const playChime = (frequency: number = 528, duration: number = 2.5) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Fundamental harmonic
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.98, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);

      // Overtone resonance
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 2.76, ctx.currentTime);
      gain2.gain.setValueAtTime(0.08, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration * 0.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + duration * 0.8);
    } catch {
      // AudioContext unavailable or blocked by browser autoplay policy
    }
  };

  // Main countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            playChime(440, 3.2); // completion bell
            onAddSession(selectedMinutes, 'Box Breathing (4-4-4-4)');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, selectedMinutes, soundEnabled]);

  // Breathing guidance 4-phase cycle
  useEffect(() => {
    let breathInterval: any = null;
    if (isRunning) {
      breathInterval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathPhase((current) => {
              if (current === 'Inhale') return 'Hold (Full)';
              if (current === 'Hold (Full)') return 'Exhale';
              if (current === 'Exhale') return 'Hold (Empty)';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathPhase('Inhale');
      setBreathTimer(4);
    }
    return () => clearInterval(breathInterval);
  }, [isRunning]);

  const handleSelectDuration = (mins: number) => {
    if (!isRunning) {
      const sanitized = Math.min(60, Math.max(1, mins));
      setSelectedMinutes(sanitized);
      setSecondsLeft(sanitized * 60);
      setIsFinished(false);
    }
  };

  const handleStart = () => {
    playChime(528, 1.8);
    setIsRunning(true);
    setIsFinished(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(selectedMinutes * 60);
    setIsFinished(false);
    setBreathPhase('Inhale');
    setBreathTimer(4);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customMinutesInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 60) {
      handleSelectDuration(parsed);
      setShowCustomModal(false);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const getPhaseDescription = () => {
    switch (breathPhase) {
      case 'Inhale':
        return 'Inhale slowly through your nose...';
      case 'Hold (Full)':
        return 'Hold gently with lungs comfortably full...';
      case 'Exhale':
        return 'Exhale slowly and completely through your mouth...';
      case 'Hold (Empty)':
        return 'Rest quietly before the next breath begins...';
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
        >
          ← Back to Today
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              soundEnabled
                ? 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40'
                : 'text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title={soundEnabled ? 'Bell chime enabled' : 'Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <span className="text-xs text-purple-700 dark:text-purple-300 font-semibold bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
            Mindfulness & Breath
          </span>
        </div>
      </div>

      {/* Duration Selector */}
      <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1">
        {[1, 3, 5, 10, 15, 20].map((mins) => (
          <button
            key={mins}
            disabled={isRunning}
            onClick={() => handleSelectDuration(mins)}
            className={`flex-1 min-w-[50px] py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedMinutes === mins
                ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {mins}m
          </button>
        ))}
        <button
          disabled={isRunning}
          onClick={() => {
            setCustomMinutesInput(String(selectedMinutes));
            setShowCustomModal(true);
          }}
          className={`px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer flex items-center gap-1 ${
            isRunning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <SlidersHorizontal className="w-3 h-3" />
          Custom
        </button>
      </div>

      {/* Central Breathing Orb */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-stone-950 text-white shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-radial-gradient from-purple-600/10 to-transparent pointer-events-none" />

        <div className="relative my-6 flex items-center justify-center">
          {/* Animated breath ring with 4-phase scale and glow */}
          <div
            className={`w-52 h-52 sm:w-60 sm:h-60 rounded-full border-4 border-purple-400/30 flex items-center justify-center transition-all duration-[3500ms] ease-in-out ${
              isRunning && breathPhase === 'Inhale'
                ? 'scale-125 bg-purple-600/30 shadow-2xl shadow-purple-500/40'
                : isRunning && breathPhase === 'Hold (Full)'
                ? 'scale-125 bg-indigo-600/30 shadow-xl shadow-indigo-500/30'
                : isRunning && breathPhase === 'Exhale'
                ? 'scale-90 bg-purple-950/60 shadow-inner'
                : 'scale-90 bg-purple-950/40'
            }`}
          >
            <div
              className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex flex-col items-center justify-center shadow-lg transition-transform duration-[3500ms] ${
                isRunning && (breathPhase === 'Inhale' || breathPhase === 'Hold (Full)')
                  ? 'scale-110'
                  : 'scale-95'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono">{timeFormatted}</div>
              {isRunning && (
                <div className="text-[11px] font-semibold uppercase tracking-wider text-purple-200 mt-1">
                  {breathPhase} ({breathTimer}s)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phase Guidance text */}
        <div className="space-y-1 mb-6 min-h-[44px] flex flex-col items-center justify-center">
          {isFinished ? (
            <p className="text-sm font-semibold text-emerald-300 flex items-center justify-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              Session Completed! Logged to your daily wellness records.
            </p>
          ) : isRunning ? (
            <div className="space-y-0.5">
              <p className="text-xs text-purple-200 font-semibold">{getPhaseDescription()}</p>
              <p className="text-[11px] text-purple-300/70">
                4s Inhale • 4s Hold • 4s Exhale • 4s Rest
              </p>
            </div>
          ) : (
            <p className="text-xs text-purple-200/80">
              Box Breathing: 4-4-4-4 rhythm to center your mind and lower heart rate.
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-sm font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Begin Session
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-6 py-3 rounded-2xl bg-stone-700 hover:bg-stone-600 active:scale-95 text-white text-sm font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Today's Mindfulness Summary Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white">
              Today's Mindfulness
            </h3>
            <p className="text-xs text-stone-500">
              {todaySessions.length === 0
                ? 'No sessions completed today yet'
                : `${todaySessions.length} session(s) completed today`}
            </p>
          </div>
        </div>

        <div className="text-xl font-extrabold text-purple-700 dark:text-purple-300">
          {totalMinutesToday} min
        </div>
      </div>

      {/* Custom Duration Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCustomSubmit}
            className="w-full max-w-xs bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">Custom Duration</h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Session Length (Minutes: 1 - 60)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={customMinutesInput}
                onChange={(e) => setCustomMinutesInput(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Set Timer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
