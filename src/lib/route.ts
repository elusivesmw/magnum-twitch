import { isValidLayout } from '@/types/state';

export function replacePath(path: string[]) {
  let newPath = `/${path.join('/')}`;
  //console.log(newPath);
  window.history.replaceState({}, '', newPath);
}

export function replaceSearchParams(path: string[], layout: string) {
  let searchParams = `?layout=${layout}`;

  let newPath = `/${path.join('/')}${searchParams}`;
  console.log(newPath);
  window.history.replaceState({}, '', newPath);
}
