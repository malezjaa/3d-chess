import * as THREE from "three";
import type {useMaterials} from "./materials.tsx";
import * as React from "react";
import {useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";

export function Pawn({mat}: { mat: THREE.Material }) {
  return (
    <>
      <mesh position={[0, 0.1, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.1, 16]}/>
      </mesh>
      <mesh position={[0, 0.3, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 0.35, 16]}/>
      </mesh>
      <mesh position={[0, 0.55, 0]} material={mat} castShadow>
        <sphereGeometry args={[0.19, 16, 16]}/>
      </mesh>
    </>
  )
}

export function Rook({mat}: { mat: THREE.Material }) {
  return (
    <>
      <mesh position={[0, 0.1, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.28, 0.33, 0.12, 16]}/>
      </mesh>
      <mesh position={[0, 0.35, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.45, 16]}/>
      </mesh>
      <mesh position={[0, 0.64, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.12, 16]}/>
      </mesh>
      {[-0.13, 0, 0.13].map((dx, i) => (
        <mesh key={i} position={[dx, 0.77, 0]} material={mat} castShadow>
          <boxGeometry args={[0.1, 0.16, 0.26]}/>
        </mesh>
      ))}
    </>
  )
}

export function Knight({mat}: { mat: THREE.Material }) {
  return (
    <>
      <mesh position={[0, 0.1, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.27, 0.32, 0.12, 16]}/>
      </mesh>
      <mesh position={[0, 0.35, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 0.42, 16]}/>
      </mesh>
      <mesh position={[0.06, 0.68, 0]} material={mat} castShadow>
        <boxGeometry args={[0.24, 0.28, 0.2]}/>
      </mesh>
      <mesh position={[0.1, 0.84, 0.0]} material={mat} castShadow>
        <boxGeometry args={[0.12, 0.2, 0.12]}/>
      </mesh>
    </>
  )
}

export function Bishop({mat}: { mat: THREE.Material }) {
  return (
    <>
      <mesh position={[0, 0.1, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.26, 0.31, 0.12, 16]}/>
      </mesh>
      <mesh position={[0, 0.38, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.11, 0.2, 0.5, 16]}/>
      </mesh>
      <mesh position={[0, 0.68, 0]} material={mat} castShadow>
        <sphereGeometry args={[0.17, 16, 16]}/>
      </mesh>
      <mesh position={[0, 0.88, 0]} material={mat} castShadow>
        <sphereGeometry args={[0.07, 12, 12]}/>
      </mesh>
    </>
  )
}

export function Queen({mat}: { mat: THREE.Material }) {
  return (
    <>
      <mesh position={[0, 0.07, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.33, 0.38, 0.14, 16]}/>
      </mesh>
      <mesh position={[0, 0.38, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.13, 0.22, 0.48, 16]}/>
      </mesh>
      <mesh position={[0, 0.65, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.1, 16]}/>
      </mesh>
      <mesh position={[0, 0.76, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.12, 16]}/>
      </mesh>
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const a = (deg * Math.PI) / 180
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.16, 0.88, Math.sin(a) * 0.16]}
            material={mat}
            castShadow
          >
            <sphereGeometry args={[0.06, 10, 10]}/>
          </mesh>
        )
      })}
    </>
  )
}

export function King({mat}: { mat: THREE.Material }) {
  return (
    <>
      <mesh position={[0, 0.1, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.14, 16]}/>
      </mesh>
      <mesh position={[0, 0.44, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.14, 0.25, 0.56, 16]}/>
      </mesh>
      <mesh position={[0, 0.76, 0]} material={mat} castShadow>
        <cylinderGeometry args={[0.27, 0.27, 0.12, 16]}/>
      </mesh>
      <mesh position={[0, 1.0, 0]} material={mat} castShadow>
        <boxGeometry args={[0.1, 0.38, 0.1]}/>
      </mesh>
      <mesh position={[0, 1.1, 0]} material={mat} castShadow>
        <boxGeometry args={[0.3, 0.1, 0.1]}/>
      </mesh>
    </>
  )
}

export type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P'
export type Color = 'white' | 'black'

export interface PieceConfig {
  type: PieceType
  color: Color
  col: number
  row: number
}

const SCALE_DEFAULT = 1.0
const SCALE_HOVERED = 1.15
const SCALE_SELECTED = 1.25
const LERP_SPEED = 12

function PieceWrapper({pos, onClick, onPointerOver, onPointerOut, isSelected, isHovered, children,}: {
  pos: [number, number, number]
  onClick?: () => void
  onPointerOver?: () => void
  onPointerOut?: () => void
  isSelected?: boolean
  isHovered?: boolean
  children: React.ReactNode
}) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const targetScale = isSelected
      ? SCALE_SELECTED
      : isHovered
        ? SCALE_HOVERED
        : SCALE_DEFAULT
    const current = groupRef.current.scale.x
    const next = THREE.MathUtils.lerp(current, targetScale, 1 - Math.exp(-LERP_SPEED * delta))
    groupRef.current.scale.setScalar(next)
  })

  return (
    <group
      ref={groupRef}
      position={pos}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      castShadow
    >
      {children}
    </group>
  )
}

export function Piece({config, mats, isSelected, onClick, onPointerOver, onPointerOut,}: {
  config: PieceConfig
  mats: ReturnType<typeof useMaterials>
  isSelected?: boolean
  onClick?: () => void
  onPointerOver?: () => void
  onPointerOut?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const mat = config.color === 'white' ? mats.white : mats.black
  const pos: [number, number, number] = [config.col - 3.5, 0.04, config.row - 3.5]

  const handlePointerOver = () => {
    setHovered(true)
    onPointerOver?.()
  }

  const handlePointerOut = () => {
    setHovered(false)
    onPointerOut?.()
  }

  const inner = (() => {
    switch (config.type) {
      case 'P': return <Pawn mat={mat}/>
      case 'R': return <Rook mat={mat}/>
      case 'N': return <Knight mat={mat}/>
      case 'B': return <Bishop mat={mat}/>
      case 'Q': return <Queen mat={mat}/>
      case 'K': return <King mat={mat}/>
    }
  })()

  return (
    <PieceWrapper
      pos={pos}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      isSelected={isSelected}
      isHovered={hovered}
    >
      {inner}
    </PieceWrapper>
  )
}