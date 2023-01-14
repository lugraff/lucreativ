import { SearchElement } from '@shared/util-global';
import { fuzzySearch, fuzzySearchElements } from './fuzzy-search';

describe('fuzzySearchElements', () => {
  it('should return same when needle char is in haystack', () => {
    const haystack: SearchElement[] = [{ searchText: 'a', meta: [] }];
    expect(fuzzySearchElements('a', haystack)).toEqual([{ searchText: 'a', meta: [] }]);
  });
  it('should return same when needle char is in haystack case insensitive', () => {
    const haystack: SearchElement[] = [{ searchText: 'A', meta: [] }];
    expect(fuzzySearchElements('a', haystack)).toEqual([{ searchText: 'A', meta: [] }]);
  });
  it('should return empty when needle empty', () => {
    const haystack: SearchElement[] = [{ searchText: 'A', meta: [] }];
    expect(fuzzySearchElements('', haystack)).toEqual([]);
  });
  it('should return empty when haystack is empty', () => {
    const haystack: SearchElement[] = [{ searchText: '', meta: [] }];
    expect(fuzzySearchElements('a', haystack)).toEqual([]);
  });
  it('should return same with longer text ', () => {
    const haystack: SearchElement[] = [{ searchText: 'aölksjdhlakjnsbabc', meta: [] }];
    expect(fuzzySearchElements('ab', haystack)).toEqual([{ searchText: 'aölksjdhlakjnsbabc', meta: [] }]);
  });
  it('should return same when needle is splitted in correct order', () => {
    const haystack: SearchElement[] = [{ searchText: 'ansbc', meta: [] }];
    expect(fuzzySearchElements('ab', haystack)).toEqual([{ searchText: 'ansbc', meta: [] }]);
  });
  it('should return empty when some chars of needle are missing', () => {
    const haystack: SearchElement[] = [{ searchText: 'MACH DAs nicht richtig ', meta: [] }];
    expect(fuzzySearchElements('aaab', haystack)).toEqual([]);
  });
  it('should return same when all chars of needle are present', () => {
    const haystack: SearchElement[] = [{ searchText: 'MACH DAs nicht falsch Benni', meta: [] }];
    expect(fuzzySearchElements('aaab', haystack)).toEqual([{ searchText: 'MACH DAs nicht falsch Benni', meta: [] }]);
  });
  it('should return same for navigation example', () => {
    const haystack: SearchElement[] = [{ searchText: 'Information@Monitor', meta: [] }];
    expect(fuzzySearchElements('infmon', haystack)).toEqual([{ searchText: 'Information@Monitor', meta: [] }]);
  });
  it('should return empty for navigation example 2', () => {
    const haystack: SearchElement[] = [{ searchText: 'Infos@Programm und Versionsinformationen', meta: [] }];
    expect(fuzzySearchElements('Monitor', haystack)).toEqual([]);
  });
  it('should return same for any whitespace in needles', () => {
    const haystack: SearchElement[] = [{ searchText: 'Monitor', meta: [] }];
    expect(fuzzySearchElements('M o n i  t o   r', haystack)).toEqual([{ searchText: 'Monitor', meta: [] }]);
  });
  it('should return one when needle char is in one haystack of two', () => {
    const haystack: SearchElement[] = [
      { searchText: 'a', meta: [] },
      { searchText: 'b', meta: [] },
    ];
    expect(fuzzySearchElements('a', haystack)).toEqual([{ searchText: 'a', meta: [] }]);
  });
  it('should return empty when needle char is not in any haystack', () => {
    const haystack: SearchElement[] = [
      { searchText: 'abc', meta: [] },
      { searchText: 'def', meta: [] },
      { searchText: 'ghj', meta: [] },
    ];
    expect(fuzzySearchElements('i', haystack)).toEqual([]);
  });
});

describe('fuzzySearch', () => {
  it('should return true when needle char is in haystack', () => {
    expect(fuzzySearch('a', 'a')).toBeTruthy();
  });
  it('should return true when needle char is in haystack case insensitive', () => {
    expect(fuzzySearch('a', 'A')).toBeTruthy();
  });
  it('should return false when needle empty', () => {
    expect(fuzzySearch('', 'A')).toBeFalsy();
  });
  it('should return false when haystack is empty', () => {
    expect(fuzzySearch('a', '')).toBeFalsy();
  });
  it('should return true with longer text ', () => {
    expect(fuzzySearch('ab', 'aölksjdhlakjnsbabc')).toBeTruthy();
  });
  it('should return true when needle is splitted in correct order', () => {
    expect(fuzzySearch('ab', 'ansbc')).toBeTruthy();
  });
  it('should return false when some chars of needle are missing', () => {
    expect(fuzzySearch('aaab', 'MACH DAs nicht richtig ')).toBeFalsy();
  });
  it('should return true when all chars of needle are present', () => {
    expect(fuzzySearch('aaab', 'MACH DAs nicht falsch Benni')).toBeTruthy();
  });
  it('should return true for navigation example', () => {
    expect(fuzzySearch('infmon', 'Information@Monitor')).toBeTruthy();
  });
  it('should return false for navigation example 2', () => {
    expect(fuzzySearch('Monitor', 'Infos@Programm und Versionsinformationen')).toBeFalsy();
  });
  it('should return true for any whitespace in needles', () => {
    expect(fuzzySearch('M o n i  t o   r', 'Monitor')).toBeTruthy();
  });
});
