import { Box, FormControl, InputLabel, Select, MenuItem, ToggleButtonGroup, ToggleButton, SelectChangeEvent } from '@mui/material';
import { Difficulty } from '@/types/recipe';

interface RecipeFiltersProps {
  selectedDifficulties: Difficulty[];
  onDifficultyChange: (difficulties: Difficulty[]) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
}

const RecipeFilters = ({
  selectedDifficulties,
  onDifficultyChange,
  sortOrder,
  onSortChange,
}: RecipeFiltersProps) => {
  const handleDifficultyChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onDifficultyChange(typeof value === 'string' ? value.split(',') as Difficulty[] : value as Difficulty[]);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Filter by Difficulty</InputLabel>
        <Select<string[]>
          multiple
          value={selectedDifficulties as string[]}
          onChange={handleDifficultyChange}
          label="Filter by Difficulty"
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </Select>
      </FormControl>

      <ToggleButtonGroup
        value={sortOrder}
        exclusive
        onChange={(_, value) => value && onSortChange(value)}
        aria-label="sort order"
      >
        <ToggleButton value="asc" aria-label="ascending">
          Time ↑
        </ToggleButton>
        <ToggleButton value="desc" aria-label="descending">
          Time ↓
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
export default RecipeFilters