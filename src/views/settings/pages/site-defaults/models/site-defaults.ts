export interface MaterialColourInterface {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  surface: string;
  background: string;
  error: string;
  accent: string;
  textOnPrimary: string;
  textOnSecondary: string;
  textOnSurface: string;
  textOnBackground: string;
  textOnAccent: string;
  textOnError: string;
}

export interface TypographyInterface {
  fontName: string;
  fontSizeBody: string;
}

export interface SiteDefaultsInterface {
  colours: MaterialColourInterface;
  typography: TypographyInterface;
}

export const siteDefaultSettings: SiteDefaultsInterface = {
  colours : {
    primary : '#323673',
    primaryLight : '#39407f',
    primaryDark : '#26265c',
    secondary : '#61527A',
    secondaryLight : '#9f91b6',
    secondaryDark : '#1d1825',
    surface : '#fffffe',
    background : '#cecece',
    error : '#ff1744',
    textOnPrimary : '#ffffee',
    textOnSecondary : '#ffffee',
    textOnBackground : '#0',
    textOnSurface : '#0',
    textOnAccent : '#ffffee',
    textOnError : '#ffffee',
    accent : '#f28322',
  },
  typography: {
    fontName: 'Roboto',
    fontSizeBody: '16px'
  }

}
