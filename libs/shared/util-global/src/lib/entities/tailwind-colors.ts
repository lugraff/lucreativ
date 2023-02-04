interface TailwindColor {
  name: string;
  hexCode: string;
}

interface TailwindColors {
  colors: TailwindColor[];
}

const tailwindColors: TailwindColors = {
  colors: [
    { name: 'textA', hexCode: '#ffffff' },
    { name: 'textB', hexCode: '#000000' },
    { name: 'warning', hexCode: '#A3C832' },
    { name: 'danger', hexCode: '#b2828c' },
    { name: 'primary', hexCode: '#8cb282' },
    { name: 'secondary', hexCode: '#E5E6E7' },
    { name: 'tertiary', hexCode: '#CBCCD0' },
    { name: 'selection', hexCode: '#828cb2' },
    { name: 'bgD', hexCode: '#001020' },
    { name: 'bgC', hexCode: '#002030' },
    { name: 'bgB', hexCode: '#205060' },
    { name: 'bgA', hexCode: '#303442' },
    { name: 'subtle', hexCode: '#646464' },
  ],
};

export function getTailwindColorHexCode(colorName: string) {
  if (colorName.startsWith('#')) {
    return colorName;
  } else {
    for (const color of tailwindColors.colors) {
      if (color.name === colorName) {
        return color.hexCode;
      }
    }
  }
  return '#ffffff';
}
