import { Clock, Trophy, Star, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatsCardsProps {
  totalPlaytime: number;
  completionRate: number;
  achievementsCompleted: number;
  achievementsTotal: number;
  totalGames: number;
  platformDistribution: Array<{
    platform: string;
    count: number;
    percentage: number;
  }>;
}

export function StatsCards({
  totalPlaytime,
  completionRate,
  achievementsCompleted,
  achievementsTotal,
  totalGames,
  platformDistribution,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-quokka-dark/30 border-quokka-purple/10 rounded-xl overflow-hidden group hover:border-quokka-purple/30 transition-colors">
        <CardHeader className="pb-2 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-quokka-purple to-quokka-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-quokka-light/70">
            <Clock className="w-4 h-4 text-quokka-cyan" />
            Total Playtime
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-quokka-light">
            {totalPlaytime}h
          </div>
          <div className="text-xs text-quokka-light/40 mt-1">
            Across {totalGames} games
          </div>
        </CardContent>
      </Card>

      <Card className="bg-quokka-dark/30 border-quokka-purple/10 rounded-xl overflow-hidden group hover:border-quokka-purple/30 transition-colors">
        <CardHeader className="pb-2 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-quokka-purple to-quokka-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-quokka-light/70">
            <Trophy className="w-4 h-4 text-quokka-cyan" />
            Completion Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-quokka-light">
            {completionRate.toFixed(1)}%
          </div>
          <Progress
            value={completionRate}
            className="mt-2 h-1.5 bg-quokka-dark"
          />
        </CardContent>
      </Card>

      <Card className="bg-quokka-dark/30 border-quokka-purple/10 rounded-xl overflow-hidden group hover:border-quokka-purple/30 transition-colors">
        <CardHeader className="pb-2 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-quokka-purple to-quokka-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-quokka-light/70">
            <Star className="w-4 h-4 text-quokka-cyan" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-quokka-light">
            {achievementsCompleted}/{achievementsTotal}
          </div>
          <Progress
            value={(achievementsCompleted / achievementsTotal) * 100 || 0}
            className="mt-2 h-1.5 bg-quokka-dark"
          />
        </CardContent>
      </Card>

      <Card className="bg-quokka-dark/30 border-quokka-purple/10 rounded-xl overflow-hidden group hover:border-quokka-purple/30 transition-colors">
        <CardHeader className="pb-2 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-quokka-purple to-quokka-cyan scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-quokka-light/70">
            <Gamepad2 className="w-4 h-4 text-quokka-cyan" />
            Platform Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1.5">
            {platformDistribution.slice(0, 3).map((item) => (
              <div key={item.platform} className="flex items-center gap-2">
                <div className="flex-1 flex justify-between">
                  <span className="text-quokka-light/70 truncate">
                    {item.platform}
                  </span>
                  <span className="text-quokka-light">{item.count}</span>
                </div>
                <div className="w-20 h-1.5 bg-quokka-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-quokka-purple to-quokka-cyan"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {platformDistribution.length > 3 && (
              <div className="text-xs text-quokka-light/40 text-right">
                +{platformDistribution.length - 3} more
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
