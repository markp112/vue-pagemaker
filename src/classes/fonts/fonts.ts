
import axios from 'axios';
import { secrets } from '@/firebase/secrets';
import * as WebFont from 'webfontloader';

const googleApi = axios.create({baseURL:'https://www.googleapis.com/webfonts/v1/webfonts'});

//instance.defaults.headers.common['authorisation1']='auth';


type FontTypes = 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace' | null;

export interface FontItemInterface {
  fontName: string;
  fontType: FontTypes;
}

export interface GoogleFontInterface {
  kind: string;
  items: GoogleFontItemInterface[];
}

export interface GoogleFontItemInterface {
  kind: string;
  family: string;
  category: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified:string;
  files: FilesInterface;
}

export interface FilesInterface {
  regular?: string;
  italic?: string;
  "100"?: string;
  "100italic"?: string;
  "200"?: string;
  "200italic"?: string;
  "300"?: string;
  "300italic"?: string;
  "500"?: string;
  "500italic"?: string;
  "600"?: string;
  "600italic"?: string;
  "700"?: string;
  "700italic"?: string;
  "800"?: string;
  "800italic"?: string;
  "900"?: string;
  "900italic"?: string;
}

export class Fonts {

  private key = secrets.google.fontsAPIKey;
  private fontApi = `https://www.googleapis.com/webfonts/v1/webfonts?key=${this.key}`;
  private fontItems: GoogleFontItemInterface[] = [];
  private fontNamesList: string[] = [];
  private fontNames: FontItemInterface[] = [];

  public initFonts(): Promise<boolean> {
    return new Promise((resovle) => {
      this.getFontsFromGoogle()
      .then (() => {
        this.initialiseFontNames()
        .then(() => {
          this.initialiseWebFont();
        });
      });
    });
  }
  
  private getFontsFromGoogle(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      googleApi.get(this.fontApi)
      .then (data => {
        data.data.items.forEach((fontItem : GoogleFontItemInterface) => {
          this.fontItems.push(fontItem);
        });
        resolve(true);
      })
      .catch(err => {
        console.log(err);
        reject(false);
      });
    });
  }

  private initialiseFontNames(): Promise<boolean> {
    return new Promise((resolve,reject) => {
      if (this.fontItems) {
          this.fontItems.forEach(element => {
          const fontItem: FontItemInterface = { fontName: element.family, fontType: element.category as FontTypes };
          this.fontNames.push(fontItem);
          this.fontNamesList.push(fontItem.fontName);
        });
        resolve(true);
      };
      reject(false);
    });
  }

  private initialiseWebFont(): Promise<boolean> {
    console.log("load webfonts")
    return new Promise((resolve) => {
      WebFont.load({
        google: {
          families: this.fontNamesList,
        },
      });
      resolve(true);
    })
  }

  public getListofFonts(): FontItemInterface[] {
    return this.fontNames;
  }

  public filterFonts(filterBy: string): FontItemInterface[] {
    return this.fontNames.filter(font => font.fontType === filterBy)
  }
}
