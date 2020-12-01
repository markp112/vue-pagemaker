import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageElement } from '../../PageElement';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';
import { Dimensions, initDimensions, Location } from '@/models/components/components';
import { Image } from '@/models/components/components';
import { ImageElementFirebaseData, ImageElementInterface } from '../../models/pageElements/imageElement';
import { Units } from '@/models/enums/units/units';

export class ImageElement extends PageElement implements ImageElementInterface {
  private _naturalSize: Dimensions;
  private _scaledSize: Dimensions;
  private _ratio: number;
  private _maintainRatio: boolean;
  private _parentDimensions: Dimensions;
  private _location: Location = {
    top: 0,
    left: 0,
  }

  constructor(builder: PageElementBuilder) {
    super(builder);
    this._maintainRatio = true;
    this._naturalSize = builder.naturalSize;
    this._parentDimensions = initDimensions;
    this._ratio = this.calcRatio( this._naturalSize.width, this._naturalSize.height);
    this._scaledSize = {
      width: 100,
      height: 200,
      units: Units.px
    };
  }

  get naturalSize(): Dimensions {
    return this._naturalSize;
  }

  set naturalSize(size: Dimensions){
    this._naturalSize = size;
    console.log('%c⧭', 'color: #00ff88', this._naturalSize);
    // this._scaledSize = size; /** @description when image size changes the scaled size should be reset */
    this._ratio = this.calcRatio(this._naturalSize.width, this._naturalSize.height);
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

  get location(): Location {
    return this._location;
  }

  set location(location: Location) {
    this._location = location;
  }

  public getElementContent(): ImageElementFirebaseData {
    return Object.assign( this.getBaseElementContent(), {
      naturalSize: this._naturalSize,
      scaledSize: this._scaledSize,
      ratio: this._ratio,
      maintainRatio: this._maintainRatio,
      parentDimensions: this._parentDimensions,
      location: this._location,
    });
  }

  public setDefaultStyle() {
    if (this.styles.length === 0) {
      const siteDefaults = SiteDefaults.getInstance();
      const siteColours = siteDefaults.colours;
      this.addStyle(this.constructStyle('background-color', siteColours.surface));
      this.addStyle(this.constructStyle('color', siteColours.textOnSurface));
      this.addStyle(this.constructStyle('background-size', '100px 200px'));
      this.addStyle(this.constructStyle('background-repeat', 'no-repeat'));
      this.addStyle(this.constructStyle('background-image', `url(${this.content})`));
      this.addStyle(this.constructStyle('background-position-x', '0px'));
      this.addStyle(this.constructStyle('background-position-y', '0px'));

    }
  }

  public setImage(image: Image) {
    this.content = image.content;
    
    console.log('%c⧭', 'color: #7f7700', image.naturalSize);
    if (image.naturalSize.width === 0) {
      image.naturalSize.width = 300;
    }
    if (image.naturalSize.height === 0) {
      image.naturalSize.height = 250;
    }
    this._naturalSize = image.naturalSize;
    this._ratio = image.ratio;
    this._scaledSize = image.scaledSize;
    this._maintainRatio = image.maintainRatio;
    this.addStyle(this.constructStyle('background-image', `url(${this.content})`));
  }

  private calcRatio(width: number, height: number): number {
    return Math.min(width / height, height / width);
  }
}
