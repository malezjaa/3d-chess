import {createContext, type ReactNode, useContext, useEffect, useState} from 'react'
import type {PieceConfig} from './pieces'
import {Game} from "js-chess-engine";

type GameContextValue = {
  selectedPiece: PieceConfig | null
  setSelectedPiece: (piece: PieceConfig | null) => void
  setGame: (game: Game) => void
  game: Game
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [selectedPiece, setSelectedPiece] = useState<PieceConfig | null>(null)
  const [game, setGame] = useState(new Game())

  useEffect(() => {
    console.log(selectedPiece)
  }, [selectedPiece])

  return (
    <GameContext.Provider value={{ selectedPiece, setSelectedPiece, game, setGame }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within a GameProvider')
  return ctx
}