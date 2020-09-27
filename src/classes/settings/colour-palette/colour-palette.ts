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

export class ColourPalettes implements PalettesInterface {

  private _colour: string;
  private _primary: string[] = [];
  private _secondary: string[] = [];
  private _accent: string[] = [];

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
    this._secondary = this.generateSecondary(colour);
    this._accent = this.generateAccent(colour);
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
    const secondaryColour = rootColour.rotate(180).hex();
    return(this.generate(secondaryColour));
  }

  generateAccent(colour: string): string[] {
    const rootColour = new Color(colour);
    const accentColour = rootColour.saturate(1).rotate(60).hex();
    return(this.generate(accentColour));
  }
}
