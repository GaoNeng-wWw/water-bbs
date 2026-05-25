export function fallbackText(userName: string) {
  if (!userName) {
    return '';
  }
  const cleanName = userName.trim().replace(/\s+/g, '');
  if (!cleanName) {
    return '';
  }
  const hasChinese = (text: string) => /[\u4e00-\u9fa5]/.test(text);
  if (hasChinese(cleanName)) {
    const pureChinese = cleanName.replace(/[^\u4e00-\u9fa5]/g, '');
    if (pureChinese.length) {
      return pureChinese.slice(-2);
    }
  }
  const words = cleanName.split(' ');
  if (words.length > 1) {
    const first = words[0].charAt(0);
    const second = words[words.length - 1].charAt(0);
    return `${first}${second}`.toUpperCase();
  }
  const word = cleanName.replace(/^[^a-zA-Z0-9\u4e00-\u9fa5]+/, '');
  if (word.length) {
    return word.slice(0, 2).toUpperCase();
  }
  return '';
}
