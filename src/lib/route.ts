export function removeSearchParams(path: string[]) {
  let newPath = `/${path.join('/')}`;
  window.history.replaceState({}, '', newPath);
}

export function replaceSearchParams(path: string[], view: string) {
  let newPath = `/${path.join('/')}`;
  let searchParams = `?v=${view}`;
  let newFullPath = newPath + searchParams;
  window.history.replaceState({}, '', newFullPath);
}
