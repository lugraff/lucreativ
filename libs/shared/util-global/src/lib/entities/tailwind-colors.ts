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
    { name: 'warning', hexCode: '#ffcc00' },
    { name: 'danger', hexCode: '#f54b4c' },
    { name: 'primaryH', hexCode: '#9de04b' },
    { name: 'primaryK', hexCode: '#ec7100' },
    { name: 'primaryW', hexCode: '#8adafe' },
    { name: 'primary', hexCode: '#9de04b' },
    { name: 'secondary', hexCode: '#d9d9d9' },
    { name: 'tertiary', hexCode: '#b4b4b4' },
    { name: 'selection', hexCode: '#37473a' },
    { name: 'bgB', hexCode: '#2b3738' },
    { name: 'bgA', hexCode: '#222c2d' },
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
