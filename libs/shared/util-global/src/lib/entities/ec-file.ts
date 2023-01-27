export interface ECFile {
  id: string;
  name: string;
  category: string;
  created: number;
  edited: number;
  text: string;
  data?: any[];
}

const emptyECF_REF: ECFile = {
  id: '',
  name: '',
  category: '',
  created: 0,
  edited: 0,
  text: '',
};
export const emptyECF: ECFile = JSON.parse(JSON.stringify(emptyECF_REF));
