import {useMemo} from "react";
import * as THREE from "three";

export function useMaterials() {
  return useMemo(() => ({
    lightSquare: new THREE.MeshStandardMaterial({ color: '#f0d9b5', roughness: 0.4 }),
    darkSquare:  new THREE.MeshStandardMaterial({ color: '#b58863', roughness: 0.4 }),
    white:  new THREE.MeshStandardMaterial({ color: '#fffde7', roughness: 0.3, metalness: 0.1 }),
    black:  new THREE.MeshStandardMaterial({ color: '#2c1810', roughness: 0.3, metalness: 0.1 }),
    border: new THREE.MeshStandardMaterial({ color: '#5c3317', roughness: 0.6 }),
  }), [])
}