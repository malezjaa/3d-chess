import {createContext, type ReactNode, useContext, useState} from 'react'
import type {PieceConfig} from './pieces'
import {Game} from "js-chess-engine";

type GameContextValue = {
  selectedPiece: PieceConfig | null
  setSelectedPiece: (piece: PieceConfig | null) => void
  setGame: (game: Game) => void
  resetGame: () => void
  game: Game
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [selectedPiece, setSelectedPiece] = useState<PieceConfig | null>(null)
  const [game, setGame] = useState(new Game())

  const resetGame = () => {
    setSelectedPiece(null)
    setGame(new Game())
  }

  return (
    <GameContext.Provider value={{ selectedPiece, setSelectedPiece, game, setGame, resetGame }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within a GameProvider')
  return ctx
}
