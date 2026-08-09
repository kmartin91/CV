import { hydrateRoot } from 'react-dom/client';
import App from './App';
import './style.css';

document.documentElement.classList.add('is-ready');
hydrateRoot(document.getElementById('root') as HTMLElement, <App />);
