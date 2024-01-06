export function replacePath(path: string[]) {
  let newPath = `/${path.join('/')}`;
  //console.log(newPath);
  window.history.replaceState({}, '', newPath);
}
