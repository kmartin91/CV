import { useEffect, useRef } from 'react';
import { initPortfolio } from './lib/motion';
import Loader from './components/Loader';
import Topbar from './components/Topbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Work from './components/Work';
import Lab from './components/Lab';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ContentProvider, content } from './data/content';
import type { Lang } from './data/content';

export default function App({ lang }: { lang: Lang }) {
  const c = content[lang];
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    return initPortfolio(root);
  }, []);

  return (
    <ContentProvider value={c}>
      <div className="portfolio" ref={rootRef}>
        <a className="skip" href="#main">{c.ui.skip}</a>
        <canvas className="field" aria-hidden="true"></canvas>
        <div className="grain" aria-hidden="true"></div>
        <div className="cursor" aria-hidden="true"><span className="cursor-label"></span></div>
        <div className="scroll-progress" aria-hidden="true"></div>
        <Loader />
        <Topbar />
        <main id="main">
          <Hero />
          <Marquee />
          <About />
          <Work />
          <Lab />
          <Contact />
        </main>
        <Footer />
        <div className="snake-hud" role="status" hidden data-play={c.ui.snake.play} data-over={c.ui.snake.over}>
          <span className="snake-title">Snake</span>
          <span>{c.ui.snake.score} <b className="snake-score">0</b></span>
          <span>{c.ui.snake.best} <b className="snake-best">0</b></span>
          <span className="snake-msg"></span>
          <button className="snake-quit" type="button" data-snake="stop">{c.ui.snake.quit}</button>
        </div>
      </div>
    </ContentProvider>
  );
}
