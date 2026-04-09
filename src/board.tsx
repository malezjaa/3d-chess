import {useMaterials} from "@/materials.tsx";
import {useMemo} from "react";

export function Board({ mats, onSquareClick }: { mats: ReturnType<typeof useMaterials>, onSquareClick: (row: number, col: number) => void }) {
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
