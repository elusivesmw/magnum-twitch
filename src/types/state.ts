export enum PlayerView {
  Grid = 'grid',
  Vertical = 'vertical',
  Spotlight = 'spotlight',
}

export function isValidView(value: string | null | undefined) {
  if (!value) return false;
  return Object.values(PlayerView).includes(value as PlayerView);
}

export function getPlayerView(value: string | null | undefined) {
  if (!isValidView(value)) return PlayerView.Grid;
  return value as PlayerView;
}
