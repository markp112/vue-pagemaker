import { Units } from '../enums/units/units';

export interface Dimensions {
  height: number;
  width: number;
  units: Units;
}

export const initDimensions = {
  height: 0,
  width: 0,
  units: Units.px
}

export interface Content {
  content: string
}

export interface ImageInterface extends Content {
  size: Dimensions;
}


export interface TextInterface  extends Content{
  content: string;
}

export interface ButtonInterface extends Content {
  content: string;
}

export class Image implements ImageInterface {
  private _content: string;
  private _size: Dimensions;

  constructor() {
    this._size = initDimensions;
    this._content = 'https://firebasestorage.googleapis.com/v0/b/page-maker-69fb1.appspot.com/o/assets%2Fimages%2Fimageplaceholder.png?alt=media&token=149d3e60-0fc4-49de-9e23-5fea91458240';
  }

  get content(): string {
    return this._content
  }

  set content(url: string) {
    this._content = url
  }

  get size():Dimensions {
    return this._size
  }

  set size(size: Dimensions){
    this._size = size
  }
}

export class Text implements Content {
  private _content: string;

  constructor() {
    this._content = ''
  }

  get content(): string {
    return this._content
  }

  set content(content: string) {
    this._content = content
  }
}

export class Button implements Content {
  private _content: string;

  constructor() {
    this._content = ''
  }

  get content(): string {
    return this._content
  }

  set content(content: string) {
    this._content = content
  }
}

export type ComponentTypes = Image | Text | Button | undefined;
export const LOREMIPSUM = '<p class="text-editor">Lorem ipsum But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born</p>' 
    + '<p>and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth</p>'
    + '<p>No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, the master-builder of human happiness.</p>'
    + '<p>but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.</p>'
    + '<p>Nor again is there anyone who loves or pursues or desires to obtain pain of itself <span style="font-size:22px">because it is pain</span>, but because occasionally circumstances occur.</p>';