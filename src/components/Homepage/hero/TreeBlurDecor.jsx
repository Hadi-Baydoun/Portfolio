import { MAIN_IMG } from "./mainAssets";

export function TreeBlurDecor({ blocks }) {
  return (
    <div className="tree-blur-container">
      <div>
        {blocks.map((item, index) => (
          <div key={`${item.srcKey}-${index}`} className="rellax" {...item.rellax}>
            <img className={item.imgClass} src={MAIN_IMG[item.srcKey]} alt={item.alt} />
          </div>
        ))}
      </div>
    </div>
  );
}
