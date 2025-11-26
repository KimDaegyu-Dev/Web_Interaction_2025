-- Migration: Add mesh_index column to cubes table
-- Date: 2025-11-26

-- Add mesh_index column with default value
ALTER TABLE cubes 
ADD COLUMN IF NOT EXISTS mesh_index INTEGER NOT NULL DEFAULT 0;

-- Create index for mesh_index
CREATE INDEX IF NOT EXISTS idx_cubes_mesh_index ON cubes(mesh_index);

-- Add comment to explain the column
COMMENT ON COLUMN cubes.mesh_index IS 'Index of the mesh to render from the building.glb file (0-12)';
