export function removeSearchParams(path: string[]) {
  let newPath = `/${path.join('/')}`;
  window.history.replaceState({}, '', newPath);
}

export function replaceSearchParams(path: string[], view: string) {
  let searchParams = `?v=${view}`;
  let newPath = `/${path.join('/')}${searchParams}`;
  // TODO: only update if a change happened
  window.history.replaceState({}, '', newPath);
}
