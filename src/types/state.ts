export enum PlayerLayout {
  Grid = 'grid',
  Vertical = 'vertical',
  Spotlight = 'spotlight',
}

export function isValidLayout(value: string | null | undefined) {
  if (!value) return false;
  return Object.values(PlayerLayout).includes(value as PlayerLayout);
}

export function getPlayerLayout(value: string | null | undefined) {
  if (!isValidLayout(value)) return PlayerLayout.Grid;
  return value as PlayerLayout;
}
