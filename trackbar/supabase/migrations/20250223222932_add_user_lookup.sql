-- Create the user lookup function
CREATE OR REPLACE FUNCTION public.get_user_by_username(p_username text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
DECLARE
  v_result json;
BEGIN
  -- Get the user metadata
  SELECT json_build_object(
    'id', au.id,
    'full_name', au.raw_user_meta_data->>'full_name',
    'avatar_url', au.raw_user_meta_data->>'avatar_url',
    'username', au.raw_user_meta_data->>'username'
  )
  INTO v_result
  FROM auth.users au
  WHERE (au.raw_user_meta_data->>'username')::text = p_username;

  -- Return the result (will be null if no user found)
  RETURN v_result;
END;
$$;

-- Grant execute permission on get_user_by_username
-- This function only retrieves public user profile information, so it's safe for all roles
GRANT EXECUTE ON FUNCTION public.get_user_by_username(text) TO postgres, anon, authenticated, service_role;