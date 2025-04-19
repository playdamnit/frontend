## Background Processing with PGMQ

The application uses PostgreSQL Message Queue (PGMQ) to handle background processing of game data from IGDB. This ensures that search results are returned quickly to users while detailed game information is processed asynchronously.

### Queue Architecture

1. **Enqueuing**: When users search for games, the results are immediately returned from the cache or a quick search, while the detailed game data is added to a queue for background processing.

2. **Processing**: A SQL-based cron job runs every 30 seconds to process the queue:

   - Dequeues up to 25 messages at a time
   - Stores the game data in the PostgreSQL database
   - Archives processed messages

3. **Monitoring**: The system includes a utility function to check queue status.

### How to Use

#### Running Migrations

To set up the queue and cron job:

```bash
pnpm supabase:migrate
```

This will create all necessary tables, functions, and schedule the cron job.

#### Checking Queue Status

You can check the status of the queue by running:

```sql
SELECT * FROM public.check_queue_status();
```

This will show the number of active, archived, and deadletter messages.

#### Manual Processing

If you need to process the queue immediately:

```sql
SELECT public.process_game_queue();
```

#### Monitoring via PostgreSQL Logs

The cron job logs its activity to the PostgreSQL logs with NOTICE and WARNING levels. You can view these logs in your Supabase dashboard or PostgreSQL log files.
