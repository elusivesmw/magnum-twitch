import { FollowedGame } from '@/types/twitch';

const LS_FOLLOWED_GAMES = 'FOLLOWED_GAMES';
const SEPARATOR = '___';

export function getLsFollowedGames(): FollowedGame[] {
  // try get from storage
  let gamesStr = localStorage.getItem(LS_FOLLOWED_GAMES);
  if (!gamesStr) return [];

  // parse string
  let followedGames: FollowedGame[] = [];
  let rows = gamesStr.split('\n');
  for (let r of rows) {
    let game = r.split(SEPARATOR);

    if (game.length != 2) continue;
    let gameId = Number.parseInt(game[0]);
    if (Number.isNaN(gameId)) continue;

    let gameTitle = game[1];
    followedGames.push({ game_id: gameId, game_title: gameTitle });
  }
  console.log('testestest', followedGames);

  return followedGames;
}

export function setLsFollowedGames(games: FollowedGame[] | undefined) {
  // test
  games = [
    { game_id: 1229, game_title: 'Super Mario World' },
    { game_id: 505705, game_title: 'Noita' },
  ];

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
    let gameStr = g.game_id + SEPARATOR + g.game_title;
    followedGamesStr += gameStr;
  }

  // save to local storage
  localStorage.setItem(LS_FOLLOWED_GAMES, followedGamesStr);
}
