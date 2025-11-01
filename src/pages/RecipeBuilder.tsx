import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useAppDispatch } from '@/store/hooks';
import { addRecipe } from '@/store/recipeSlice';
import { Difficulty, Ingredient, RecipeStep } from '@/types/recipe';
import { IngredientForm,StepForm } from '@/components/builder';
import { toast } from 'sonner';

const RecipeBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [title, setTitle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);

  const validate = (): string | null => {
    if (title.trim().length < 3) return 'Title must be at least 3 characters';
    if (ingredients.length === 0) return 'Add at least one ingredient';
    if (steps.length === 0) return 'Add at least one step';
    
    for (const ingredient of ingredients) {
      if (!ingredient.name.trim()) return 'All ingredients must have a name';
      if (ingredient.quantity <= 0) return 'All ingredient quantities must be greater than 0';
      if (!ingredient.unit.trim()) return 'All ingredients must have a unit';
    }
    
    for (const step of steps) {
      if (!step.description.trim()) return 'All steps must have a description';
      if (step.durationMinutes <= 0) return 'All step durations must be greater than 0';
      
      if (step.type === 'cooking') {
        if (!step.cookingSettings) return 'Cooking steps must have cooking settings';
        if (step.cookingSettings.temperature < 40 || step.cookingSettings.temperature > 200) {
          return 'Temperature must be between 40 and 200°C';
        }
        if (step.cookingSettings.speed < 1 || step.cookingSettings.speed > 5) {
          return 'Speed must be between 1 and 5';
        }
      }
      
      if (step.type === 'instruction') {
        if (!step.ingredientIds || step.ingredientIds.length === 0) {
          return 'Instruction steps must have at least one ingredient';
        }
      }
    }
    
    return null;
  };

  const handleSave = () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    
    const now = new Date().toISOString();
    const recipe = {
      id: crypto.randomUUID(),
      title: title.trim(),
      cuisine: cuisine.trim() || undefined,
      difficulty,
      ingredients,
      steps,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };
    
    dispatch(addRecipe(recipe));
    toast.success('Recipe saved successfully!');
    navigate('/recipes');
  };

  return (
    // Component will account for adding Recipes ingredents 
    <Box sx={{ minHeight: '100vh', background: 'var(--gradient-hero)', py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/recipes')}
            sx={{ mb: 2 }}
          >
            Back to Recipes
          </Button>
          <Typography variant="h3" fontWeight="bold" sx={{ background: 'var(--gradient-warm)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Create Recipe
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Recipe Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              helperText="Minimum 3 characters"
            />

            <TextField
              label="Cuisine (Optional)"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              fullWidth
            />

            <FormControl>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                label="Difficulty"
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <IngredientForm ingredients={ingredients} onChange={setIngredients} />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <StepForm steps={steps} ingredients={ingredients} onChange={setSteps} />
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/recipes')}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            sx={{
              background: 'var(--gradient-warm)',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            Save Recipe
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RecipeBuilder;
