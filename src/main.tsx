import {createRoot} from 'react-dom/client'
import {Canvas} from '@react-three/fiber'
import './index.css'
import App from "./App.tsx";
import {Environment} from "@react-three/drei";
import {Toaster} from "@/components/ui/sonner.tsx";

createRoot(document.getElementById('root')!).render(
  <>
    <Canvas className={"chess-canvas"}>
      <Environment preset={"sunset"}/>
      <App/>
    </Canvas>
    <Toaster/>
  </>
)
