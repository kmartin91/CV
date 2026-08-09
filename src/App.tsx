import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { initPortfolio } from './lib/animations';
import { Cursor } from './components/Overlays';
import Loader from './components/Loader';
import Topbar from './components/Topbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Lab from './components/Lab';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Modal from './components/Modal';
import type { LabItem } from './data/content';

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<LabItem | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    return initPortfolio(root);
  }, []);

  return (
    <div
      className="portfolio"
      ref={rootRef}
      style={{ container: 'portfolio / inline-size' } as CSSProperties}
    >
      <Cursor />
      <Loader />
      <Topbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Lab onOpen={setActive} />
        <Contact />
      </main>
      <Modal item={active} onClose={() => setActive(null)} />
      <Footer />
    </div>
  );
}
