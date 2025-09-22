// Catppuccin Mocha pastel palette for tags
export const tagColorPalette = [
  '#f5e0dc', '#f2cdcd', '#f5c2e7', '#cba6f7', '#f38ba8', '#eba0ac', '#fab387', '#f9e2af', '#a6e3a1', '#94e2d5',
  '#89dceb', '#74c7ec', '#89b4fa', '#b4befe', '#cdd6f4', '#bac2de', '#a6adc8', '#9399b2', '#7f849c', '#6c7086',
  '#f5c2e7', '#cba6f7', '#f38ba8', '#eba0ac', '#fab387', '#f9e2af', '#a6e3a1', '#94e2d5', '#89dceb', '#74c7ec'
];

export interface TagColors {
  backgroundColor: string;
  color: string;
}

export const getTagColors = (tag: string, tagColorMap: Record<string, number>): TagColors => {
  // Use the persistent tag color mapping
  const paletteIndex = tagColorMap[tag] || 0;
  const backgroundColor = tagColorPalette[paletteIndex % tagColorPalette.length]!;

  // Calculate luminance to determine text color
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return {
    backgroundColor,
    color: luminance > 0.5 ? '#1e1e2e' : '#cdd6f4' // Dark text on light bg, light text on dark bg
  };
};

export const colorForTag = (tag: string, tagColorMap: Record<string, number>): string => getTagColors(tag, tagColorMap).backgroundColor;