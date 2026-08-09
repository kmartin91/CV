import { footer } from '../data/content';

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        {footer.map((line) => <span key={line}>{line}</span>)}
      </div>
    </footer>
  );
}
