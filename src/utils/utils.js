export const isTouchDevice = () => {
  const prefixes = ["", "-webkit-", "-moz-", "-o-", "-ms-", ""];
  const mq = (query) => window.matchMedia(query).matches;

  if (
    "ontouchstart" in window ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true;
  }

  return mq(["(", prefixes.join("touch-enabled),("), ")"].join(""));
};
