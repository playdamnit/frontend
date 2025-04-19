-- Enable the pgmq extension
CREATE EXTENSION IF NOT EXISTS pgmq;

-- Create a new queue
SELECT pgmq.create('game_store_queue');

-- Create wrapper functions in public schema for pgmq
CREATE OR REPLACE FUNCTION public.enqueue_game(
    p_queue_name text,
    p_message jsonb
) RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_game_id bigint;
    v_msg_id bigint;
BEGIN
    -- Extract game ID from the message
    v_game_id := (p_message->>'id')::bigint;
    
    -- Check if a message with this game ID already exists in the queue
    -- We look at both the active queue and messages being processed (within their visibility timeout)
    IF EXISTS (
        SELECT 1 
        FROM pgmq.q_game_store_queue 
        WHERE (message->>'id')::bigint = v_game_id
        AND vt > now()  -- message is either not read or still within visibility timeout
    ) THEN
        RETURN NULL;  -- Skip duplicate
    END IF;

    -- No duplicate found, send the message
    v_msg_id := pgmq.send(p_queue_name, p_message);
    RETURN v_msg_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.dequeue_games(
    p_queue_name text,
    p_count integer DEFAULT 1,
    p_visibility_timeout integer DEFAULT 30
) RETURNS TABLE (
    msg_id bigint,
    read_ct int,
    enqueued_at timestamptz,
    vt timestamptz,
    message jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM pgmq.read(
        queue_name => p_queue_name,
        vt => p_visibility_timeout,
        qty => p_count
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.archive_game_message(
    p_queue_name text,
    p_msg_id bigint
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    PERFORM pgmq.archive(p_queue_name, p_msg_id);
END;
$$;

-- Grant execute permissions on the wrapper functions
-- Only service_role and authenticated users should be able to enqueue games
GRANT EXECUTE ON FUNCTION public.enqueue_game TO authenticated, service_role;

-- Only service_role should be able to dequeue and archive messages
GRANT EXECUTE ON FUNCTION public.dequeue_games TO service_role;
GRANT EXECUTE ON FUNCTION public.archive_game_message TO service_role;