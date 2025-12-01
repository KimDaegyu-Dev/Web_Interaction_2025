-- Real-time Cursors Table
-- DEPRECATED: This table is no longer used for realtime cursor updates.
-- Cursor positions are now transmitted via Supabase Broadcast channels only (no DB storage).
-- This table is kept for backward compatibility but is not actively used.
-- See: src/three/hooks/useRealtimeCursors.ts for the broadcast implementation.
CREATE TABLE IF NOT EXISTS cursors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  grid_x INTEGER NOT NULL,
  grid_z INTEGER NOT NULL,
  color TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE cursors ENABLE ROW LEVEL SECURITY;

-- Allow all operations for all users (since this is a public collaborative space)
CREATE POLICY "Allow all operations on cursors" ON cursors
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cursors_user_id ON cursors(user_id);
CREATE INDEX IF NOT EXISTS idx_cursors_updated_at ON cursors(updated_at);

-- Enable real-time for cursors table
ALTER PUBLICATION supabase_realtime ADD TABLE cursors;

-- Global Switch Table
-- This table stores the global light/dark mode state
CREATE TABLE IF NOT EXISTS global_switch (
  id TEXT PRIMARY KEY,
  is_light_mode BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE global_switch ENABLE ROW LEVEL SECURITY;

-- Allow all operations for all users
CREATE POLICY "Allow all operations on global_switch" ON global_switch
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable real-time for global_switch table
ALTER PUBLICATION supabase_realtime ADD TABLE global_switch;

-- Insert initial global switch state
INSERT INTO global_switch (id, is_light_mode, updated_at)
VALUES ('global-light-switch', false, NOW())
ON CONFLICT (id) DO NOTHING;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for cursors table
CREATE TRIGGER update_cursors_updated_at
  BEFORE UPDATE ON cursors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for global_switch table
CREATE TRIGGER update_global_switch_updated_at
  BEFORE UPDATE ON global_switch
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
