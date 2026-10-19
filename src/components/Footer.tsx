import { useContent } from '../data/content';

export default function Footer() {
  const { footer, ui } = useContent();
  return (
    <footer className="footer">
      {footer.map((line) => <span key={line}>{line}</span>)}
      <button className="footer-snake" type="button" data-snake="start" data-cursor={ui.cursor.play}>{ui.snakeHint}</button>
      <a className="magnetic" href="#top" data-cursor={ui.cursor.up}>{ui.top}</a>
    </footer>
  );
}
