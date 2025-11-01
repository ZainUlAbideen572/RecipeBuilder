import { Recipe, Difficulty, RecipeStep } from '@/types/recipe';

const DIFFICULTY_BASE = { Easy: 1, Medium: 2, Hard: 3 };

export const calculateTotalTime = (steps: RecipeStep[]): number => {
  return steps.reduce((sum, step) => sum + step.durationMinutes, 0);
};

export const calculateComplexityScore = (difficulty: Difficulty, steps: RecipeStep[]): number => {
  return DIFFICULTY_BASE[difficulty] * steps.length;
};

export const calculateDerivedFields = (recipe: Omit<Recipe, 'createdAt' | 'updatedAt'>) => {
  const totalTimeMinutes = calculateTotalTime(recipe.steps);
  const totalIngredients = recipe.ingredients.length;
  const complexityScore = calculateComplexityScore(recipe.difficulty, recipe.steps);
  
  return {
    totalTimeMinutes,
    totalIngredients,
    complexityScore,
  };
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const calculateStepProgress = (
  stepDurationSec: number,
  stepRemainingSec: number
): { elapsedSec: number; progressPercent: number } => {
  const elapsedSec = Math.max(0, stepDurationSec - stepRemainingSec);
  const progressPercent = Math.round((elapsedSec / stepDurationSec) * 100);
  return { elapsedSec, progressPercent };
};

export const calculateOverallProgress = (
  totalDurationSec: number,
  overallRemainingSec: number
): { elapsedSec: number; progressPercent: number } => {
  const elapsedSec = totalDurationSec - overallRemainingSec;
  const progressPercent = Math.round((elapsedSec / totalDurationSec) * 100);
  return { elapsedSec, progressPercent };
};
