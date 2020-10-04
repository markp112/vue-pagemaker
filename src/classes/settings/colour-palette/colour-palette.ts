import { SiteIdAndUserId } from '@/models/site-and-user/site-and-user';
import { ServicesModule } from '@/store/services/services';
import Color from 'color';
import { Notification } from '@/models/notifications/notifications';

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
  colourScheme: ColourSchemes;
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
  private _colourScheme: ColourSchemes;

  private MAX_SHADES = 10;

  constructor(colour: string) {
    this._colour = colour;
    this.newPalette(this._colour);
    this._colourScheme = 'Complementary';
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

  public newPalette(colour: string) {
    this._colour = colour;
    this._primary = this.generate(colour);
    this.setAngles();
    this._secondary = this.generateSecondary(colour);
    this._accent = this.generateAccent(colour);
  }

  public changeSaturation(saturation: number) {
    const satValue = saturation;
    this._primary = this.applySaturation(satValue, this._primary);
    this._secondary = this.applySaturation(satValue, this._secondary);
    this._accent = this.applySaturation(satValue, this._accent);
  }

  private applySaturation(multiplier: number, palette: string[]): string[] {
      const newPalette: string[] = [];
        palette.forEach(colour => {
          const newColour = Color(colour);
          const saturatedColour = multiplier > 0 
            ? newColour.saturate(multiplier).hex()
            : newColour.desaturate(multiplier * -1 ).hex();
          newPalette.push(saturatedColour);
        });
        return newPalette;
    // return new Promise((resolve) => 
    //   resolve(palette.map(colour => {
    //     const newColour = Color(colour);
    //     return  multiplier > 0 
    //       ? newColour.saturate(multiplier).hex()
    //       : newColour.desaturate(multiplier * -1 ).hex();  
    //   })) 
      
    // )
  }

  public savePalette(siteAndUserId: SiteIdAndUserId): Promise<Notification> {
    const selectedPalette: PalettesInterface = {
      colour: this.colour,
      colourScheme: this.colourScheme,
      primary: this.primary,
      secondary: this.secondary,
      accent: this.accent,
    };
    const data = {
      siteAndUserId: siteAndUserId,
      colourPalette: selectedPalette,
    }
    return new Promise((resolve, reject) => {
      ServicesModule.firestoreSaveColourPalette(data)
      .then ((response: Notification) => {
        resolve(response);
      })
      .catch((err: Notification) => {
        reject(err)
      })
    })
  }

  public loadPalette(siteAndUserId: SiteIdAndUserId): Promise<Notification> {
    return new Promise((resolve, reject) => {
      ServicesModule.firestoreLoadSitePalette(siteAndUserId)
      .then (response => {
        const palettes = response as PalettesInterface;
        this._colour = palettes.colour;
        this.colourScheme = palettes.colourScheme;
        this.primary = palettes.primary;
        this.secondary = palettes.secondary;
        this.accent = palettes.accent;
        const notification: Notification = {
          message: "loaded palette",
          status: "ok",
        };
        resolve(notification);
      })
      .catch((err: Notification) => {
        this._colour = '#454cF4' // blue
        this._colourScheme = 'Complementary';
        this.newPalette(this._colour);
        reject(err);
      })
    })
  }

  private setAngles() {
    switch (this._colourScheme) {
      case 'Complementary':
        this._secondaryAngle = 180;
        this._accentAngle = -30;
        break;

      case 'Analogous':
        this._secondaryAngle = 30;
        this._accentAngle = -30;
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
  
  public generate(colour: string):string[] {
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

  private generateSecondary(colour: string): string[] {
    const rootColour = new Color(colour);
    const secondaryColour = rootColour.rotate(this._secondaryAngle).hex();
    return(this.generate(secondaryColour));
  }

  private generateAccent(colour: string): string[] {
    const rootColour = new Color(colour);
    const accentColour = rootColour.saturate(10).rotate(this._accentAngle).hex();
    return(this.generate(accentColour));
  }
}
