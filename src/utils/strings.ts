export const toTitleCase = (text: string) =>
  text
    .trim()
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

export const getInitials = (text: string) => {
  const words = text.trim().split(' ');

  if (words.length === 1) return words[0][0].toUpperCase();

  return `${words[0][0].toUpperCase()}.${words[1][0].toUpperCase()}.`;
};
