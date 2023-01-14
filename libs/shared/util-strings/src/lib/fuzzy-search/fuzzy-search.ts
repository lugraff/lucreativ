import { SearchElement } from '@shared/util-global';

export function fuzzySearchElements(needles: string, haystack: SearchElement[]): SearchElement[] {
  if (needles.length === 0) {
    return [];
  }

  const result: SearchElement[] = [];
  for (const seachElement of haystack) {
    if (fuzzySearch(needles, seachElement.searchText)) {
      result.push(seachElement);
    }
  }
  return result;
}

export function fuzzySearch(needles: string, haystack: string): boolean {
  if (needles.length === 0) {
    return false;
  }
  const splittedNeedles = needles.split('').filter((char) => char !== ' ');

  let foundcount = 0;
  for (const haystackChar of haystack) {
    if (foundcount >= splittedNeedles.length) {
      return true;
    }
    if (haystackChar.toLowerCase() === splittedNeedles[foundcount].toLowerCase()) {
      foundcount++;
    }
  }
  return foundcount === splittedNeedles.length;
}
