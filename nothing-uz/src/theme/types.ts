export type ThemeId = 'classic' | 'matrix' | 'gold';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  behaviorTitle: string;
  behaviorDesc: string;
  badge: string;
  accentColor: string;
  accentClass: string;
  glowColor: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  classic: {
    id: 'classic',
    name: 'Nothing Classic',
    behaviorTitle: 'Minimalist & Fokus',
    behaviorDesc: 'Ortiqcha detallarsiz sof Nothing — qora, qizil LED va xrom',
    badge: '🔴 Standart',
    accentColor: '#EF4444',
    accentClass: 'text-red-500',
    glowColor: 'rgba(239, 68, 68, 0.25)',
  },
  matrix: {
    id: 'matrix',
    name: 'Cyber Matrix',
    behaviorTitle: 'Dasturchi & Xaker',
    behaviorDesc: 'Tungi kod yozuvchilar va terminal ishqibozlari uchun kiber-yashil rejim',
    badge: '🟢 Terminal',
    accentColor: '#10B981',
    accentClass: 'text-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.25)',
  },
  gold: {
    id: 'gold',
    name: 'Royal Gold',
    behaviorTitle: 'VIP & Saxovat',
    behaviorDesc: 'Milliarderlar va oliy tabaqa uchun hashamatli oltin va binafsha rejim',
    badge: '🟡 Hashamat',
    accentColor: '#F59E0B',
    accentClass: 'text-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.25)',
  },
};
