/** Same pattern as original: vanilla-lazyload promotes data-src → src when in view. */
export function LazySwapImage({ alt, className = "lazy", src, dataSrc, ...rest }) {
  return <img {...rest} alt={alt} className={className} src={src} data-src={dataSrc ?? src} />;
}
