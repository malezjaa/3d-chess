import {useGame} from "@/context.tsx";
import {Separator} from "@/components/ui/separator.tsx";

export default function MatchStats() {
  const { game } = useGame();
  const history = game.getHistory();

  return (
    <div className="flex flex-col m-4 gap-2 scroll-auto">
      {history.map((entry, i) => {
        const [from, to] = Object.entries(entry.move)[0];
        return (
          <div key={`history-${i}`}>
            {i + 1}. {from} → {to.toString()}
            <Separator/>
          </div>
        );
      })}
    </div>
  );
}