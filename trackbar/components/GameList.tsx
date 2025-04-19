import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Game } from "@/types/game";

interface GameListProps {
  games: Game[];
}

export default function GameList({ games }: GameListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Platform</TableHead>
          <TableHead>Playtime</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => (
          <TableRow key={game.id}>
            <TableCell>{game.title}</TableCell>
            <TableCell>{game.status}</TableCell>
            <TableCell>{game.rating ?? "N/A"}</TableCell>
            <TableCell>{game.platform}</TableCell>
            <TableCell>{game.playtime} hours</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
