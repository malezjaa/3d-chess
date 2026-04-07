import {useEffect, useMemo, useRef, useState} from 'react'
import {OrbitControls} from '@react-three/drei'
import {useMaterials} from './materials'
import {Piece, type PieceConfig, type PieceType} from './pieces'
import {GameProvider, useGame} from "./context.tsx";
import {toast} from "sonner";
import type {OrbitControls as OrbitControlsImpl} from 'three-stdlib'
import type {ThreeEvent} from '@react-three/fiber'
import {toChessNotation} from "@/lib/utils.ts";

function Board({ mats, onSquareClick }: { mats: ReturnType<typeof useMaterials>, onSquareClick: (row: number, col: number) => void }) {
  const TILE = 1
  const squares = useMemo(() => {
    const out = []
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++)
        out.push({ r, c, light: (r + c) % 2 === 0 })
    return out
  }, [])

  return (
    <group>
      {squares.map(({ r, c, light }) => (
        <mesh
          key={`${r}-${c}`}
          position={[c * TILE - 3.5, 0, r * TILE - 3.5]}
          material={light ? mats.lightSquare : mats.darkSquare}
          onClick={() => onSquareClick(r, c)}
          receiveShadow
        >
          <boxGeometry args={[TILE, 0.08, TILE]} />
        </mesh>
      ))}
    </group>
  )
}

function Scene({ mats }: { mats: ReturnType<typeof useMaterials> }) {
  const { selectedPiece, setSelectedPiece, game } = useGame()
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const [, setMoveVersion] = useState(0)
  const gameState = game.exportJson()
  const turn = gameState.turn

  const handleSquareClick = (row: number, col: number) => {
    const to = toChessNotation(col, row);

    if (selectedPiece) {
      const from = toChessNotation(selectedPiece.col, selectedPiece.row);
      try {
        game.move(from, to)
        setSelectedPiece(null)
        setMoveVersion((v) => v + 1)
      } catch (err: unknown) {
        toast.error(`Invalid move ${err}`)
      }
    }
  }

  const isSameSquare = (a: PieceConfig | null, b: PieceConfig) => {
    if (!a) return false
    return a.col === b.col && a.row === b.row
  }

  const pieces = useMemo(() => {
    const out: PieceConfig[] = []
    Object.entries(gameState.pieces).forEach(([pos, piece]) => {
      const type = (piece as string).toUpperCase() as PieceType
      const color = (piece as string).toLowerCase() === piece ? 'black' : 'white'
      const col = pos.charCodeAt(0) - 65
      const row = parseInt(pos.slice(1), 10) - 1
      out.push({ type, color, col, row })
    })
    return out
  }, [gameState])

  useEffect(() => {
    if (!controlsRef.current) {
      return
    }

    const azimuth = turn === 'white' ? Math.PI : 0
    controlsRef.current.minAzimuthAngle = azimuth
    controlsRef.current.maxAzimuthAngle = azimuth
    controlsRef.current.setAzimuthalAngle(azimuth)
    controlsRef.current.update()
  }, [turn])

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 4}
        minDistance={6}
        maxDistance={20}
        target={[0, 0, 0]}
      />
      <group>
        <Board mats={mats} onSquareClick={handleSquareClick} />
        {pieces.map((p) => (
          <Piece
            key={`${p.color}-${p.type}-${p.col}-${p.row}`}
            config={p}
            mats={mats}
            isSelected={isSameSquare(selectedPiece, p)}
            hoverable={p.color === turn}
            onClick={(event: ThreeEvent<MouseEvent>) => {
              event.stopPropagation()

              if (p.color === turn) {
                setSelectedPiece(isSameSquare(selectedPiece, p) ? null : p)
                return
              }

              if (selectedPiece) {
                handleSquareClick(p.row, p.col)
                return
              }

              toast.error("Not your turn")
            }}
          />
        ))}
      </group>
    </>
  )
}

export default function App() {
  const mats = useMaterials()

  return (
    <GameProvider>
      <Scene mats={mats} />
    </GameProvider>
  )
}
