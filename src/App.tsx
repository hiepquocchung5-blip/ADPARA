/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import GameHub from './components/layout/GameHub';
import AdManager from './components/ads/AdManager';
import GameContainer from './components/games/GameContainer';

// We'll import these as we create them
import BulletHellGame from './games/BulletHellGame';
import PlatformerGame from './games/PlatformerGame';
import MemoryGame from './games/MemoryGame';
import TowerDefenseGame from './games/TowerDefenseGame';
import ClickerGame from './games/ClickerGame';

function AppContent() {
  const { currentGame, setCurrentGame } = useGame();

  const handleExit = () => setCurrentGame(null);

  const renderGame = () => {
    switch (currentGame) {
      case 'bullet-hell':
        return (
          <GameContainer gameId="bullet-hell" title="Void Survivor" onExit={handleExit}>
            <BulletHellGame />
          </GameContainer>
        );
      case 'platformer':
        return (
          <GameContainer gameId="platformer" title="Neon Runner" onExit={handleExit}>
            <PlatformerGame />
          </GameContainer>
        );
      case 'memory':
        return (
          <GameContainer gameId="memory" title="Neural Link" onExit={handleExit}>
            <MemoryGame />
          </GameContainer>
        );
      case 'tower-defense':
        return (
          <GameContainer gameId="tower-defense" title="Core Breach" onExit={handleExit}>
            <TowerDefenseGame />
          </GameContainer>
        );
      case 'clicker':
        return (
          <GameContainer gameId="clicker" title="Bit Miner Pro" onExit={handleExit}>
            <ClickerGame />
          </GameContainer>
        );
      default:
        return <GameHub />;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-black overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {renderGame()}
      <AdManager />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
