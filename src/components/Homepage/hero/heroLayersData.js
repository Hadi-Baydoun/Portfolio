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

export const HERO_RELLAX_TREE = {
  wrapperClass: "rellax tree--left-blur",
  attrs: {
    "data-rellax-percentage": "0.5",
    "data-rellax-xs-speed": "0.8",
    "data-rellax-mobile-speed": "1",
    "data-rellax-tablet-speed": "2",
    "data-rellax-desktop-speed": "4",
  },
  imgClass: "lazy",
  srcKey: "treeBlurLeft",
  alt: "a close up blur tree of the forest",
};

export const HERO_RELLAX_RIGHT = {
  wrapperClass: "rellax tree tree--bottom-blur",
  attrs: {
    "data-rellax-percentage": "0.5",
    "data-rellax-xs-speed": "1.2",
    "data-rellax-mobile-speed": "3",
    "data-rellax-tablet-speed": "4",
    "data-rellax-desktop-speed": "5",
  },
  imgClass: "lazy",
  srcKey: "treeBlurRight",
  alt: "a close up blur tree of the forest",
};

/** Order matters: sandwiched between linear “design” and “development” rows in the page flow. */
export const TREE_BLUR_DECOR_AFTER_DESIGN = [
  {
    rellax: { "data-rellax-speed": "1", "data-rellax-percentage": "0.5" },
    imgClass: "tree tree--right lazy",
    srcKey: "treeRight",
    alt: "closed up tree of the forest",
  },
  {
    rellax: { "data-rellax-speed": "2", "data-rellax-percentage": "0.5" },
    imgClass: "tree tree--right tree--blur lazy",
    srcKey: "treeBlurRight",
    alt: "closed up blur tree of forest",
  },
];

export const TREE_BLUR_DECOR_FINAL = [
  {
    rellax: { "data-rellax-speed": "2", "data-rellax-percentage": "0.5" },
    imgClass: "tree tree--left tree--blur lazy",
    srcKey: "treeBlurLeft",
    alt: "closed up blur tree of forest",
  },
];
