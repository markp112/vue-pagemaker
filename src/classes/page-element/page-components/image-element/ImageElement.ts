import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageElement } from '../../PageElement';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';
import { Dimensions, ImageScaleDirection, initDimensions } from '@/models/components/components';

export class ImageElement extends PageElement {
  _content: string;
  private _naturalSize: Dimensions;
  private _scaledSize: Dimensions;
  private _ratio: number;
  private _maintainRatio: boolean;
  private _parentDimensions: Dimensions;

  constructor(builder: PageElementBuilder) {
    super(builder);
    this._content = builder.content;
    this._maintainRatio = true;
    this._naturalSize = initDimensions;
    this._parentDimensions = initDimensions;
    this._ratio = this._naturalSize.width / this._naturalSize.height;
    this._scaledSize = initDimensions;
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
    return this.ratio;
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

  calcScalingRatio(direction: ImageScaleDirection, changedDimension: number ): Dimensions {
    if (this._maintainRatio) {
      if (direction === 'width') {
        this._scaledSize.width = changedDimension;
        this._scaledSize.height = changedDimension / this._ratio;
        if (this._scaledSize.height >= this.parentDimensions.height) {
          this._scaledSize.height = this.parentDimensions.height;
          if (this._scaledSize.width > this._scaledSize.height * this._ratio) {
            this._scaledSize.width = this._scaledSize.height * this._ratio;
          }
        }
      } else {
        this._scaledSize.width = changedDimension * this._ratio;
        this._scaledSize.height = changedDimension;
        if (this._scaledSize.width > this._parentDimensions.width) {
          this._scaledSize.width = this._parentDimensions.width;
          if (this._scaledSize.height > this._scaledSize.width / this._ratio) {
            this._scaledSize.height = this._scaledSize.width / this._ratio;
          }
        }
      }
    }
    return this._scaledSize;
  }

  setDefaultStyle() {
    const siteDefaults = SiteDefaults.getInstance();
    this.addStyle(this.constructStyle('fontFamily', siteDefaults.typography.fontName));
    this.addStyle(this.constructStyle('fontSize', siteDefaults.typography.fontSizeBody));
    const siteColours = siteDefaults.colours;
    this.addStyle(this.constructStyle('backgroundColor', siteColours.background));
    this.addStyle(this.constructStyle('color', siteColours.textOnBackground));
  }
}
