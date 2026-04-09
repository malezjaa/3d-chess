import {createRoot} from 'react-dom/client'
import {Canvas} from '@react-three/fiber'
import './index.css'
import App from "./app.tsx";
import {Environment} from "@react-three/drei";
import {Toaster} from "@/components/ui/sonner.tsx";
import {GameProvider} from "@/context.tsx";
import MatchStats from "@/match-stats.tsx";

createRoot(document.getElementById('root')!).render(
  <>
    <GameProvider>
      <div className={"flex w-full h-full"}>
      <Canvas className={"chess-canvas"}>
        <Environment preset={"sunset"}/>
        <App/>
      </Canvas>
        <div className={"flex flex-col min-w-87.5"}>
          <MatchStats/>
        </div>
      </div>
    </GameProvider>
    <Toaster/>
  </>
)
