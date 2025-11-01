import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, IconButton, Chip } from '@mui/material';
import { PlayArrow, Pause, Stop, Star, StarBorder, ArrowBack } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { startSession, pauseSession, resumeSession, stopCurrentStep, tickSecond, advanceStep, endSession } from '@/store/sessionSlice';
import { toggleFavorite } from '@/store/recipeSlice';
import { DifficultyChip } from '@/components/shared';
import { ActiveStepPanel,OverallProgress,StepTimeline } from '@/components/cook';
import { calculateTotalTime } from '@/utils/calculations';
import { toast } from 'sonner';

const CookPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const recipe = useAppSelector((state) =>
    state.recipes.recipes.find((r) => r.id === id)
  );
  const { activeRecipeId, byRecipeId } = useAppSelector((state) => state.session);
  const activeSession = id && byRecipeId[id] ? byRecipeId[id] : null;

  const hasActiveSession = activeRecipeId !== null;
  const isThisRecipeActive = activeRecipeId === id;

  useEffect(() => {
    if (!activeSession?.isRunning) return;

    const interval = setInterval(() => {
      dispatch(tickSecond());

      if (activeSession.stepRemainingSec <= 1 && recipe) {
        const nextStepIndex = activeSession.currentStepIndex + 1;

        if (nextStepIndex < recipe.steps.length) {
          const nextStep = recipe.steps[nextStepIndex];
          dispatch(advanceStep({ nextStepDurationSec: nextStep.durationMinutes * 60 }));
        } else {
          dispatch(endSession());
          toast.success('Recipe completed!');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, recipe, dispatch]);

  if (!recipe) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Recipe not found</Typography>
      </Container>
    );
  }

  const totalTime = calculateTotalTime(recipe.steps);
  const currentStep = activeSession
    ? recipe.steps[activeSession.currentStepIndex]
    : recipe.steps[0];

  const handleStartSession = () => {
    if (hasActiveSession && !isThisRecipeActive) {
      toast.error('Another recipe is already active. Please stop it first.');
      return;
    }

    const totalDurationSec = recipe.steps.reduce(
      (sum, step) => sum + step.durationMinutes * 60,
      0
    );
    const firstStepDurationSec = recipe.steps[0].durationMinutes * 60;

    dispatch(
      startSession({
        recipeId: recipe.id,
        totalSteps: recipe.steps.length,
        stepDurationSec: firstStepDurationSec,
        totalDurationSec,
      })
    );
    toast.success('Cooking session started!');
  };

  const handleTogglePause = () => {
    if (activeSession?.isRunning) {
      dispatch(pauseSession());
      toast.info('Session paused');
    } else {
      dispatch(resumeSession());
      toast.info('Session resumed');
    }
  };

  const handleStop = () => {
    if (!activeSession) return;

    if (activeSession.currentStepIndex === recipe.steps.length - 1) {
      dispatch(endSession());
      toast.info('Step ended');
    } else {
      dispatch(stopCurrentStep());
      toast.info('Step ended');
    }
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(recipe.id));
  };
  // Cooking Page
  return (
    <Box sx={{ minHeight: '100vh', background: 'var(--gradient-hero)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/recipes')}
            sx={{ mb: 2 }}
          >
            Back to Recipes
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {recipe.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <DifficultyChip difficulty={recipe.difficulty} size="medium" />
                <Chip label={`${totalTime} min total`} />
                <Chip label={`${recipe.steps.length} steps`} />
              </Box>
            </Box>
            <IconButton onClick={handleToggleFavorite} sx={{ color: recipe.isFavorite ? 'hsl(var(--accent))' : 'inherit' }}>
              {recipe.isFavorite ? <Star /> : <StarBorder />}
            </IconButton>
          </Box>
        </Box>

        {activeSession && (
          <>
            <ActiveStepPanel
              step={currentStep}
              stepIndex={activeSession.currentStepIndex}
              totalSteps={recipe.steps.length}
              stepRemainingSec={activeSession.stepRemainingSec}
              ingredients={recipe.ingredients}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={activeSession.isRunning ? <Pause /> : <PlayArrow />}
                onClick={handleTogglePause}
                sx={{
                  background: 'var(--gradient-warm)',
                  minWidth: 150,
                }}
              >
                {activeSession.isRunning ? 'Pause' : 'Resume'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Stop />}
                onClick={handleStop}
                color="error"
                sx={{ minWidth: 150 }}
              >
                STOP
              </Button>
            </Box>

            <OverallProgress
              totalDurationSec={recipe.steps.reduce((sum, s) => sum + s.durationMinutes * 60, 0)}
              overallRemainingSec={activeSession.overallRemainingSec}
            />

            <StepTimeline
              steps={recipe.steps}
              currentStepIndex={activeSession.currentStepIndex}
            />
          </>
        )}

        {!activeSession && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" gutterBottom>
              Ready to start cooking?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              This recipe has {recipe.steps.length} steps and will take approximately {totalTime} minutes
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={handleStartSession}
              sx={{
                background: 'var(--gradient-warm)',
                px: 4,
                py: 1.5,
              }}
            >
              Start Session
            </Button>

            <Box sx={{ mt: 6 }}>
              <StepTimeline steps={recipe.steps} currentStepIndex={-1} />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CookPage;
