import { 
  FolderRoot, 
  Zap, 
  Target, 
  Compass, 
  CalendarRange, 
  Inbox, 
  Network, 
  AlarmClock, 
  GitGraph, 
  BarChart3,
  Ship,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Layout,
  Shield,
  DollarSign,
  Scale,
  Users
} from 'lucide-react';

export const FRAMEWORKS = [
  { 
    id: 'ikigai', 
    label: 'Ikigai', 
    icon: Target, 
    description: 'Meaning & 4 Pillars',
    subItems: [
      'Passion', 'Vocation', 'Mission', 'Profession',
      'SEP:Horizons (Vision)', 
      'H1 Observer', 'H3 Explorer', 'H10 Guardian', 'H30 Multi-Horizon', 'H90 Cycle Keeper'
    ]
  },
  { 
    id: 'life-wheel', 
    label: 'Life Wheel', 
    icon: Compass, 
    description: 'Balance & Observation',
    subItems: [
      'Carrière', 'Finance', 'Santé', 'Croissance', 'Relation', 'Famille', 'Loisir', 'Environnement'
    ]
  },
  { 
    id: '12wy', 
    label: '12WY', 
    icon: CalendarRange, 
    description: '12 Week Year Execution',
    subItems: ['Vision', 'Planning', 'Process Control', 'Measurement', 'Time Use']
  },
  { 
    id: 'para', 
    label: 'PARA', 
    icon: FolderRoot, 
    description: 'Projects, Areas, Resources, Archive',
    subItems: ['Projects', 'Areas', 'Resources', 'Archive']
  },
  { 
    id: 'gtd', 
    label: 'GTD', 
    icon: Inbox, 
    description: 'Getting Things Done',
    subItems: ['Capture', 'Clarify', 'Organize', 'Reflect', 'Engage']
  },
  { 
    id: 'deal', 
    label: 'DEAL', 
    icon: Zap, 
    description: 'Automation & Liberation',
    subItems: ['Definition', 'Elimination', 'Automation', 'Liberation']
  },
];

export const PEPITES = [
  { id: 'crons', label: 'Cron Registry', icon: AlarmClock },
  { id: 'skills', label: 'Skill Tree', icon: GitGraph },
  { id: 'scorecard', label: 'Scorecard', icon: BarChart3 },
];

export const SIDEBAR_FOOTER = [
  { id: 'relation', label: 'Relation Diagram', icon: Network },
];

export interface Agent {
  name: string;
  role: string;
  status: 'Active' | 'Idle' | 'Busy';
}

export interface ArmadaFolder {
  id: string;
  label: string;
  icon: any;
  status: 'Active' | 'Idle' | 'Busy';
  agents: Agent[];
}

export const ARMADA_FOLDERS: ArmadaFolder[] = [
  {
    id: 'a0',
    label: 'A0 Amadeus',
    icon: Eye,
    status: 'Active',
    agents: [
      { name: 'Beth', role: 'Conscience / Veto Agent (A1)', status: 'Active' },
      { name: 'Morty', role: 'Execution / Dispatch Agent (A1)', status: 'Active' }
    ]
  },
  {
    id: 'beth-a1',
    label: 'A1 Beth',
    icon: ShieldCheck,
    status: 'Active',
    agents: [
      { name: 'IA', role: 'Orville Board AI (A2)', status: 'Idle' },
      { name: 'Zora', role: 'Discovery Board AI (A2)', status: 'Active' }
    ]
  },
  {
    id: 'morty-a1',
    label: 'A1 Morty',
    icon: ShieldAlert,
    status: 'Active',
    agents: [
      { name: 'Ordinateur', role: 'SNW Board AI (A2)', status: 'Idle' },
      { name: 'Computer', role: 'Enterprise Board AI (A2)', status: 'Active' },
      { name: 'Holodeck', role: 'Cerritos Board AI (A2)', status: 'Idle' },
      { name: 'Holo Janeway', role: 'Protostar Board AI (A2)', status: 'Idle' }
    ]
  },
  {
    id: 'orville-a2',
    label: 'A2 Orville',
    icon: Ship,
    status: 'Idle',
    agents: [
      { name: 'Ed Mercer', role: 'Captain / Craft', status: 'Idle' },
      { name: 'Kelly Grayson', role: 'Mission Control', status: 'Idle' },
      { name: 'Gordon Malloy', role: 'Passion Driver', status: 'Idle' },
      { name: 'Claire Finn', role: 'Vocation Guide', status: 'Active' },
      { name: 'Isaac', role: 'H1 Horizon Observer', status: 'Active' },
      { name: 'John Lamarr', role: 'H3 Horizon Explorer', status: 'Idle' },
      { name: 'Bortus', role: 'H10 Horizon Guardian', status: 'Idle' },
      { name: 'Alara Kitan', role: 'H30 Multi-Horizon', status: 'Idle' },
      { name: 'Klyden', role: 'H90 Cycle Keeper', status: 'Idle' }
    ]
  },
  {
    id: 'discovery-a2',
    label: 'A2 Discovery',
    icon: Ship,
    status: 'Active',
    agents: [
      { name: 'Book', role: 'LD01 — Business Sector (Biz)', status: 'Active' },
      { name: 'Saru', role: 'LD02 — Finance Sector (Balance)', status: 'Active' },
      { name: 'Culber', role: 'LD03 — Health Sector (Hospital)', status: 'Active' },
      { name: 'Tilly', role: 'LD04 — Growth Sector (Mind)', status: 'Active' },
      { name: 'Stamets', role: 'LD05 — Social Sector (Network)', status: 'Active' },
      { name: 'Burnham', role: 'LD06 — Family Sector (DEAL)', status: 'Active' },
      { name: 'Reno', role: 'LD07 — Play Sector (Maintenance)', status: 'Active' },
      { name: 'Georgiou', role: 'LD08 — Impact Sector (Moat)', status: 'Active' }
    ]
  },
  {
    id: 'snw-a2',
    label: 'A2 SNW',
    icon: Ship,
    status: 'Idle',
    agents: [
      { name: 'Christopher Pike', role: 'Visionary Captain', status: 'Idle' },
      { name: 'Una Chin-Riley', role: 'Weekly Execution', status: 'Idle' },
      { name: 'M\'Benga', role: 'Focus Specialist', status: 'Idle' },
      { name: 'Christine Chapel', role: 'Measure Sentinel', status: 'Idle' },
      { name: 'Nyota Uhura', role: 'Protocol Comms', status: 'Active' }
    ]
  },
  {
    id: 'enterprise-a2',
    label: 'A2 Enterprise',
    icon: Ship,
    status: 'Active',
    agents: [
      { name: 'Jean-Luc Picard', role: 'Project Sovereign', status: 'Active' },
      { name: 'Spock', role: 'Area Architect', status: 'Active' },
      { name: 'Geordi La Forge', role: 'Resource Engineer', status: 'Active' },
      { name: 'Data', role: 'Archive Intelligence', status: 'Active' }
    ]
  },
  {
    id: 'cerritos-a2',
    label: 'A2 Cerritos',
    icon: Ship,
    status: 'Idle',
    agents: [
      { name: 'Beckett Mariner', role: 'Capture Specialist', status: 'Idle' },
      { name: 'Brad Boimler', role: 'Clarification Officer', status: 'Idle' },
      { name: 'D\'Vana Tendi', role: 'Organization Expert', status: 'Idle' },
      { name: 'Sam Rutherford', role: 'Reflection Engineer', status: 'Idle' },
      { name: 'Carol Freeman', role: 'Engagement Captain', status: 'Idle' }
    ]
  },
  {
    id: 'protostar-a2',
    label: 'A2 Protostar',
    icon: Ship,
    status: 'Idle',
    agents: [
      { name: 'Dal R\'El', role: 'Definition Pilot', status: 'Idle' },
      { name: 'Rok-Tahk', role: 'Elimination Specialist', status: 'Idle' },
      { name: 'Zero', role: 'Automation Unit', status: 'Active' },
      { name: 'Gwyn', role: 'Liberation Guide', status: 'Idle' }
    ]
  }
];

export interface Skill {
  name: string;
  mastery: number; // 0 to 100
  description: string;
}

export interface SkillSector {
  id: string;
  label: string;
  icon: any;
  color: string;
  agent: string;
  skills: Skill[];
}

export const SKILLS_DATA: SkillSector[] = [
  {
    id: 'it',
    label: 'IT Sector',
    icon: Cpu,
    color: '#8b5cf6', // Violet
    agent: 'Kang',
    skills: [
      { name: 'React', mastery: 95, description: 'Component architecture & Hooks' },
      { name: 'TypeScript', mastery: 90, description: 'Type safety & Advanced patterns' },
      { name: 'Docker', mastery: 75, description: 'Containerization & Orchestration' },
      { name: 'Gemini API', mastery: 85, description: 'Model integration & Prompt engineering' },
      { name: 'Next.js', mastery: 80, description: 'SSR & App Router' }
    ]
  },
  {
    id: 'product',
    label: 'Product Sector',
    icon: Layout,
    color: '#ef4444', // Red
    agent: 'Captain America',
    skills: [
      { name: 'PRD Design', mastery: 85, description: 'Product Requirements Document' },
      { name: 'QA Testing', mastery: 70, description: 'Quality Assurance & Coverage' },
      { name: 'User Stories', mastery: 90, description: 'User-centric feature mapping' },
      { name: 'Market Research', mastery: 65, description: 'Competitive analysis' }
    ]
  },
  {
    id: 'ops',
    label: 'Ops Sector',
    icon: Shield,
    color: '#3b82f6', // Blue
    agent: 'Mr. Fantastic',
    skills: [
      { name: 'PARA System', mastery: 100, description: 'Universal organization' },
      { name: 'GTD Workflow', mastery: 95, description: 'Task capture & processing' },
      { name: 'ADR Architecture', mastery: 80, description: 'Decision records & Docs' },
      { name: 'Stability', mastery: 85, description: 'System resilience' }
    ]
  },
  {
    id: 'growth',
    label: 'Growth Sector',
    icon: Zap,
    color: '#f59e0b', // Amber
    agent: 'Star-Lord',
    skills: [
      { name: 'Ads Management', mastery: 60, description: 'Campaign performance' },
      { name: 'Copywriting', mastery: 80, description: 'Persuasive writing' },
      { name: 'Funnel Logic', mastery: 75, description: 'Conversion optimization' },
      { name: 'Branding', mastery: 70, description: 'Identity alignment' }
    ]
  },
  {
    id: 'finance',
    label: 'Finance Sector',
    icon: DollarSign,
    color: '#10b981', // Emerald
    agent: 'Wonder Woman',
    skills: [
      { name: 'Budgeting', mastery: 80, description: 'Resource allocation' },
      { name: 'Accounting', mastery: 75, description: 'Financial tracking' },
      { name: 'Leak Detection', mastery: 90, description: 'Expense optimization' }
    ]
  },
  {
    id: 'legal',
    label: 'Legal Sector',
    icon: Scale,
    color: '#64748b', // Slate
    agent: 'Aquaman',
    skills: [
      { name: 'Compliance', mastery: 85, description: 'Regulatory alignment' },
      { name: 'IP Defense', mastery: 70, description: 'Intellectual Property' },
      { name: 'Contracting', mastery: 65, description: 'Legal agreements' }
    ]
  },
  {
    id: 'people',
    label: 'People Sector',
    icon: Users,
    color: '#ec4899', // Pink
    agent: 'Professor X',
    skills: [
      { name: 'Empathy', mastery: 95, description: 'Emotional intelligence' },
      { name: 'Leadership', mastery: 85, description: 'Strategic guidance' },
      { name: 'Knowledge', mastery: 90, description: 'Wisdom repository' }
    ]
  }
];
