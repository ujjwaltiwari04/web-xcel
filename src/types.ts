export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  basePrice: string;
  details: string[];
  conversionBoost: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'web' | 'crm' | 'ai' | 'outreach' | 'media';
  description: string;
  results: string;
  techStack: string[];
  mockupDetails?: {
    stats?: { label: string; value: string }[];
    uiType?: 'crm-board' | 'landing-page' | 'audio-wave' | 'chatbot';
  };
}

export interface PricingPlan {
  name: string;
  price: string;
  originalPrice: string;
  description: string;
  features: string[];
  popular: boolean;
  ctaText: string;
  targetBusiness: string;
}
