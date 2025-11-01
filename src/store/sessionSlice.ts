import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SessionState } from '@/types/recipe';

const initialState: SessionState = {
  activeRecipeId: null,
  byRecipeId: {},
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<{ recipeId: string; totalSteps: number; stepDurationSec: number; totalDurationSec: number }>) => {
      const { recipeId, stepDurationSec, totalDurationSec } = action.payload;
      state.activeRecipeId = recipeId;
      state.byRecipeId[recipeId] = {
        currentStepIndex: 0,
        isRunning: true,
        stepRemainingSec: stepDurationSec,
        overallRemainingSec: totalDurationSec,
        lastTickTs: Date.now(),
      };
    },
    pauseSession: (state) => {
      if (state.activeRecipeId) {
        const session = state.byRecipeId[state.activeRecipeId];
        if (session) {
          session.isRunning = false;
        }
      }
    },
    resumeSession: (state) => {
      if (state.activeRecipeId) {
        const session = state.byRecipeId[state.activeRecipeId];
        if (session) {
          session.isRunning = true;
          session.lastTickTs = Date.now();
        }
      }
    },
    tickSecond: (state) => {
      if (state.activeRecipeId) {
        const session = state.byRecipeId[state.activeRecipeId];
        if (session && session.isRunning && session.lastTickTs) {
          const now = Date.now();
          const deltaSec = Math.floor((now - session.lastTickTs) / 1000);
          
          if (deltaSec > 0) {
            session.stepRemainingSec = Math.max(0, session.stepRemainingSec - deltaSec);
            session.overallRemainingSec = Math.max(0, session.overallRemainingSec - deltaSec);
            session.lastTickTs = now;
          }
        }
      }
    },
    advanceStep: (state, action: PayloadAction<{ nextStepDurationSec: number }>) => {
      if (state.activeRecipeId) {
        const session = state.byRecipeId[state.activeRecipeId];
        if (session) {
          session.currentStepIndex += 1;
          session.stepRemainingSec = action.payload.nextStepDurationSec;
          session.lastTickTs = Date.now();
        }
      }
    },
    stopCurrentStep: (state) => {
      if (state.activeRecipeId) {
        const session = state.byRecipeId[state.activeRecipeId];
        if (session) {
          session.stepRemainingSec = 0;
        }
      }
    },
    endSession: (state) => {
      if (state.activeRecipeId) {
        delete state.byRecipeId[state.activeRecipeId];
        state.activeRecipeId = null;
      }
    },
  },
});

export const {
  startSession,
  pauseSession,
  resumeSession,
  tickSecond,
  advanceStep,
  stopCurrentStep,
  endSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;
