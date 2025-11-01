import { Box, Typography, CircularProgress, Chip } from '@mui/material';
import { Thermostat, Speed, Restaurant } from '@mui/icons-material';
import { RecipeStep, Ingredient } from '@/types/recipe';
import { formatTime, calculateStepProgress } from '@/utils/calculations';

interface ActiveStepPanelProps {
  step: RecipeStep;
  stepIndex: number;
  totalSteps: number;
  stepRemainingSec: number;
  ingredients: Ingredient[];
}

const ActiveStepPanel = ({
  step,
  stepIndex,
  totalSteps,
  stepRemainingSec,
  ingredients,
}: ActiveStepPanelProps) => {
  const { progressPercent } = calculateStepProgress(
    step.durationMinutes * 60,
    stepRemainingSec
  );

  const stepIngredients = step.ingredientIds
    ? ingredients.filter((i) => step.ingredientIds!.includes(i.id))
    : [];

  return (
    <Box
      sx={{
        p: 4,
        background: 'var(--gradient-hero)',
        borderRadius: 'var(--radius)',
        mb: 3,
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Step {stepIndex + 1} of {totalSteps}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 3 }}>
        <Box sx={{ position: 'relative' }}>
          <CircularProgress
            variant="determinate"
            value={progressPercent}
            size={120}
            thickness={4}
            sx={{
              color: 'hsl(var(--primary))',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {formatTime(stepRemainingSec)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              remaining
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" paragraph>
            {step.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {step.type === 'cooking' && step.cookingSettings && (
              <>
                <Chip
                  icon={<Thermostat />}
                  label={`${step.cookingSettings.temperature}°C`}
                  color="primary"
                />
                <Chip
                  icon={<Speed />}
                  label={`Speed ${step.cookingSettings.speed}`}
                  color="primary"
                />
              </>
            )}

            {step.type === 'instruction' && stepIngredients.length > 0 && (
              <>
                {stepIngredients.map((ingredient) => (
                  <Chip
                    key={ingredient.id}
                    icon={<Restaurant />}
                    label={`${ingredient.name} (${ingredient.quantity} ${ingredient.unit})`}
                    color="secondary"
                  />
                ))}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default ActiveStepPanel
