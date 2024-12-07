import { Category } from '@/types/twitch';

const LS_ACCESS_TOKEN = 'ACCESS_TOKEN';
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

export function getLsToken(): string | null {
  // get from hash
  let hash = getHashValues();
  let token = hash?.access_token;
  if (token) {
    // save token
    localStorage.setItem(LS_ACCESS_TOKEN, token);
    return token;
  }

  // else try get from storage
  token = localStorage.getItem(LS_ACCESS_TOKEN);
  return token;
}

export function clearLsToken(): void {
  localStorage.removeItem(LS_ACCESS_TOKEN);
}

function getHashValues() {
  let hash = document.location.hash.substring(1);
  if (!hash) return undefined;
  var params: any = {};
  hash.split('&').map((hashkey) => {
    let temp = hashkey.split('=');
    params[temp[0]] = temp[1];
  });
  //console.log(params);
  return params;
}
