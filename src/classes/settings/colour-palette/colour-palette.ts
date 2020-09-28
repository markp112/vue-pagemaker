import Color from 'color';

const contrastRatios =  [
  0.15,
  0.3,
  0.5,
  0.7,
  0.85,
  1,
  0.85,
  0.7,
  0.5,
  0.35
];


export interface PalettesInterface {
  colour: string;
  primary: string[];
  secondary: string[];
  accent: string[];
}

export type ColourSchemes =
  | 'Analogous'
  | 'Complementary'
  | 'Triadic'
  | 'Compound' 

export class ColourPalettes implements PalettesInterface {

  private _colour: string;
  private _primary: string[] = [];
  private _secondary: string[] = [];
  private _accent: string[] = [];
  private _accentAngle = 30;
  private _secondaryAngle = 180;
  private _colourScheme: ColourSchemes = 'Complementary';

  private MAX_SHADES = 10;

  constructor(colour: string) {
    this._colour = colour;
    this.newPalette(this._colour);
  }

  get colour(): string {
    return this._colour;
  }

  set colour(colour: string) {
    this._colour = colour;
  }

  set colourScheme(scheme: ColourSchemes) {
    this._colourScheme = scheme;
  }

  get colourScheme(): ColourSchemes {
    return this._colourScheme;
  }

  get primary(): string[] {
    return this._primary;
  }

  set primary(primary: string[]) {
    if (primary.length === this.MAX_SHADES) {
      this._primary = primary; 
    }
  }

  get secondary(): string[] {
    return this._secondary;
  }

  set secondary(secondary: string[]) {
    if (secondary.length === this.MAX_SHADES) {
      this._secondary = secondary;
    }
  }

  get accent(): string[] {
    return this._accent;
  }

  set accent(accent: string[]) {
    if (accent.length === this.MAX_SHADES) {
      this._accent = accent;
    }
  }

  newPalette(colour: string) {
    this._primary = this.generate(colour);
    this.setAngles();
    this._secondary = this.generateSecondary(colour);
    this._accent = this.generateAccent(colour);
  }
  setAngles() {
    switch (this._colourScheme) {
      case 'Complementary':
        this._secondaryAngle = 180;
        this._accentAngle = -30;
        break;

      case 'Analogous':
        this._secondaryAngle = 30;
        this._accentAngle = 30;
        break;

      case 'Compound':
        this._secondaryAngle = 210;
        this._accentAngle = 150;
        break;
      
      case 'Triadic':
        this._secondaryAngle = 120;
        this._accentAngle = 240;
        break;
    }
  }

  generate(colour: string):string[] {
    const palette: string[] = [];
    const rootColour = new Color(colour)
    for (let index = 0; index < this.MAX_SHADES; index++) {
      if (index < 5) {
        palette.push(
          Color("white")
          .mix(rootColour, contrastRatios[index])
          .hex()
        );
      } else if (index === 5) {
        palette.push(colour);
      } else if (index >= 6 ) {
        palette.push(
          Color('black')
          .mix(rootColour, contrastRatios[index])
          .hex());
      }
    }    
    return palette;
  }

  generateSecondary(colour: string): string[] {
    const rootColour = new Color(colour);
    const secondaryColour = rootColour.rotate(this._secondaryAngle).hex();
    return(this.generate(secondaryColour));
  }

  generateAccent(colour: string): string[] {
    const rootColour = new Color(colour);
    const accentColour = rootColour.saturate(10).rotate(this._accentAngle).hex();
    return(this.generate(accentColour));
  }
}
