import { hydrateRoot } from 'react-dom/client';
import App from './App';

document.documentElement.classList.add('is-ready');
hydrateRoot(document.getElementById('root') as HTMLElement, <App lang={document.documentElement.lang === 'fr' ? 'fr' : 'en'} />);
