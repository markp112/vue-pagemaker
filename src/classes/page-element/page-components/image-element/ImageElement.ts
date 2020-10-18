import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageElement } from '../../PageElement';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';
import { Dimensions, ImageScaleDirection, initDimensions } from '@/models/components/components';
import { Image } from '@/models/components/components';
import { BoxDimensionsInterface } from '@/models/components/box-dimension';
import { Units } from '@/models/enums/units/units';

export class ImageElement extends PageElement {
  _content: string;
  private _naturalSize: Dimensions;
  private _scaledSize: Dimensions;
  private _ratio: number;
  private _maintainRatio: boolean;
  private _parentDimensions: Dimensions;

  private _widthOnePercent: number;
  private _heightOnePercent: number;

  constructor(builder: PageElementBuilder) {
    super(builder);
    this._content = builder.content;
    this._maintainRatio = true;
    this._naturalSize = initDimensions;
    this._parentDimensions = initDimensions;
    this._ratio = this._naturalSize.width / this._naturalSize.height;
    this._scaledSize = initDimensions;
    this._widthOnePercent = this._naturalSize.width / 100;
    this._heightOnePercent = this._naturalSize.height / 100; 
  }

  get content(): string {
    return this._content;
  }

  set content(content: string) {
    this._content = content;
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

  private calcScalingRatio(direction: ImageScaleDirection, changedDimension: number ): Dimensions {
    let dimension: Dimensions;
    if (this._maintainRatio) {
      if (direction === 'width') {
        const imageCurrentPercent = changedDimension / this._widthOnePercent;
        const newHeight = this._heightOnePercent * imageCurrentPercent;
         dimension =  {
          width: changedDimension,
          height: newHeight,
          units: Units.px,
        }
      } else {
        const imageCurrentPercent = changedDimension / this._heightOnePercent;
        const newWidth = this._widthOnePercent * imageCurrentPercent;
        dimension = {
          width: newWidth,
          height: changedDimension,
          units: Units.px,
        }
      }
    } else {
      return this.scaledSize;
    }
    return dimension;
  }

  public setDefaultStyle() {
    const siteDefaults = SiteDefaults.getInstance();
    this.addStyle(this.constructStyle('fontFamily', siteDefaults.typography.fontName));
    this.addStyle(this.constructStyle('fontSize', siteDefaults.typography.fontSizeBody));
    const siteColours = siteDefaults.colours;
    this.addStyle(this.constructStyle('backgroundColor', siteColours.surface));
    this.addStyle(this.constructStyle('color', siteColours.textOnSurface));
  }

  public setImage(image: Image) {
    this._content = image.content;
    this._naturalSize = image.naturalSize;
    this._ratio = image.ratio;
    this._scaledSize = image.scaledSize;
    this._maintainRatio = image.maintainRatio;
    this._widthOnePercent = this._naturalSize.width / 100;
    this._heightOnePercent = this._naturalSize.height / 100; 
  }

  public reSize(boxDimensions: BoxDimensionsInterface): void {
    let newDimensions: Dimensions;
    if (this._maintainRatio) {
      if (boxDimensions.height.value !== this._scaledSize.height) {
        newDimensions = this.calcScalingRatio('height', boxDimensions.height.value);
      } else {
        newDimensions = this.calcScalingRatio('width', boxDimensions.width.value);
      }
      boxDimensions.height.value = newDimensions.height;
      boxDimensions.width.value = newDimensions.width;
    }
    this._scaledSize.height = boxDimensions.height.value;
    this._scaledSize.width = boxDimensions.width.value;
    this.boxDimensions.height = boxDimensions.height;
    this.boxDimensions.width = boxDimensions.width;
  }

}
