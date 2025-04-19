import Image from "next/image"

const features = [
  {
    title: "Track Your Games",
    description:
      "Build and manage your gaming collection across all platforms. Never lose track of what you've played or want to play next.",
    image: "/placeholder.svg?height=600&width=800",
    imageAlt: "Game tracking interface",
  },
  {
    title: "Share Your Thoughts",
    description:
      "Write detailed reviews and share your gaming experiences with a community that cares about authentic opinions.",
    image: "/placeholder.svg?height=600&width=800",
    imageAlt: "Review interface",
  },
  {
    title: "Rate & Compare",
    description: "Give your personal rating to games and see how your scores compare with the community.",
    image: "/placeholder.svg?height=600&width=800",
    imageAlt: "Rating interface",
  },
]

export default function ProductFeatures() {
  return (
    <section className="py-16 bg-gray-950 text-white overflow-hidden">
      <div className="container mx-auto px-4 space-y-32">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={`relative flex items-center gap-8 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
          >
            {/* Content */}
            <div className="w-full lg:w-1/2 space-y-4 relative z-10">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {feature.title}
              </h2>
              <p className="text-lg text-gray-300">{feature.description}</p>
            </div>

            {/* Image */}
            <div className={`w-full lg:w-1/2 relative ${index % 2 === 0 ? "-mr-20" : "-ml-20"}`}>
              <div className="relative aspect-[4/3] transform hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg" />
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.imageAlt}
                  className="rounded-lg shadow-2xl"
                  width={800}
                  height={600}
                  style={{
                    transform: `rotate(${index % 2 === 0 ? "2" : "-2"}deg)`,
                  }}
                />
              </div>
            </div>

            {/* Background Gradient */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at ${index % 2 === 0 ? "right" : "left"}, 
                  ${index === 0 ? "#3b82f6" : index === 1 ? "#8b5cf6" : "#06b6d4"} 0%, 
                  transparent 70%)`,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

