-- Step 1: Check your current profile (optional - to verify your email)
SELECT email, user_role, full_name 
FROM user_profiles 
ORDER BY created_at DESC;

-- Step 2: Make yourself admin (REPLACE THE EMAIL BELOW!)
UPDATE user_profiles 
SET user_role = 'admin' 
WHERE email = 'hardiksedani2610@gmail.com';  -- ⬅️ CHANGE THIS TO YOUR EMAIL!

-- Step 3: Verify the update worked
SELECT email, user_role 
FROM user_profiles 
WHERE email = 'hardiksedani2610@gmail.com';  -- ⬅️ CHANGE THIS TO YOUR EMAIL!