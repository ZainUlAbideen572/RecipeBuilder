import { Box, TextField, IconButton, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Chip, OutlinedInput } from '@mui/material';
import { Delete, Add, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { RecipeStep, Ingredient } from '@/types/recipe';

interface StepFormProps {
  steps: RecipeStep[];
  ingredients: Ingredient[];
  onChange: (steps: RecipeStep[]) => void;
}

const StepForm = ({ steps, ingredients, onChange }: StepFormProps) => {
  const handleAdd = () => {
    onChange([
      ...steps,
      {
        id: crypto.randomUUID(),
        description: '',
        type: 'instruction',
        durationMinutes: 1,
        ingredientIds: [],
      },
    ]);
  };

  const handleRemove = (id: string) => {
    onChange(steps.filter((s) => s.id !== id));
  };

  const handleChange = (id: string, updates: Partial<RecipeStep>) => {
    onChange(
      steps.map((s) => {
        if (s.id !== id) return s;
        
        const updated = { ...s, ...updates };
        
        // Type-specific validations
        if (updated.type === 'cooking') {
          delete updated.ingredientIds;
          if (!updated.cookingSettings) {
            updated.cookingSettings = { temperature: 180, speed: 3 };
          }
        } else {
          delete updated.cookingSettings;
          if (!updated.ingredientIds) {
            updated.ingredientIds = [];
          }
        }
        
        return updated;
      })
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    onChange(newSteps);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Steps</Typography>
        <IconButton onClick={handleAdd} color="primary" size="small">
          <Add />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {steps.map((step, index) => (
          <Paper key={step.id} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ minWidth: 80 }}>
                Step {index + 1}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUpward fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === steps.length - 1}
                >
                  <ArrowDownward fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ flex: 1 }} />
              <IconButton onClick={() => handleRemove(step.id)} color="error" size="small">
                <Delete />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Description"
                value={step.description}
                onChange={(e) => handleChange(step.id, { description: e.target.value })}
                fullWidth
                multiline
                rows={2}
                required
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={step.type}
                    onChange={(e) => handleChange(step.id, { type: e.target.value as 'cooking' | 'instruction' })}
                    label="Type"
                  >
                    <MenuItem value="cooking">Cooking</MenuItem>
                    <MenuItem value="instruction">Instruction</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={step.durationMinutes || ''}
                  onChange={(e) => handleChange(step.id, { durationMinutes: parseInt(e.target.value) || 1 })}
                  sx={{ width: 180 }}
                  required
                  inputProps={{ min: 1, step: 1 }}
                />
              </Box>

              {step.type === 'cooking' && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Temperature (°C)"
                    type="number"
                    value={step.cookingSettings?.temperature || 180}
                    onChange={(e) =>
                      handleChange(step.id, {
                        cookingSettings: {
                          ...step.cookingSettings!,
                          temperature: parseInt(e.target.value) || 180,
                        },
                      })
                    }
                    required
                    inputProps={{ min: 40, max: 200 }}
                  />
                  <TextField
                    label="Speed (1-5)"
                    type="number"
                    value={step.cookingSettings?.speed || 3}
                    onChange={(e) =>
                      handleChange(step.id, {
                        cookingSettings: {
                          ...step.cookingSettings!,
                          speed: parseInt(e.target.value) || 3,
                        },
                      })
                    }
                    required
                    inputProps={{ min: 1, max: 5 }}
                  />
                </Box>
              )}

              {step.type === 'instruction' && (
                <FormControl>
                  <InputLabel>Ingredients</InputLabel>
                  <Select
                    multiple
                    value={step.ingredientIds || []}
                    onChange={(e) =>
                      handleChange(step.id, {
                        ingredientIds: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value,
                      })
                    }
                    input={<OutlinedInput label="Ingredients" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((id) => {
                          const ingredient = ingredients.find((i) => i.id === id);
                          return <Chip key={id} label={ingredient?.name || id} size="small" />;
                        })}
                      </Box>
                    )}
                    required
                  >
                    {ingredients.map((ingredient) => (
                      <MenuItem key={ingredient.id} value={ingredient.id}>
                        {ingredient.name} ({ingredient.quantity} {ingredient.unit})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Paper>
        ))}
      </Box>

      {steps.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
          No steps added yet. Click the + button to add one.
        </Typography>
      )}
    </Box>
  );
};
export default StepForm