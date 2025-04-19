-- Reference tables from IGDB
CREATE TABLE platforms (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL
);

CREATE TABLE genres (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL
);

CREATE TABLE game_modes (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL
);

CREATE TABLE types (
    id BIGINT PRIMARY KEY,
    type TEXT NOT NULL
);

CREATE TABLE website_types (
    id BIGINT PRIMARY KEY,
    type TEXT NOT NULL
);

-- Main game table
CREATE TABLE games (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    summary TEXT,
    storyline TEXT,
    first_release_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    total_rating DECIMAL(5,2),
    url TEXT,
    type_id BIGINT REFERENCES types(id),
    cover_url TEXT,
    cover_width INTEGER,
    cover_height INTEGER,
    updated_at TIMESTAMP DEFAULT now()
);

-- Game relationships and metadata
CREATE TABLE game_platforms (
    game_id BIGINT REFERENCES games(id),
    platform_id BIGINT REFERENCES platforms(id),
    PRIMARY KEY (game_id, platform_id)
);

CREATE TABLE game_genres (
    game_id BIGINT REFERENCES games(id),
    genre_id BIGINT REFERENCES genres(id),
    PRIMARY KEY (game_id, genre_id)
);

CREATE TABLE game_game_modes (
    game_id BIGINT REFERENCES games(id),
    game_mode_id BIGINT REFERENCES game_modes(id),
    PRIMARY KEY (game_id, game_mode_id)
);

CREATE TABLE game_websites (
    id BIGINT PRIMARY KEY,
    game_id BIGINT REFERENCES games(id),
    url TEXT NOT NULL,
    trusted BOOLEAN DEFAULT false,
    website_type_id BIGINT REFERENCES website_types(id)
);

CREATE TABLE game_companies (
    game_id BIGINT REFERENCES games(id),
    company_id BIGINT,
    company_name TEXT NOT NULL,
    company_slug TEXT NOT NULL,
    PRIMARY KEY (game_id, company_id)
);

CREATE TABLE game_screenshots (
    id BIGINT PRIMARY KEY,
    game_id BIGINT REFERENCES games(id),
    url TEXT NOT NULL,
    width INTEGER,
    height INTEGER
);

CREATE TABLE similar_games (
    game_id BIGINT REFERENCES games(id),
    similar_game_id BIGINT REFERENCES games(id),
    PRIMARY KEY (game_id, similar_game_id)
);

-- Custom tables based on diagram-flow.md
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    handle TEXT UNIQUE,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TYPE game_status AS ENUM (
    'finished',
    'playing',
    'dropped',
    'online',
    'want_to_play',
    'backlog'
);

CREATE TYPE game_source AS ENUM (
    'steam',
    'gog',
    'manual'
);

CREATE TABLE user_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    game_id BIGINT REFERENCES games(id),
    status game_status NOT NULL,
    rating INTEGER CHECK (rating >= 0 AND rating <= 10),
    review TEXT,
    platform_id BIGINT REFERENCES platforms(id),
    source game_source NOT NULL,
    playtime_minutes INTEGER DEFAULT 0,
    achievements_total INTEGER DEFAULT 0,
    achievements_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, game_id)
);

-- Platform connections
CREATE TABLE user_platform_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    platform_name TEXT NOT NULL,
    platform_user_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, platform_name)
);

CREATE TABLE ignored_platform_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    platform_name TEXT NOT NULL,
    platform_game_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, platform_name, platform_game_id)
);

-- Storage policies for game-images bucket
-- Note: You'll need to create the storage bucket 'game-images' in Supabase dashboard
-- and configure it with the following structure:
-- game-images/
--   ├── {game_id}/
--   │   ├── screenshots/
--   │   └── cover/

-- Indexes for better query performance
CREATE INDEX idx_games_name ON games(name);
CREATE INDEX idx_games_slug ON games(slug);
CREATE INDEX idx_user_games_user_id ON user_games(user_id);
CREATE INDEX idx_user_games_status ON user_games(status);
CREATE INDEX idx_user_games_game_id ON user_games(game_id);
CREATE INDEX idx_game_platforms_game_id ON game_platforms(game_id);
CREATE INDEX idx_game_genres_game_id ON game_genres(game_id);
CREATE INDEX idx_game_screenshots_game_id ON game_screenshots(game_id);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ignored_platform_games ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY "Users can manage their own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage their own games" ON user_games
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own platform connections" ON user_platform_connections
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their ignored games" ON ignored_platform_games
    FOR ALL USING (auth.uid() = user_id);

-- Reference tables are publicly readable
CREATE POLICY "Reference tables are publicly readable" ON platforms
    FOR SELECT USING (true);

CREATE POLICY "Reference tables are publicly readable" ON genres
    FOR SELECT USING (true);

CREATE POLICY "Reference tables are publicly readable" ON game_modes
    FOR SELECT USING (true);

CREATE POLICY "Reference tables are publicly readable" ON types
    FOR SELECT USING (true);

CREATE POLICY "Reference tables are publicly readable" ON website_types
    FOR SELECT USING (true);

-- Games and related tables are publicly readable
CREATE POLICY "Games are publicly readable" ON games
    FOR SELECT USING (true);

CREATE POLICY "Game platforms are publicly readable" ON game_platforms
    FOR SELECT USING (true);

CREATE POLICY "Game genres are publicly readable" ON game_genres
    FOR SELECT USING (true);

CREATE POLICY "Game modes are publicly readable" ON game_game_modes
    FOR SELECT USING (true);

CREATE POLICY "Game websites are publicly readable" ON game_websites
    FOR SELECT USING (true);

CREATE POLICY "Game companies are publicly readable" ON game_companies
    FOR SELECT USING (true);

CREATE POLICY "Game screenshots are publicly readable" ON game_screenshots
    FOR SELECT USING (true);

CREATE POLICY "Similar games are publicly readable" ON similar_games
    FOR SELECT USING (true);

-- Trigger to create profile after user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('game-images', 'game-images', true);

-- Set up storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid() = owner AND
  (LOWER(storage.extension(name)) = 'png' OR
   LOWER(storage.extension(name)) = 'jpg' OR
   LOWER(storage.extension(name)) = 'jpeg' OR
   LOWER(storage.extension(name)) = 'gif' OR
   LOWER(storage.extension(name)) = 'webp')
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid() = owner
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid() = owner
);

-- Set up storage policies for game-images
CREATE POLICY "Game images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'game-images');

CREATE POLICY "Authenticated users can upload game images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'game-images' AND
  auth.uid() IS NOT NULL AND
  (LOWER(storage.extension(name)) = 'png' OR
   LOWER(storage.extension(name)) = 'jpg' OR
   LOWER(storage.extension(name)) = 'jpeg' OR
   LOWER(storage.extension(name)) = 'gif' OR
   LOWER(storage.extension(name)) = 'webp')
);

CREATE POLICY "Authenticated users can update game images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'game-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete game images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'game-images' AND
  auth.uid() IS NOT NULL
);
