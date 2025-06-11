import { Category } from '@/types/twitch';

const LS_ACCESS_TOKEN = 'ACCESS_TOKEN';
const LS_FOLLOWED_GAMES = 'FOLLOWED_GAMES';
const LS_LAYOUT_ORDER = 'LAYOUT_ORDER';

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

export function getLsLayoutOrder(): string[] {
  let layoutOrder: string[] = [];
  try {
    // try get from local storage
    let layoutOrderStr = localStorage.getItem(LS_FOLLOWED_GAMES);
    if (!layoutOrderStr) return [];

    // parse json string
    layoutOrder = JSON.parse(layoutOrderStr);
  } catch {
    console.error('Failed to retrieve layout order from local storage');
  }

  return layoutOrder;
}

export function setLsLayoutOrder(layoutOrder: string[] | undefined) {
  try {
    if (!layoutOrder) {
      localStorage.removeItem(LS_LAYOUT_ORDER);
      return;
    }

    // to string
    let layoutOrderStr = JSON.stringify(layoutOrder);
    localStorage.setItem(LS_LAYOUT_ORDER, layoutOrderStr);
  } catch {
    console.error('Failed to save layout order to local storage');
  }
}
