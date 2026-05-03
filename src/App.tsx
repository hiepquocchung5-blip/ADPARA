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

import GenericGamePlaceholder from './games/GenericGamePlaceholder';
import OpenWorldGame from './games/OpenWorldGame';
import MarioShootingGame from './games/MarioShootingGame';
import PoolGame from './games/PoolGame';
import ChessAiGame from './games/ChessAiGame';

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
      case 'open-world':
        return (
          <GameContainer gameId="open-world" title="Wanderer's Realm" onExit={handleExit}>
            <OpenWorldGame />
          </GameContainer>
        );
      case 'mario-shooting':
        return (
          <GameContainer gameId="mario-shooting" title="Plumber Strike" onExit={handleExit}>
            <MarioShootingGame />
          </GameContainer>
        );
      case 'pool':
        return (
          <GameContainer gameId="pool" title="Neon Billiards" onExit={handleExit}>
            <PoolGame />
          </GameContainer>
        );
      case 'chess-ai':
        return (
          <GameContainer gameId="chess-ai" title="Grandmaster AI" onExit={handleExit}>
            <ChessAiGame />
          </GameContainer>
        );
      default:
        // Use placeholder for all other games
        if (currentGame) {
          // get title from GAMES constant in a real app, here we pass generic
          // Actually, let's just pass the ID formatted a bit
          const title = currentGame.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          return (
            <GameContainer gameId={currentGame} title={title} onExit={handleExit}>
              <GenericGamePlaceholder title={title} />
            </GameContainer>
          );
        }
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
