-- Convert budget_level from text enum to numeric (THB estimate per visit)
-- "low" ≈ 150, "mid" ≈ 400, default to 0 for unknown

-- 1. Drop existing constraints and default first
ALTER TABLE attractions
  ALTER COLUMN budget_level DROP DEFAULT;

ALTER TABLE attractions
  DROP CONSTRAINT IF EXISTS attractions_budget_level_check;

-- 2. Convert data using explicit text comparison
UPDATE attractions SET budget_level =
  CASE budget_level::text
    WHEN 'low' THEN '150'
    WHEN 'mid' THEN '400'
    WHEN 'premium' THEN '800'
    ELSE '0'
  END;

-- 3. Alter column type after data is converted
ALTER TABLE attractions
  ALTER COLUMN budget_level TYPE numeric USING budget_level::numeric;

-- 4. Set new default and constraint
ALTER TABLE attractions
  ALTER COLUMN budget_level SET DEFAULT 0;

ALTER TABLE attractions
  ADD CONSTRAINT attractions_budget_level_check CHECK (budget_level >= 0);
