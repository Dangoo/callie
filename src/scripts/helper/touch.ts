export function isTouch(): boolean {
  const mediaString = "(pointer: coarse)";

  return window.matchMedia(mediaString).matches;
}
