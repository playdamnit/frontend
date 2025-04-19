import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface GameCarouselProps {
  type: "new-releases" | "coming-soon";
}

export default function GameCarousel({ type }: GameCarouselProps) {
  // In a real app, we'd fetch this data from an API
  const games = [
    { id: 1, title: "Game 1", image: "/placeholder.svg?height=200&width=150" },
    { id: 2, title: "Game 2", image: "/placeholder.svg?height=200&width=150" },
    { id: 3, title: "Game 3", image: "/placeholder.svg?height=200&width=150" },
  ];

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {games.map((game) => (
        <Card key={game.id} className="w-[150px] flex-shrink-0 bg-quokka-dark/50 border-quokka-purple/20">
          <CardContent className="p-2">
            <Image
              src={game.image || "/placeholder.svg"}
              alt={game.title}
              width={150}
              height={200}
              className="rounded-md"
            />
            <p className="mt-2 text-sm font-medium text-center text-quokka-light">{game.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
