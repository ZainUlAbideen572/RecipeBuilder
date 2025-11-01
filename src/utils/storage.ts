import { Recipe } from '@/types/recipe';

const STORAGE_KEY = 'recipes:v1';

const loadRecipes = (): Recipe[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const recipes = JSON.parse(data);
    return Array.isArray(recipes) ? recipes : [];
  } catch (error) {
    console.error('Failed to load recipes:', error);
    return [];
  }
};

const saveRecipes = (recipes: Recipe[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Failed to save recipes:', error);
  }
};

export {
    loadRecipes,
    saveRecipes
}
