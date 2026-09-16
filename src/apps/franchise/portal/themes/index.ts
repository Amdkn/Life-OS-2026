type FranchiseId = 'abc_childcare' | 'rilcot' | 'alikaly_holding' | 'marina_cleaning';

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  fontFamily: string;
}

export const franchiseThemes: Record<FranchiseId, ThemeConfig> = {
  abc_childcare: {
    primaryColor: '#FF6B6B',
    secondaryColor: '#4ECDC4',
    logoUrl: '/logos/abc_childcare.png',
    fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
  },
  rilcot: {
    primaryColor: '#2C3E50',
    secondaryColor: '#E74C3C',
    logoUrl: '/logos/rilcot.png',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  alikaly_holding: {
    primaryColor: '#F1C40F',
    secondaryColor: '#8E44AD',
    logoUrl: '/logos/alikaly_holding.png',
    fontFamily: 'Georgia, serif',
  },
  marina_cleaning: {
    primaryColor: '#3498DB',
    secondaryColor: '#2ECC71',
    logoUrl: '/logos/marina_cleaning.png',
    fontFamily: 'Arial, sans-serif',
  }
};

export const getThemeForFranchise = (id: FranchiseId): ThemeConfig => {
  return franchiseThemes[id] || franchiseThemes['abc_childcare']; // Fallback
};