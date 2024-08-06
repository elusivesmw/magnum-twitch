import { Category } from '@/types/twitch';

const LS_FOLLOWED_GAMES = 'FOLLOWED_GAMES';

export function getLsFollowedCategories(): Category[] {
  let followedGames: Category[] = [];
  try {
    // try get from local storage
    let gamesStr = localStorage.getItem(LS_FOLLOWED_GAMES);
    if (!gamesStr) return [];

    // parse json string
    followedGames = JSON.parse(gamesStr);
  } catch {
    console.error('Failed to retrieve categories from local storage');
  }

  return followedGames;
}

export function setLsFollowedCategories(games: Category[] | undefined) {
  try {
    if (!games) {
      localStorage.removeItem(LS_FOLLOWED_GAMES);
      return;
    }

    // to string
    let followedGamesStr = JSON.stringify(games);
    localStorage.setItem(LS_FOLLOWED_GAMES, followedGamesStr);
  } catch {
    console.error('Failed to save categories to local storage');
  }
}
