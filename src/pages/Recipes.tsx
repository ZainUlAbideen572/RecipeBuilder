import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAppSelector } from '@/store/hooks';
import { RecipeCard,RecipeFilters } from '@/components/recipes';
import { Difficulty } from '@/types/recipe';
import { calculateTotalTime } from '@/utils/calculations';

const Recipes = () => {
  const navigate = useNavigate();
  const recipes = useAppSelector((state) => state.recipes.recipes);
  
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = recipes;
    
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter((r) => selectedDifficulties.includes(r.difficulty));
    }
    
    const sorted = [...filtered].sort((a, b) => {
      const timeA = calculateTotalTime(a.steps);
      const timeB = calculateTotalTime(b.steps);
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });
    
    return sorted;
  }, [recipes, selectedDifficulties, sortOrder]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'var(--gradient-hero)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" sx={{ background: 'var(--gradient-warm)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            My Recipes
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/create')}
            sx={{
              background: 'var(--gradient-warm)',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            Create Recipe
          </Button>
        </Box>

        <RecipeFilters
          selectedDifficulties={selectedDifficulties}
          onDifficultyChange={setSelectedDifficulties}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        {filteredAndSortedRecipes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {recipes.length === 0 ? 'No recipes yet' : 'No recipes match your filters'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {recipes.length === 0 ? 'Create your first recipe to get started!' : 'Try adjusting your filters'}
            </Typography>
            {recipes.length === 0 && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/create')}
                sx={{
                  background: 'var(--gradient-warm)',
                }}
              >
                Create Recipe
              </Button>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {filteredAndSortedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => navigate(`/cook/${recipe.id}`)}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Recipes;
