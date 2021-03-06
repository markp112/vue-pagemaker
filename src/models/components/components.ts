import { Units } from '../enums/units/units';

export type ImageScaleDirection = 'width' | 'height';

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

/**
 * @description used for storing the location of an object(images) in their wrapper element
 */
export interface Location {
  top: number;
  left: number;
}

export interface Content {
  content: string
}

export interface ImageInterface extends Content {
  naturalSize: Dimensions; /** @description natural size of imgage */
  scaledSize: Dimensions; /** @description image size after user resizing */
  ratio: number;
  maintainRatio: boolean;
  parentDimensions: Dimensions;
}

export interface TextInterface  extends Content{
  content: string;
}

export interface ButtonInterface extends Content {
  content: string;
}

export interface ClientCoordinates {
  clientX: number;
  clientY: number;
  offsetWidth: number;
  offsetHeight: number;
}

export class Image implements ImageInterface {
  private _content: string;
  private _naturalSize: Dimensions;
  private _scaledSize: Dimensions;
  private _ratio: number;
  private _maintainRatio: boolean;
  private _parentDimensions: Dimensions;

  constructor() {
    this._naturalSize = this._naturalSize = {
      width: 300,
      height: 200,
      units: Units.px };
    this._scaledSize = initDimensions;
    this._content = 'https://firebasestorage.googleapis.com/v0/b/page-maker-69fb1.appspot.com/o/assets%2Fimages%2Fimageplaceholder.png?alt=media&token=149d3e60-0fc4-49de-9e23-5fea91458240';
    this._ratio = this.naturalSize.width / this.naturalSize.height;
    this._maintainRatio = true;
    this._parentDimensions = initDimensions;
  }

  get content(): string {
    return this._content;
  }

  set content(url: string) {
    this._content = url;
  }

  get naturalSize(): Dimensions {
    return this._naturalSize;
  }
  
  set naturalSize(size: Dimensions){
    this._naturalSize = size;
    this._scaledSize = size; /** @description when image size changes the scaled size should be reset */
    this._ratio = this._naturalSize.width / this._naturalSize.height;
  }

  get scaledSize() {
    return this._scaledSize;
  }

  get ratio(): number {
    return this._ratio;
  }

  get maintainRatio() {
    return this._maintainRatio;
  }

  set maintainRatio(maintainRatio: boolean) {
    this._maintainRatio = maintainRatio;
  }

  get parentDimensions(): Dimensions {
    return this._parentDimensions;
  }

  set parentDimensions(dimensions: Dimensions) {
    this._parentDimensions = dimensions;
  }

}

export class Text implements Content {
  private _content: string;

  constructor() {
    this._content = '';
  }

  get content(): string {
    return this._content;
  }

  set content(content: string) {
    this._content = content;
  }
}

export class Button implements Content {
  private _content: string;

  constructor() {
    this._content = '';
  }

  get content(): string {
    return this._content;
  }

  set content(content: string) {
    this._content = content;
  }
}

export type ComponentTypes = Image | Text | Button | undefined;
export const LOREMIPSUM = '<p id="e673k" class="text-editor">Lorem ipsum But I must explain to you <span class="textDecoration underline">how all this mistaken idea of denouncing pleasure and praising pain was born</span></p>' 
    + '<p id="e67gk" class="text-editor"><span class="textDecoration underline">and I will give you a complete account of the system,<span class="italic"> and expound the <span class="not-italic">actual</span> teachings of the great</span> explorer of the truth</span></p>'
    + '<p id="e63kfk" class="text-editor"><span class="textDecoration underline">No one rejects, dislikes,</span> not underlined <span class="textDecoration underline"> or avoids pleasure</span><span> itself </span><span class="textDecoration underline"> because it is pleasure</span>, the master-builder of human happiness.</p>'
    + '<p id="e67rfk" class="text-editor">but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.</p>'
    + '<p id="e67f3wk" class="text-editor">Nor again is there anyone who loves or pursues or desires to obtain pain of itself <span class="textDecoration underline"><span style="font-size:22px">because it is pain</span>, but</span> because occasionally circumstances occur.</p>';