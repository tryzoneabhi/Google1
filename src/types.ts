export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  link: string;
  plan?: string;
}

export interface Service {
  id: number;
  name: string;
  price: string;
  features: string;
  tier: string;
}

export interface Setting {
  key: string;
  value: string;
}

export interface AppData {
  settings: Setting[];
  projects: Project[];
  services: Service[];
}
