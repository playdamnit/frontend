import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Video } from "@/components/game/video"
import { Badge } from "@/components/ui/badge"
import { Screenshots } from "@/components/game/screenshots"
import { Star, Users, MessageSquare, Calendar, Gamepad2, Building } from "lucide-react"
import Header from "@/components/main/header"
import Footer from "@/components/main/footer"
import { getGameById } from "@/lib/adapters/gameAdapter"

export default async function GamePage({ params }: { params: { id: string } }) {
    const game = await getGameById(params.id)

    return (
        <div className="min-h-screen bg-quokka-darker text-quokka-light">
            <Header />
            
            {/* Hero Section with Game Cover as Background */}
            <div className="relative">
                {game.screenshots && game.screenshots.length > 0 && (
                    <div className="absolute inset-0 w-full h-[500px] overflow-hidden">
                        <div className="relative w-full h-full">
                            <Image 
                                src={`https:${game.screenshots[0].url.replace("t_thumb", "t_screenshot_huge")}`}
                                alt={`${game.name} screenshot`}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-quokka-darker/70 via-quokka-darker/90 to-quokka-darker" />
                        </div>
                    </div>
                )}
                
                <div className="container mx-auto px-4 pt-40 pb-16 relative z-10">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {game.cover ? (
                            <div className="shrink-0 transform transition-transform hover:scale-105">
                                <Image
                                    src={`https:${game.cover.url.replace("t_thumb", "t_cover_big")}`}
                                    alt={`${game.name} cover`}
                                    width={220}
                                    height={300}
                                    className="rounded-xl shadow-2xl border-2 border-quokka-purple/20"
                                />
                            </div>
                        ) : (
                            <div className="w-[220px] h-[300px] bg-quokka-dark rounded-xl shadow-lg" />
                        )}
                        
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-quokka-purple bg-gradient-to-r from-quokka-purple to-quokka-cyan bg-clip-text text-transparent">{game.name}</h1>
                            
                            <div className="flex flex-wrap items-center gap-6 mb-6">
                                {game.rating !== undefined && (
                                    <div className="flex items-center gap-2 bg-quokka-dark/60 backdrop-blur-sm px-4 py-2 rounded-full">
                                        <Star className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-2xl font-bold text-yellow-400">{game.rating.toFixed(1)}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 bg-quokka-dark/60 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Users className="text-quokka-purple" />
                                    <span>{game.lists} lists</span>
                                </div>
                                <div className="flex items-center gap-2 bg-quokka-dark/60 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <MessageSquare className="text-quokka-purple" />
                                    <span>{game.reviews} reviews</span>
                                </div>
                            </div>
                            
                            {game.genres && game.genres.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {game.genres.map((genre) => (
                                        <Badge key={genre.id} variant="outline" className="border-quokka-cyan text-quokka-cyan bg-quokka-dark/40 backdrop-blur-sm px-3 py-1 text-sm">
                                            {genre.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            
                            <div className="flex flex-wrap gap-4">
                                <button className="bg-quokka-purple text-quokka-light hover:bg-quokka-purple/90 py-3 px-6 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-quokka-purple/20 hover:shadow-xl">
                                    Add to Collection
                                </button>
                                <button className="border-2 border-quokka-purple text-quokka-purple hover:bg-quokka-purple/10 py-3 px-6 rounded-full transition-all duration-300 font-semibold">
                                    Add to Wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        {game.summary && (
                            <div className="bg-quokka-dark rounded-xl p-8 shadow-lg border border-quokka-purple/10">
                                <h2 className="text-2xl font-semibold mb-6 text-quokka-cyan flex items-center gap-2">
                                    <span className="inline-block w-1 h-6 bg-quokka-cyan rounded-full mr-2"></span>
                                    About
                                </h2>
                                <p className="text-lg leading-relaxed mb-8 text-quokka-light/90">{game.summary}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                    {Array.isArray(game.involved_companies) && game.involved_companies.length > 0 && (
                                        game.involved_companies.map((company) => (
                                            <div key={company?.company?.id || Math.random()} className="flex flex-col">
                                                <h3 className="text-quokka-purple font-semibold mb-2 flex items-center gap-2">
                                                    <Building className="h-4 w-4" />
                                                    {company && 'developer' in company && company.developer ? 'Developer' : 
                                                     company && 'publisher' in company && company.publisher ? 'Publisher' : 'Company'}
                                                </h3>
                                                <p className="text-quokka-light/80">{company?.company?.name}</p>
                                            </div>
                                        ))
                                    )}
                                    
                                    {typeof game.first_release_date === 'number' && (
                                        <div className="flex flex-col">
                                            <h3 className="text-quokka-purple font-semibold mb-2 flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Release Date
                                            </h3>
                                            <p className="text-quokka-light/80">{formatDistanceToNow(new Date(game.first_release_date * 1000), { addSuffix: true })}</p>
                                        </div>
                                    )}
                                    
                                    {Array.isArray(game.platforms) && game.platforms.length > 0 && (
                                        <div className="flex flex-col">
                                            <h3 className="text-quokka-purple font-semibold mb-2 flex items-center gap-2">
                                                <Gamepad2 className="h-4 w-4" />
                                                Platforms
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {game.platforms.map((platform) => (
                                                    <Badge
                                                        key={platform?.id || Math.random()}
                                                        variant="secondary"
                                                        className="bg-quokka-purple/20 text-quokka-purple"
                                                    >
                                                        {platform?.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Trailer Section */}
                        {game.videos && game.videos.length > 0 && (
                            <div className="bg-quokka-dark rounded-xl p-8 shadow-lg border border-quokka-purple/10">
                                <h2 className="text-2xl font-semibold mb-6 text-quokka-cyan flex items-center gap-2">
                                    <span className="inline-block w-1 h-6 bg-quokka-cyan rounded-full mr-2"></span>
                                    Trailer
                                </h2>
                                <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
                                    <Video videoId={game.videos[0].video_id} />
                                </div>
                            </div>
                        )}

                        {/* Screenshots Section */}
                        {game.screenshots && game.screenshots.length > 0 && (
                            <div className="bg-quokka-dark rounded-xl p-8 shadow-lg border border-quokka-purple/10">
                                <h2 className="text-2xl font-semibold mb-6 text-quokka-cyan flex items-center gap-2">
                                    <span className="inline-block w-1 h-6 bg-quokka-cyan rounded-full mr-2"></span>
                                    Screenshots
                                </h2>
                                <Screenshots screenshots={game.screenshots} />
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Similar Games Placeholder */}
                            <div className="bg-quokka-dark rounded-xl p-6 shadow-lg border border-quokka-purple/10">
                                <h2 className="text-xl font-semibold mb-4 text-quokka-cyan">Similar Games</h2>
                                <p className="text-quokka-light/70 text-sm">Discover games similar to {game.name}</p>
                                {/* This would be populated with actual similar games data */}
                                <div className="mt-4 space-y-4">
                                    <div className="h-16 bg-quokka-darker rounded-lg animate-pulse"></div>
                                    <div className="h-16 bg-quokka-darker rounded-lg animate-pulse"></div>
                                    <div className="h-16 bg-quokka-darker rounded-lg animate-pulse"></div>
                                </div>
                            </div>
                            
                            {/* Community Section */}
                            <div className="bg-quokka-dark rounded-xl p-6 shadow-lg border border-quokka-purple/10">
                                <h2 className="text-xl font-semibold mb-4 text-quokka-cyan">Community</h2>
                                <div className="space-y-3">
                                    <button className="w-full bg-quokka-dark border border-quokka-cyan/50 text-quokka-cyan hover:bg-quokka-cyan/10 py-2 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        View Discussions
                                    </button>
                                    <button className="w-full bg-quokka-dark border border-quokka-purple/50 text-quokka-purple hover:bg-quokka-purple/10 py-2 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
                                        <Star className="h-4 w-4" />
                                        Write a Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    )
}

