import { Category } from '@/types/twitch';

const LS_FOLLOWED_GAMES = 'FOLLOWED_GAMES';
const SEPARATOR = '___';

export function getLsFollowedGames(): Category[] {
  // try get from storage
  let gamesStr = localStorage.getItem(LS_FOLLOWED_GAMES);
  if (!gamesStr) return [];

  // TODO: parse JSON
  // parse string
  let followedGames: Category[] = [];
  let rows = gamesStr.split('\n');
  for (let r of rows) {
    let game = r.split(SEPARATOR);

    if (game.length != 2) continue;
    let gameId = game[0];

    let gameTitle = game[1];
    followedGames.push({ id: gameId, name: gameTitle, box_art_url: '' });
  }
  console.log('testestest', followedGames);

  return followedGames;
}

export function setLsFollowedGames(games: Category[] | undefined) {
  if (!games) {
    localStorage.removeItem(LS_FOLLOWED_GAMES);
    return;
  }

  // to string
  let followedGamesStr = '';
  for (let i = 0; i < games.length; ++i) {
    if (i > 0) {
      followedGamesStr += '\n';
    }
    let g = games[i];
    let gameStr = g.id + SEPARATOR + g.name;
    followedGamesStr += gameStr;
  }

  // save to local storage
  localStorage.setItem(LS_FOLLOWED_GAMES, followedGamesStr);
}
