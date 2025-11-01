import { Box, TextField, IconButton, Paper, Typography } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { Ingredient } from '@/types/recipe';

interface IngredientFormProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

const IngredientForm = ({ ingredients, onChange }: IngredientFormProps) => {
  const handleAdd = () => {
    onChange([
      ...ingredients,
      { id: crypto.randomUUID(), name: '', quantity: 0, unit: 'g' },
    ]);
  };

  const handleRemove = (id: string) => {
    onChange(ingredients.filter((i) => i.id !== id));
  };

  const handleChange = (id: string, field: keyof Ingredient, value: string | number) => {
    onChange(
      ingredients.map((i) =>
        i.id === id ? { ...i, [field]: value } : i
      )
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Ingredients</Typography>
        <IconButton onClick={handleAdd} color="primary" size="small">
          <Add />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {ingredients.map((ingredient) => (
          <Paper key={ingredient.id} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                label="Name"
                value={ingredient.name}
                onChange={(e) => handleChange(ingredient.id, 'name', e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Quantity"
                type="number"
                value={ingredient.quantity || ''}
                onChange={(e) => handleChange(ingredient.id, 'quantity', parseFloat(e.target.value) || 0)}
                sx={{ width: 120 }}
                required
                inputProps={{ min: 0, step: 0.1 }}
              />
              <TextField
                label="Unit"
                value={ingredient.unit}
                onChange={(e) => handleChange(ingredient.id, 'unit', e.target.value)}
                sx={{ width: 100 }}
                required
              />
              <IconButton onClick={() => handleRemove(ingredient.id)} color="error">
                <Delete />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>

      {ingredients.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
          No ingredients added yet. Click the + button to add one.
        </Typography>
      )}
    </Box>
  );
};
export default IngredientForm
