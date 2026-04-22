-- Ensure activities are publicly viewable
DROP POLICY IF EXISTS "Activities are viewable by everyone" ON activities;
CREATE POLICY "Activities are viewable by everyone" ON activities FOR SELECT USING (true);

-- Ensure providers are publicly viewable (needed for the join)
DROP POLICY IF EXISTS "Providers are viewable by everyone" ON providers;
CREATE POLICY "Providers are viewable by everyone" ON providers FOR SELECT USING (true);

-- Ensure likes and comments are publicly viewable (needed for the join)
DROP POLICY IF EXISTS "Activity likes are viewable by everyone" ON activity_likes;
CREATE POLICY "Activity likes are viewable by everyone" ON activity_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
