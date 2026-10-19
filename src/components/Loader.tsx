import { useContent } from '../data/content';

export default function Loader() {
  const { ui } = useContent();
  const [name, year, warm] = ui.loader;
  return (
    <div className="loader" role="status" aria-label={ui.loading}>
      <div className="loader-top">
        <span className="loader-line"><span className="loader-word">{name}</span></span>
        <span className="loader-line"><span className="loader-word">{year}</span></span>
      </div>
      <div className="loader-num">000</div>
      <div className="loader-bottom">
        <span className="loader-line"><span className="loader-word">{warm}</span></span>
      </div>
    </div>
  );
}
