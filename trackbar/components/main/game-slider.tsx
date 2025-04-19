"use client";

import React, { useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Gamepad2, ChevronLeft, ChevronRight } from "lucide-react";
import GameCard from "@/components/main/game-card";
import SkeletonCard from "./skeleton-card";

interface GameSliderProps {
  autoScroll?: boolean;
  direction?: "left" | "right";
  scrollInterval?: number;
  games: any[];
  title?: string;
  icon?: React.ReactNode;
  visibleCount?: number;
}

const getBasisClass = (visibleCount: number) => {
  switch (visibleCount) {
    case 2:
      return "lg:basis-1/2";
    case 3:
      return "lg:basis-1/3";
    case 4:
      return "lg:basis-1/4";
    case 5:
      return "lg:basis-1/5";
    case 6:
      return "lg:basis-1/6";
    default:
      return "lg:basis-1/4";
  }
};

const GameSlider: React.FC<GameSliderProps> = ({
  games = [],
  autoScroll = true,
  direction = "right",
  scrollInterval = 6000,
  title = "Featured Games",
  icon = <Gamepad2 className="w-6 h-6" />,
  visibleCount = 4,
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [isPaused, setIsPaused] = React.useState(false);

  useEffect(() => {
    if (!api || !autoScroll) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        if (direction === "right") {
          api.scrollNext();
        } else {
          api.scrollPrev();
        }
      }
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [api, autoScroll, direction, scrollInterval, isPaused]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 5000);
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const renderContent = () => {
    if (!games || games.length === 0) {
      return Array(visibleCount)
        .fill(0)
        .map((_, index) => (
          <CarouselItem
            key={`skeleton-${index}`}
            className={`pl-2 basis-full md:basis-1/2 ${getBasisClass(
              visibleCount
            )}`}
          >
            <SkeletonCard />
          </CarouselItem>
        ));
    }

    return games
      .filter(({ cover }) => !!cover)
      .map((game, index) => (
        <CarouselItem
          key={index}
          className={`pl-2 basis-full md:basis-1/2 ${getBasisClass(
            visibleCount
          )}`}
        >
          <div>
            <GameCard game={game} />
          </div>
        </CarouselItem>
      ));
  };

  // Custom navigation buttons
  const CustomPrevButton = ({ onClick }: { onClick?: () => void }) => (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full bg-quokka-purple/30 flex items-center justify-center hover:bg-quokka-purple transition-all duration-300 text-white"
      aria-label="Previous slide"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
  );

  const CustomNextButton = ({ onClick }: { onClick?: () => void }) => (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full bg-quokka-purple/30 flex items-center justify-center hover:bg-quokka-purple transition-all duration-300 text-white"
      aria-label="Next slide"
    >
      <ChevronRight className="h-5 w-5" />
    </button>
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto bg-gray-950 p-4 relative z-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>

        {/* Custom navigation controls */}
        <div className="flex items-center gap-2">
          <CustomPrevButton onClick={() => api?.scrollPrev()} />
          <CustomNextButton onClick={() => api?.scrollNext()} />
        </div>
      </div>

      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
          setApi={setApi}
        >
          <CarouselContent className="-ml-2 cursor-grab active:cursor-grabbing">
            {renderContent()}
          </CarouselContent>

          {/* Hidden default controls for accessibility, but we'll use our custom ones */}
          <div className="hidden">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default GameSlider;
