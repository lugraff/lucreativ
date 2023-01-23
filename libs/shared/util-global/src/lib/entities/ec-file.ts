export interface ECFile {
  id: string;
  name: string;
  category: string;
  timestamp: number;
  data: string;
}

export const emptyECF: ECFile = {
  id: '???',
  name: '@unnamed',
  category: 'default',
  timestamp: 0,
  data: '',
};
