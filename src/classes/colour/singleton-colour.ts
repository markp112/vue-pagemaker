import { StyleElement } from '../text-attributes/text-attributes';

export type BackgroundBorderForeground = 'background-color' | 'color' | 'border-color';

export interface ColourInterface {
  _rgbColour: string;
  _backgroundBorderForeground: BackgroundBorderForeground;
}

export class Colour implements ColourInterface {
    _rgbColour ='#ffeedd';
    _backgroundBorderForeground: BackgroundBorderForeground = 'color';

    private static instance: Colour;

    public static getInstance(): Colour {
        if (!Colour.instance) {
            Colour.instance = new Colour();
            Colour.instance.rgbColour = '#ffeedd';
            Colour.instance._backgroundBorderForeground = 'color';
        }
        return Colour.instance;
    }

    applyStyle(style: StyleElement) {
      this._rgbColour = style.value;
      this._backgroundBorderForeground = style.styleName as BackgroundBorderForeground;
    }


    set rgbColour(colour: string) {
        this._rgbColour = colour;
    }
    
    get rgbColour(): string {
        return this._rgbColour;
    }

    get backgroundBorderForeground(): BackgroundBorderForeground {
      return this._backgroundBorderForeground
    }

    set backgroundBorderForeground(bfb: BackgroundBorderForeground) {
      this._backgroundBorderForeground = bfb;
    }

}