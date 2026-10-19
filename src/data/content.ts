import { createContext, useContext } from 'react';
import en from './content.en.json';
import fr from './content.fr.json';

export type Lang = 'en' | 'fr';

export interface Meta {
  lang: Lang;
  locale: string;
  url: string;
  title: string;
  description: string;
  keywords: string;
  social: string;
  imageAlt: string;
}

export interface Ui {
  skip: string;
  loading: string;
  loader: string[];
  home: string;
  sections: string;
  sound: string;
  theme: string;
  switch: { label: string; name: string; lang: Lang; href: string };
  heroLabel: string;
  ctaLab: string;
  ctaContact: string;
  stack: string;
  about: string;
  work: string;
  workHint: string;
  lab: string;
  highlights: string;
  contact: string;
  top: string;
  snakeHint: string;
  snake: { score: string; best: string; quit: string; play: string; over: string };
  ambilight: string;
  cursor: Record<'top' | 'sound' | 'lab' | 'hi' | 'explore' | 'open' | 'visit' | 'write' | 'play' | 'up' | 'lang', string>;
}

export interface NavItem {
  href: string;
  label: string;
}

export interface HeroContent {
  first: string;
  last: string;
  role: string;
  rotator: string[];
  roleEnd: string;
  intro: string;
  location: string;
}

export interface Fact {
  k: string;
  v: string;
}

export interface AboutContent {
  lede: string;
  body: string[];
  facts: Fact[];
}

export interface WorkItem {
  client: string;
  title: string;
  years: string;
  stack: string[];
  href: string;
  shot: string;
  summary: string;
}

export interface WorkContent {
  title: string;
  intro: string;
  items: WorkItem[];
}

export interface LabLink {
  label: string;
  href: string;
}

export interface LabShot {
  src: string;
  alt: string;
  kind: 'phone' | 'wide' | 'square' | 'ambilight';
}

export interface LabItem {
  id: string;
  shape: string;
  num: string;
  name: string;
  aka?: string;
  kind: string;
  year: string;
  status: string;
  live: boolean;
  tagline: string;
  description: string[];
  highlights: string[];
  stack: string[];
  facts: Fact[];
  links: LabLink[];
  shots: LabShot[];
}

export interface LabContent {
  title: string;
  intro: string;
  items: LabItem[];
}

export interface ContactContent {
  title: string[];
  text: string;
  email: string;
  links: LabLink[];
  availability: string;
}

export interface Content {
  meta: Meta;
  ui: Ui;
  nav: NavItem[];
  hero: HeroContent;
  stack: string[][];
  about: AboutContent;
  work: WorkContent;
  lab: LabContent;
  contact: ContactContent;
  footer: string[];
}

// JSON imports widen literal unions to string: the casts are limited to those fields.
const typed = (data: typeof en): Content => ({
  ...data,
  meta: { ...data.meta, lang: data.meta.lang as Lang },
  ui: { ...data.ui, switch: { ...data.ui.switch, lang: data.ui.switch.lang as Lang } },
  lab: data.lab as LabContent,
});

export const content: Record<Lang, Content> = { en: typed(en), fr: typed(fr) };

export const langFromPath = (path: string): Lang => (/^\/?fr(\/|$)/.test(path) ? 'fr' : 'en');

const ContentContext = createContext<Content>(content.en);
export const ContentProvider = ContentContext.Provider;
export const useContent = () => useContext(ContentContext);
