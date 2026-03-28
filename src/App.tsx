import {useMemo, useRef} from 'react'
import {OrbitControls} from '@react-three/drei'
import * as THREE from 'three'
import {useMaterials} from './materials'
import {Piece, type PieceConfig, type PieceType} from './pieces'
import {GameProvider, useGame} from "./context.tsx";

function Board({ mats }: { mats: ReturnType<typeof useMaterials> }) {
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
  const groupRef = useRef<THREE.Group>(null!)

  const pieces = useMemo(() => {
    const out: PieceConfig[] = []
    Object.entries(game.exportJson().pieces).forEach(([pos, piece]) => {
      const type = (piece as string).toUpperCase() as PieceType
      const color = (piece as string).toLowerCase() === piece ? 'black' : 'white'
      const col = pos.charCodeAt(0) - 65
      const row = parseInt(pos.slice(1), 10) - 1
      out.push({ type, color, col, row })
    })
    return out
  }, [game])

  return (
    <>
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 4}
        minDistance={6}
        maxDistance={20}
        target={[0, 0, 0]}
      />
      <group ref={groupRef}>
        <Board mats={mats} />
        {pieces.map((p, i) => (
          <Piece
            key={i}
            config={p}
            mats={mats}
            onClick={() => setSelectedPiece(
              selectedPiece === p ? null : p
            )}
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