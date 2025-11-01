import { Box, Typography, Paper, Chip } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { RecipeStep } from '@/types/recipe';

interface StepTimelineProps {
  steps: RecipeStep[];
  currentStepIndex: number;
}

const StepTimeline = ({ steps, currentStepIndex }: StepTimelineProps) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Timeline
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {steps.map((step, index) => {
          const status =
            index < currentStepIndex
              ? 'completed'
              : index === currentStepIndex
              ? 'current'
              : 'upcoming';

          return (
            <Box
              key={step.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                opacity: status === 'upcoming' ? 0.6 : 1,
              }}
            >
              {status === 'completed' ? (
                <CheckCircle sx={{ color: 'hsl(var(--success))' }} />
              ) : (
                <RadioButtonUnchecked
                  sx={{
                    color:
                      status === 'current'
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--muted-foreground))',
                  }}
                />
              )}

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={status === 'current' ? 'bold' : 'normal'}
                  noWrap
                >
                  {step.description}
                </Typography>
              </Box>

              <Chip
                label={`${step.durationMinutes} min`}
                size="small"
                sx={{
                  bgcolor:
                    status === 'current'
                      ? 'hsl(var(--primary) / 0.1)'
                      : 'transparent',
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};
export default StepTimeline
