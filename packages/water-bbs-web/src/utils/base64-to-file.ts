export const base64ToFile = (base64: string, name?: string) => fetch(base64)
  .then(resp => resp.blob())
  .then(blob => new File([blob], name || 'image.png', { type: 'image/png' }));
