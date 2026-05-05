/** Config for hero sky / forest visuals — keeps classNames stable for existing CSS. */

export const CLOUD_LAYERS = [
  {
    wrapperClass: "animation--pop-in cloud--left clouds",
    srcKey: "cloudLeft",
    dataSrcKey: "cloudLeft2",
    alt: "clouds",
  },
  {
    wrapperClass: "animation--pop-in cloud--left-center clouds",
    srcKey: "cloudLeftCenter",
    dataSrcKey: "cloudLeftCenter2",
    alt: "clouds",
  },
  {
    wrapperClass: "animation--pop-in cloud--right-center clouds",
    srcKey: "cloudRightCenter",
    dataSrcKey: "cloudRightCenter2",
    alt: "clouds",
  },
  {
    wrapperClass: "animation--pop-in cloud--right clouds",
    srcKey: "cloudRight",
    dataSrcKey: "cloudRight2",
    alt: "clouds",
  },
];

/** Back forest row: container modifier + sprite variant (`bird--N`). */
export const SMALL_BIRD_SLOTS = [
  { container: "five", variant: "one" },
  { container: "six", variant: "two" },
  { container: "seven", variant: "three" },
  { container: "eight", variant: "four" },
  { container: "eleven", variant: "two" },
];

export const LARGE_BIRD_SLOTS = [
  { container: "one", variant: "one" },
  { container: "two", variant: "two" },
  { container: "three", variant: "three" },
  { container: "four", variant: "four" },
  { container: "nine", variant: "three" },
];

export const HEADER_TREES = [
  {
    treeClass: "tree tree--left animation--pop-in",
    useLazySwap: true,
    srcKey: "treeCloseUp",
    dataSrcKey: "treeCloseUpLight",
  },
  {
    treeClass: "tree tree--left-blur animation--pop-in",
    useLazySwap: false,
    blurKey: "treeBlurLeft",
  },
  {
    treeClass: "tree tree--right-top animation--pop-in",
    useLazySwap: true,
    srcKey: "treeCloseUp",
    dataSrcKey: "treeCloseUpDark",
  },
  {
    treeClass: "tree tree--right-top-center animation--pop-in",
    useLazySwap: true,
    srcKey: "treeCloseUp",
    dataSrcKey: "treeCloseUpDark",
  },
  {
    treeClass: "tree tree--right-bottom-center animation--pop-in",
    useLazySwap: true,
    srcKey: "treeCloseUp",
    dataSrcKey: "treeCloseUpDark",
  },
  {
    treeClass: "tree tree--right-bottom-blur animation--pop-in",
    useLazySwap: false,
    blurKey: "treeBlurRight",
  },
];
