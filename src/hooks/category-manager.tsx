import {
  getLsFollowedCategories,
  setLsFollowedCategories,
} from '@/lib/local-storage';
import { Category } from '@/types/twitch';
import { useEffect } from 'react';

/**
 * Hook to provide additional methods to the followed category state
 */
export function useCategoryManager(
  setFollowedCategories: (categories: Category[]) => void
): {
  saveFollowedCategories: (categories: Category[]) => void;
} {
  // get initial followed categories
  useEffect(() => {
    let games = getLsFollowedCategories();
    setFollowedCategories(games);
  }, [setFollowedCategories]);

  // save followed categories to local storage and state
  function saveFollowedCategories(followedCategories: Category[]) {
    setLsFollowedCategories(followedCategories);
    setFollowedCategories(followedCategories);
  }

  return { saveFollowedCategories };
}
