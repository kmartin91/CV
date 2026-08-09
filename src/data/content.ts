import data from './content.json';

export interface NavItem {
  href: string;
  label: string;
}

export interface HeroContent {
  kicker: string;
  rotator: string[];
  sub: string;
}

export type LedePart = string | { em: string };

export interface AboutStat {
  k: string;
  warm: string;
  v: string;
}

export interface AboutContent {
  lede: LedePart[];
  body: string[];
  stats: AboutStat[];
}

export interface SkillItem {
  i: string;
  label: string;
}

export interface Project {
  num: string;
  title: string;
  meta: string[];
  href: string;
  img: string;
  thumb: string;
  shot?: string;
}

export interface LabItem {
  idx: string;
  tag: string;
  state: string;
  soon: boolean;
  title: string;
  teaser: string;
  tech: string[];
  link: string;
  linkLabel: string;
  desc: string;
}

export interface LabContent {
  intro: string;
  items: LabItem[];
}

export interface ContactLink {
  href: string;
  label: string;
}

export interface ContactContent {
  email: string;
  links: ContactLink[];
  availability: string;
}

export const nav: NavItem[] = data.nav;
export const hero: HeroContent = data.hero;
export const about: AboutContent = data.about;
export const skills: SkillItem[][] = data.skills;
export const projects: Project[] = data.projects;
export const lab: LabContent = data.lab;
export const contact: ContactContent = data.contact;
export const footer: string[] = data.footer;
