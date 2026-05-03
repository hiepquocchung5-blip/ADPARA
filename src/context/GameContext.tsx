import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useStickyState } from '../hooks/useStickyState';

interface GameState {
  totalScore: number;
  currentLevel: Record<string, number>; // Game ID -> Level
  unlockedGames: string[];
  coins: number;
  adsWatchedToday: number;
  lastAdTimestamp: number;
}

interface GameContextType {
  state: GameState;
  setTotalScore: (score: number) => void;
  updateLevel: (gameId: string, level: number) => void;
  currentGame: string | null;
  setCurrentGame: (gameId: string | null) => void;
  adTimer: number;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  showAd: boolean;
  setShowAd: (show: boolean) => void;
  isAdPending: boolean;
  triggerAd: (rewarded?: boolean) => void;
  playtime: number;
  addCoins: (amount: number) => void;
  incrementAdCount: () => void;
  lastAdReward: string | null;
  setLastAdReward: (msg: string | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useStickyState<GameState>(
    { totalScore: 0, currentLevel: {}, unlockedGames: ['bullet-hell', 'clicker'], coins: 100, adsWatchedToday: 0, lastAdTimestamp: 0 },
    'adpara_gaming_state'
  );

  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [adTimer, setAdTimer] = useState(0);
  const [playtime, setPlaytime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [isAdPending, setIsAdPending] = useState(false);
  const [lastAdReward, setLastAdReward] = useState<string | null>(null);

  // Reset daily ad count if it's a new day
  useEffect(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    if (state.lastAdTimestamp < today) {
      setState(prev => ({ ...prev, adsWatchedToday: 0 }));
    }
  }, []);

  // Global timer for active playtime
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (currentGame && !isPaused && !showAd) {
      interval = setInterval(() => {
        setPlaytime((p) => p + 1);
        setAdTimer((t) => {
          const next = t + 1;
          if (next >= 60) {
            setIsAdPending(true);
            return 0; // Reset timer
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentGame, isPaused, showAd]);

  const setTotalScore = (score: number) => {
    setState((prev) => ({ ...prev, totalScore: score }));
  };

  const addCoins = (amount: number) => {
    setState((prev) => ({ ...prev, coins: prev.coins + amount }));
  };

  const incrementAdCount = () => {
    setState(prev => ({
      ...prev,
      adsWatchedToday: prev.adsWatchedToday + 1,
      lastAdTimestamp: Date.now()
    }));
  };

  const triggerAd = (rewarded = false) => {
    // Check if user has exceeded daily limit (fatigue prevention)
    if (state.adsWatchedToday >= 50 && !rewarded) {
      console.log("Ad limit reached for today - skipping automatic ad for user comfort.");
      setIsAdPending(false);
      return;
    }

    if (isAdPending || rewarded) {
      setIsPaused(true);
      setShowAd(true);
      setIsAdPending(false);
    }
  };

  const updateLevel = (gameId: string, level: number) => {
    setState((prev) => ({
      ...prev,
      currentLevel: { ...prev.currentLevel, [gameId]: level },
    }));
  };

  return (
    <GameContext.Provider
      value={{
        state,
        setTotalScore,
        updateLevel,
        currentGame,
        setCurrentGame,
        adTimer,
        isPaused,
        setIsPaused,
        showAd,
        setShowAd,
        isAdPending,
        triggerAd,
        playtime,
        addCoins,
        lastAdReward,
        setLastAdReward,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
