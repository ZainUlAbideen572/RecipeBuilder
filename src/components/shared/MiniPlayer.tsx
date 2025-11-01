import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, IconButton, Typography, Box, CircularProgress } from '@mui/material';
import { PlayArrow, Pause, Stop } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { pauseSession, resumeSession, stopCurrentStep, tickSecond, advanceStep, endSession } from '@/store/sessionSlice';
import { formatTime, calculateStepProgress } from '@/utils/calculations';
import { toast } from 'sonner';

const MiniPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const { activeRecipeId, byRecipeId } = useAppSelector((state) => state.session);
  const recipes = useAppSelector((state) => state.recipes.recipes);
  
  const activeSession = activeRecipeId ? byRecipeId[activeRecipeId] : null;
  const activeRecipe = recipes.find((r) => r.id === activeRecipeId);
  
  const isOnActiveCookPage = activeRecipeId && location.pathname === `/cook/${activeRecipeId}`;

  useEffect(() => {
    if (!activeSession?.isRunning) return;
    
    const interval = setInterval(() => {
      dispatch(tickSecond());
      
      if (activeSession.stepRemainingSec <= 1 && activeRecipe) {
        const nextStepIndex = activeSession.currentStepIndex + 1;
        
        if (nextStepIndex < activeRecipe.steps.length) {
          const nextStep = activeRecipe.steps[nextStepIndex];
          dispatch(advanceStep({ nextStepDurationSec: nextStep.durationMinutes * 60 }));
        } else {
          dispatch(endSession());
          toast.success('Recipe completed!');
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeSession, activeRecipe, dispatch]);

  if (!activeSession || !activeRecipe || isOnActiveCookPage) {
    return null;
  }

  const currentStep = activeRecipe.steps[activeSession.currentStepIndex];
  const { progressPercent } = calculateStepProgress(
    currentStep.durationMinutes * 60,
    activeSession.stepRemainingSec
  );

  const handleTogglePause = () => {
    if (activeSession.isRunning) {
      dispatch(pauseSession());
    } else {
      dispatch(resumeSession());
    }
  };

  const handleStop = () => {
    if (activeSession.currentStepIndex === activeRecipe.steps.length - 1) {
      dispatch(endSession());
      toast.info('Step ended');
    } else {
      dispatch(stopCurrentStep());
      toast.info('Step ended');
    }
  };

  const handleClick = () => {
    navigate(`/cook/${activeRecipeId}`);
  };

  return (
    <Card
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 350,
        p: 2,
        cursor: 'pointer',
        boxShadow: 'var(--shadow-strong)',
        zIndex: 1000,
        background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)',
      }}
      onClick={handleClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <CircularProgress
            variant="determinate"
            value={progressPercent}
            size={56}
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
            }}
          >
            <Typography variant="caption" fontWeight="bold">
              {activeSession.currentStepIndex + 1}/{activeRecipe.steps.length}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight="bold" noWrap>
            {activeRecipe.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {activeSession.isRunning ? 'Running' : 'Paused'} · Step {activeSession.currentStepIndex + 1} of {activeRecipe.steps.length} · {formatTime(activeSession.stepRemainingSec)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
          <IconButton size="small" onClick={handleTogglePause}>
            {activeSession.isRunning ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton size="small" onClick={handleStop}>
            <Stop />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};
export default MiniPlayer