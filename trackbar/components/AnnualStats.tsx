import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/contexts/GameContext";

export default function AnnualStats() {
  const { games } = useGameContext();

  const totalPlaytime = games.reduce((sum, game) => sum + game.playtime, 0);
  const completedGames = games.filter(
    (game) => game.status === "Completed"
  ).length;
  const completionRate = (completedGames / games.length) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Playtime</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPlaytime} hours</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate.toFixed(2)}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Games Played</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{games.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedGames}</div>
        </CardContent>
      </Card>
    </div>
  );
}
