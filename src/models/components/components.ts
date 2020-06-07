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
export const LOREMIPSUM = '<p class="text-editor">Lorem ipsum dolor sit amet</p> <p class="text-editor">,' 
    + 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore </p>'
    + '<p>et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco</p>'
    + '<p>laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat</p>'
    + '<p>nulla pariatur. Excepteur sint occaecat <span style="font-size:22px">cupidatat non proident</span>, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>';