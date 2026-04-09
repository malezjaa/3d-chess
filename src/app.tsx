import {useEffect, useMemo, useRef, useState} from 'react'
import {OrbitControls} from '@react-three/drei'
import {useMaterials} from './materials'
import {Piece, type PieceConfig, type PieceType} from './pieces'
import {useGame} from "./context.tsx";
import {toast} from "sonner";
import type {OrbitControls as OrbitControlsImpl} from 'three-stdlib'
import type {ThreeEvent} from '@react-three/fiber'
import {toChessNotation} from "@/lib/utils.ts";
import {Board} from "@/board.tsx";

function Scene({ mats }: { mats: ReturnType<typeof useMaterials> }) {
  const { selectedPiece, setSelectedPiece, game, resetGame } = useGame()
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const gameFinishedHandledRef = useRef(false)
  const [, setMoveVersion] = useState(0)
  const gameState = game.exportJson()
  const turn = gameState.turn
  const isGameFinished = gameState.isFinished

  useEffect(() => {
    if (!isGameFinished) {
      gameFinishedHandledRef.current = false
      return
    }

    if (gameFinishedHandledRef.current) return
    gameFinishedHandledRef.current = true

    if (gameState.checkMate) {
      const winner = gameState.turn === 'white' ? 'Black' : 'White'
      toast.success(`${winner} wins by checkmate!`, {
        duration: 3000,
      });


    } else if (gameState.staleMate) {
      toast.info('Draw by stalemate.', {
        duration: 3000,
      })
    } else {
      toast.info('Game over.', {
        duration: 3000,
      })
    }

    const resetTimer = window.setTimeout(() => {
      resetGame()
      setMoveVersion((v) => v + 1)
    }, 2200)

    return () => {
      window.clearTimeout(resetTimer)
    }
  }, [gameState.checkMate, gameState.staleMate, gameState.turn, isGameFinished, resetGame])

  const handleSquareClick = (row: number, col: number) => {
    if (isGameFinished) return

    const to = toChessNotation(col, row);

    if (selectedPiece) {
      const from = toChessNotation(selectedPiece.col, selectedPiece.row);
      try {
        game.move(from, to);
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
    if (!controlsRef.current) return;

    const controls = controlsRef.current;
    const target = turn === 'white' ? Math.PI : 0;
    let animFrameId: number;

    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;

    const animate = () => {
      const current = controls.getAzimuthalAngle();
      let delta = target - current;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;

      if (Math.abs(delta) < 0.001) {
        controls.setAzimuthalAngle(target);
        controls.minAzimuthAngle = controls.maxAzimuthAngle = target;
        controls.update();
        return;
      }

      controls.setAzimuthalAngle(current + delta * 0.12);
      controls.update();
      animFrameId = requestAnimationFrame(animate);
    };

    animFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameId);
  }, [turn]);

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
              if (isGameFinished) return

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
    <Scene mats={mats} />
  )
}
