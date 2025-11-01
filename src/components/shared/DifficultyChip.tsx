import { Chip } from '@mui/material';
import { Difficulty } from '@/types/recipe';

interface DifficultyChipProps {
  difficulty: Difficulty;
  size?: 'small' | 'medium';
}

const DIFFICULTY_COLORS = {
  Easy: { bg: 'hsl(var(--secondary))', text: 'hsl(var(--secondary-foreground))' },
  Medium: { bg: 'hsl(var(--warning))', text: 'hsl(var(--warning-foreground))' },
  Hard: { bg: 'hsl(var(--primary))', text: 'hsl(var(--primary-foreground))' },
};

const DifficultyChip = ({ difficulty, size = 'small' }: DifficultyChipProps) => {
  const colors = DIFFICULTY_COLORS[difficulty];
  
  return (
    <Chip
      label={difficulty}
      size={size}
      sx={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
      }}
    />
  );
};
export default DifficultyChip
