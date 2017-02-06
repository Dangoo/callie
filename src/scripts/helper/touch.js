export function isTouch() {
  const mediaString = "(pointer: coarse)";

  return window.matchMedia(mediaString).matches;
}
