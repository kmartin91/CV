interface LinkInterface {
  icon: string
  url: string
  name: string
}

interface LevelInterface {
  level: string
}

interface AvatarInterface {
  alt: string
}

interface FormationInterface {
  nom: string
  dateDebut: string
  dateFin: string
  description: string
}

interface ExperienceInterface {
  entreprise: string
  dateDebut: string
  dateFin: string
  intitule: string
  description: string
  technologies: string
}

interface CompetenceInterface {
  name: string
  value: string
}

interface CompetencesInterface {
  label: string
  values: Array<{ value: string; name: string }>
}

interface ReferenceInterface {
  name: string
  job: string
}

interface LayoutInterface {
  children: React.ReactNode
}

interface SEOProps {
  description?: string
  lang?: string
  meta?: Array<{ name: string; content: string }>
  title: string
  keywords?: Array<string>
}
