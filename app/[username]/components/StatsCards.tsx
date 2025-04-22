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
      <Card className="bg-playdamnit-dark/30 border-playdamnit-purple/10 rounded-xl overflow-hidden group hover:border-playdamnit-purple/30 transition-colors">
        <CardHeader className="pb-2 relative">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-playdamnit-light/70">
            <Clock className="w-4 h-4 text-playdamnit-cyan" />
            Total Playtime
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-playdamnit-light">
            {totalPlaytime}h
          </div>
          <div className="text-xs text-playdamnit-light/40 mt-1">
            Across {totalGames} games
          </div>
        </CardContent>
      </Card>

      <Card className="bg-playdamnit-dark/30 border-playdamnit-purple/10 rounded-xl overflow-hidden group hover:border-playdamnit-purple/30 transition-colors">
        <CardHeader className="pb-2 relative">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-playdamnit-light/70">
            <Trophy className="w-4 h-4 text-playdamnit-cyan" />
            Completion Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-playdamnit-light">
            {completionRate.toFixed(1)}%
          </div>
          <Progress
            value={completionRate}
            className="mt-2 h-1.5 bg-playdamnit-dark"
          />
        </CardContent>
      </Card>

      <Card className="bg-playdamnit-dark/30 border-playdamnit-purple/10 rounded-xl overflow-hidden group hover:border-playdamnit-purple/30 transition-colors">
        <CardHeader className="pb-2 relative">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-playdamnit-light/70">
            <Star className="w-4 h-4 text-playdamnit-cyan" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-playdamnit-light">
            {achievementsCompleted}/{achievementsTotal}
          </div>
          <Progress
            value={(achievementsCompleted / achievementsTotal) * 100 || 0}
            className="mt-2 h-1.5 bg-playdamnit-dark"
          />
        </CardContent>
      </Card>

      <Card className="bg-playdamnit-dark/30 border-playdamnit-purple/10 rounded-xl overflow-hidden group hover:border-playdamnit-purple/30 transition-colors">
        <CardHeader className="pb-2 relative">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-playdamnit-light/70">
            <Gamepad2 className="w-4 h-4 text-playdamnit-cyan" />
            Platform Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1.5">
            {platformDistribution.slice(0, 3).map((item) => (
              <div key={item.platform} className="flex items-center gap-2">
                <div className="flex-1 flex justify-between">
                  <span className="text-playdamnit-light/70 truncate">
                    {item.platform}
                  </span>
                  <span className="text-playdamnit-light">{item.count}</span>
                </div>
                <div className="w-20 h-1.5 bg-playdamnit-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-playdamnit-purple to-playdamnit-cyan"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {platformDistribution.length > 3 && (
              <div className="text-xs text-playdamnit-light/40 text-right">
                +{platformDistribution.length - 3} more
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
