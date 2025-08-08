// src/Theme.js
const Theme = {
  colors: {
    primary: '#007BFF',       // Bright Blue
    primaryDark: '#0056b3',   // Darker Blue
    primaryLight: '#66B2FF',  // Lighter Blue

    danger: '#DC3545',        // Red (for delete/danger)
    dangerDark: '#a71d2a',    // Darker Red
    dangerLight: '#f28a95',   // Lighter Red
    errorMessage: '#ef7373',

    darkBrown: '#2b2424',
    darkBrownRgba:'rgba(43,36,36, .8)',
    background: '#f4f8fc',    // Light background
    card: '#ffffff',          // Card background
    text: '#2c3e50',          // Dark text
    whiteText: '#FFF',          // Dark text
    mutedText: '#7f8c8d',     // Muted/secondary text

  },

  borderRadius: {
    small: '6px',
    medium: '12px',
    large: '20px',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
};

export default Theme;
