-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to process the game queue
CREATE OR REPLACE FUNCTION public.process_game_queue()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_batch_size INTEGER := 100;  -- Number of messages to process in one batch
    v_processed INTEGER := 0;
    v_msg RECORD;
    v_game JSONB;
    v_queue_name TEXT := 'game_store_queue';
BEGIN
    -- Log start of processing
    RAISE NOTICE 'Starting to process game queue at %', now();
    
    -- Process up to v_batch_size messages
    FOR v_msg IN 
        SELECT * FROM pgmq.read(v_queue_name, 60, v_batch_size)
    LOOP
        BEGIN
            v_processed := v_processed + 1;
            v_game := v_msg.message::jsonb;
            
            RAISE NOTICE 'Processing message % with game ID %', v_msg.msg_id, v_game->>'id';
            
            -- Insert or update the game in the database
            INSERT INTO public.games (
                id, 
                name, 
                slug, 
                summary, 
                storyline, 
                first_release_date,
                created_at,
                total_rating,
                involved_companies,
                keywords,
                similar_games,
                updated_at
            ) VALUES (
                (v_game->>'id')::integer,
                v_game->>'name',
                v_game->>'slug',
                v_game->>'summary',
                v_game->>'storyline',
                (v_game->>'first_release_date')::timestamp with time zone,
                (v_game->>'created_at')::timestamp with time zone,
                (v_game->>'total_rating')::decimal,
                v_game->>'involved_companies',
                v_game->>'keywords',
                CASE 
                    WHEN v_game ? 'similar_games' AND jsonb_typeof(v_game->'similar_games') = 'array' 
                    THEN (SELECT array_agg(x::bigint) FROM jsonb_array_elements_text(v_game->'similar_games') AS x)
                    ELSE NULL::bigint[]
                END,
                now()
            )
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                slug = EXCLUDED.slug,
                summary = EXCLUDED.summary,
                storyline = EXCLUDED.storyline,
                first_release_date = EXCLUDED.first_release_date,
                total_rating = EXCLUDED.total_rating,
                involved_companies = EXCLUDED.involved_companies,
                keywords = EXCLUDED.keywords,
                similar_games = EXCLUDED.similar_games,
                updated_at = now();
                
            -- Store cover if it exists
            IF v_game ? 'cover' THEN
                INSERT INTO public.covers (
                    id,
                    game_id,
                    url,
                    width,
                    height
                ) VALUES (
                    (v_game->'cover'->>'id')::bigint,
                    (v_game->>'id')::bigint,
                    v_game->'cover'->>'url',
                    (v_game->'cover'->>'width')::integer,
                    (v_game->'cover'->>'height')::integer
                )
                ON CONFLICT (id) DO UPDATE SET
                    url = EXCLUDED.url,
                    width = EXCLUDED.width,
                    height = EXCLUDED.height;
            END IF;
            
            -- Store screenshots if they exist
            IF v_game ? 'screenshots' AND jsonb_array_length(v_game->'screenshots') > 0 THEN
                FOR i IN 0..jsonb_array_length(v_game->'screenshots')-1 LOOP
                    INSERT INTO public.screenshots (
                        id,
                        game_id,
                        url,
                        width,
                        height
                    ) VALUES (
                        (v_game->'screenshots'->i->>'id')::bigint,
                        (v_game->>'id')::bigint,
                        v_game->'screenshots'->i->>'url',
                        (v_game->'screenshots'->i->>'width')::integer,
                        (v_game->'screenshots'->i->>'height')::integer
                    )
                    ON CONFLICT (id) DO UPDATE SET
                        url = EXCLUDED.url,
                        width = EXCLUDED.width,
                        height = EXCLUDED.height;
                END LOOP;
            END IF;
            
            -- Store websites if they exist
            IF v_game ? 'websites' AND jsonb_array_length(v_game->'websites') > 0 THEN
                FOR i IN 0..jsonb_array_length(v_game->'websites')-1 LOOP
                    -- First ensure the website type exists
                    IF v_game->'websites'->i ? 'type' AND jsonb_typeof(v_game->'websites'->i->'type') = 'object' AND v_game->'websites'->i->'type' ? 'id' THEN
                        INSERT INTO public.website_types (
                            id,
                            type
                        ) VALUES (
                            (v_game->'websites'->i->'type'->>'id')::bigint,
                            v_game->'websites'->i->'type'->>'type'
                        )
                        ON CONFLICT (id) DO NOTHING;
                        
                        -- Then insert the website with type_id
                        INSERT INTO public.websites (
                            id,
                            game_id,
                            url,
                            trusted,
                            type_id
                        ) VALUES (
                            (v_game->'websites'->i->>'id')::bigint,
                            (v_game->>'id')::bigint,
                            v_game->'websites'->i->>'url',
                            (v_game->'websites'->i->>'trusted')::boolean,
                            (v_game->'websites'->i->'type'->>'id')::bigint
                        )
                        ON CONFLICT (id) DO UPDATE SET
                            url = EXCLUDED.url,
                            trusted = EXCLUDED.trusted,
                            type_id = EXCLUDED.type_id;
                    END IF;
                END LOOP;
            END IF;
            
            -- Store game modes relationships if they exist
            IF v_game ? 'game_modes' AND jsonb_array_length(v_game->'game_modes') > 0 THEN
                FOR i IN 0..jsonb_array_length(v_game->'game_modes')-1 LOOP
                    -- First ensure the game mode exists
                    INSERT INTO public.game_modes (
                        id,
                        name,
                        slug
                    ) VALUES (
                        (v_game->'game_modes'->i->>'id')::bigint,
                        v_game->'game_modes'->i->>'name',
                        v_game->'game_modes'->i->>'slug'
                    )
                    ON CONFLICT (id) DO NOTHING;
                    
                    -- Then create the relationship
                    INSERT INTO public.game_to_modes (
                        game_id,
                        mode_id
                    ) VALUES (
                        (v_game->>'id')::bigint,
                        (v_game->'game_modes'->i->>'id')::bigint
                    )
                    ON CONFLICT (game_id, mode_id) DO NOTHING;
                END LOOP;
            END IF;
            
            -- Store genres relationships if they exist
            IF v_game ? 'genres' AND jsonb_array_length(v_game->'genres') > 0 THEN
                FOR i IN 0..jsonb_array_length(v_game->'genres')-1 LOOP
                    -- First ensure the genre exists
                    INSERT INTO public.genres (
                        id,
                        name,
                        slug
                    ) VALUES (
                        (v_game->'genres'->i->>'id')::bigint,
                        v_game->'genres'->i->>'name',
                        v_game->'genres'->i->>'slug'
                    )
                    ON CONFLICT (id) DO NOTHING;
                    
                    -- Then create the relationship
                    INSERT INTO public.game_to_genres (
                        game_id,
                        genre_id
                    ) VALUES (
                        (v_game->>'id')::bigint,
                        (v_game->'genres'->i->>'id')::bigint
                    )
                    ON CONFLICT (game_id, genre_id) DO NOTHING;
                END LOOP;
            END IF;
            
            -- Store platforms relationships if they exist
            IF v_game ? 'platforms' AND jsonb_array_length(v_game->'platforms') > 0 THEN
                FOR i IN 0..jsonb_array_length(v_game->'platforms')-1 LOOP
                    -- First ensure the platform exists
                    INSERT INTO public.platforms (
                        id,
                        name,
                        slug
                    ) VALUES (
                        (v_game->'platforms'->i->>'id')::bigint,
                        v_game->'platforms'->i->>'name',
                        v_game->'platforms'->i->>'slug'
                    )
                    ON CONFLICT (id) DO NOTHING;
                    
                    -- Then create the relationship
                    INSERT INTO public.game_to_platforms (
                        game_id,
                        platform_id
                    ) VALUES (
                        (v_game->>'id')::bigint,
                        (v_game->'platforms'->i->>'id')::bigint
                    )
                    ON CONFLICT (game_id, platform_id) DO NOTHING;
                END LOOP;
            END IF;
            
            -- Handle game_type (single object) if it exists
            IF v_game ? 'game_type' THEN
                -- First ensure the type exists
                INSERT INTO public.types (
                    id,
                    type
                ) VALUES (
                    (v_game->'game_type'->>'id')::bigint,
                    v_game->'game_type'->>'type'
                )
                ON CONFLICT (id) DO NOTHING;
                
                -- Then create the relationship
                INSERT INTO public.game_to_types (
                    game_id,
                    type_id
                ) VALUES (
                    (v_game->>'id')::bigint,
                    (v_game->'game_type'->>'id')::bigint
                )
                ON CONFLICT (game_id, type_id) DO NOTHING;
            END IF;
            
            -- Store game types relationships if they exist
            IF v_game ? 'game_types' AND jsonb_array_length(v_game->'game_types') > 0 THEN
                FOR i IN 0..jsonb_array_length(v_game->'game_types')-1 LOOP
                    -- First ensure the type exists
                    INSERT INTO public.types (
                        id,
                        type
                    ) VALUES (
                        (v_game->'game_types'->i->>'id')::bigint,
                        v_game->'game_types'->i->>'type'
                    )
                    ON CONFLICT (id) DO NOTHING;
                    
                    -- Then create the relationship
                    INSERT INTO public.game_to_types (
                        game_id,
                        type_id
                    ) VALUES (
                        (v_game->>'id')::bigint,
                        (v_game->'game_types'->i->>'id')::bigint
                    )
                    ON CONFLICT (game_id, type_id) DO NOTHING;
                END LOOP;
            END IF;
                
            -- Archive the message
            PERFORM pgmq.archive(v_queue_name, v_msg.msg_id);
            RAISE NOTICE 'Successfully processed and archived message %', v_msg.msg_id;
            
        EXCEPTION WHEN OTHERS THEN
            -- Log the error and continue
            RAISE WARNING 'Error processing message %: %', v_msg.msg_id, SQLERRM;
        END;
    END LOOP;
    
    -- Log completion
    RAISE NOTICE 'Finished processing game queue at %. Processed % messages.', now(), v_processed;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.process_game_queue() TO postgres;
-- Only service_role should be able to directly call the process function
GRANT EXECUTE ON FUNCTION public.process_game_queue() TO service_role;

-- Drop existing cron job if it exists
DO $$
BEGIN
    PERFORM cron.unschedule('process-game-queue');
EXCEPTION WHEN OTHERS THEN
    -- Job doesn't exist, that's fine
END $$;

-- Schedule the cron job to run every minute
-- Note: pg_cron runs jobs as the user who created the job (postgres in this case)
SELECT cron.schedule(
    'process-game-queue',           -- job name
    '2 seconds',                    -- cron schedule (every 2 seconds)
    $$SELECT public.process_game_queue()$$  -- SQL command to execute
);

-- Add a comment to the job
COMMENT ON FUNCTION public.process_game_queue() IS 'Processes messages from the game_store_queue and stores them in the games table';

-- Create a function to manually check queue status
CREATE OR REPLACE FUNCTION public.check_queue_status()
RETURNS TABLE (
    queue_name TEXT,
    active_messages BIGINT,
    archived_messages BIGINT,
    deadletter_messages BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_active BIGINT;
    v_archived BIGINT;
    v_deadletter BIGINT;
BEGIN
    -- Check if tables exist and get counts
    BEGIN
        SELECT count(*) INTO v_active FROM pgmq.q_game_store_queue;
    EXCEPTION WHEN undefined_table THEN
        v_active := 0;
    END;
    
    BEGIN
        SELECT count(*) INTO v_archived FROM pgmq.a_game_store_queue;
    EXCEPTION WHEN undefined_table THEN
        v_archived := 0;
    END;
    
    BEGIN
        SELECT count(*) INTO v_deadletter FROM pgmq.d_game_store_queue;
    EXCEPTION WHEN undefined_table THEN
        v_deadletter := 0;
    END;
    
    -- Return the results
    queue_name := 'game_store_queue';
    active_messages := v_active;
    archived_messages := v_archived;
    deadletter_messages := v_deadletter;
    RETURN NEXT;
    RETURN;
END;
$$;

-- Create a function to manually trigger the queue processing
CREATE OR REPLACE FUNCTION public.trigger_process_game_queue()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    PERFORM public.process_game_queue();
END;
$$;

-- Grant execute permission on the status and trigger functions
-- Status function can be accessed by all roles since it's read-only
GRANT EXECUTE ON FUNCTION public.check_queue_status() TO postgres;
GRANT EXECUTE ON FUNCTION public.check_queue_status() TO anon;
GRANT EXECUTE ON FUNCTION public.check_queue_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_queue_status() TO service_role;

-- Only grant trigger function to postgres and service_role
GRANT EXECUTE ON FUNCTION public.trigger_process_game_queue() TO postgres;
GRANT EXECUTE ON FUNCTION public.trigger_process_game_queue() TO service_role; 