import { Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { Star, StarBorder, AccessTime, Restaurant } from '@mui/icons-material';
import { Recipe } from '@/types/recipe';
import  { DifficultyChip }  from '@/components/shared';
import { calculateTotalTime } from '@/utils/calculations';
import { useAppDispatch } from '@/store/hooks';
import { toggleFavorite } from '@/store/recipeSlice';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const dispatch = useAppDispatch();
  const totalTime = calculateTotalTime(recipe.steps);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(recipe.id));
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'var(--transition-smooth)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 'var(--shadow-medium)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ flex: 1, pr: 1 }}>
            {recipe.title}
          </Typography>
          <IconButton
            size="small"
            onClick={handleFavoriteClick}
            sx={{ color: recipe.isFavorite ? 'hsl(var(--accent))' : 'inherit' }}
          >
            {recipe.isFavorite ? <Star /> : <StarBorder />}
          </IconButton>
        </Box>

        {recipe.cuisine && (
          <Chip
            icon={<Restaurant sx={{ fontSize: '1rem' }} />}
            label={recipe.cuisine}
            size="small"
            sx={{ mb: 2 }}
          />
        )}

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <DifficultyChip difficulty={recipe.difficulty} />
          <Chip
            icon={<AccessTime sx={{ fontSize: '1rem' }} />}
            label={`${totalTime} min`}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          {recipe.ingredients.length} ingredients · {recipe.steps.length} steps
        </Typography>
      </CardContent>
    </Card>
  );
};
export default RecipeCard