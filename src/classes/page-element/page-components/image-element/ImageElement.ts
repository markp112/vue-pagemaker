import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageElement } from '../../PageElement';
import {
  Dimensions,
  Location
} from '@/models/components/components';
import { Image } from '@/models/components/components';
import {
  ImageElementFirebaseData,
  ImageElementInterface
} from '../../models/pageElements/ImageElementModel';
import { Style } from '@/models/styles/styles';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';

export class ImageElement extends PageElement implements ImageElementInterface {
  private _naturalSize: Dimensions;
  private _scaledSize: Dimensions;
  private _ratio: number;
  private _maintainRatio: boolean;
  private _containerDimensions: Dimensions;
  private _location: Location = {
    top: 0,
    left: 0
  };

  constructor(builder: PageElementBuilder) {
    super(builder);
    this._maintainRatio = true;
    this._naturalSize = builder.naturalSize;
    this._containerDimensions = builder.containerDimensions;
    this._ratio = this.calcRatio(
      this._naturalSize.width,
      this._naturalSize.height
    );
    this._scaledSize = builder.scaledSize;
  }

  get naturalSize(): Dimensions {
    return this._naturalSize;
  }

  set naturalSize(size: Dimensions) {
    this._naturalSize = size;
    this._ratio = this.calcRatio(
      this._naturalSize.width,
      this._naturalSize.height
    );
  }

  get scaledSize(): Dimensions {
    return this._scaledSize;
  }

  set scaledSize(dimensions: Dimensions) {
    this._scaledSize = dimensions;
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

  get containerDimensions(): Dimensions {
    return this._containerDimensions;
  }

  set containerDimensions(dimensions: Dimensions) {
    this._containerDimensions = dimensions;
  }

  get location(): Location {
    return this._location;
  }

  set location(location: Location) {
    this._location = location;
  }

  public getStyles(): string {
    let style = '';
    const styles: Style[] = this.styles;
    if (styles.length > 0) {
      styles.forEach(element => {
        style += `${element.style}:${element.value};`;
      });
      style += `width:${this.containerDimensions.width}px;height:${this.containerDimensions.height}px;`;
    }
    return style;
  }

  public getContainerStyles(): string {
    let style = '';
    const styles: Style[] = this.styles;
    if (styles.length > 0) {
      styles.forEach(element => {
        if (element.style === 'background-size') {
          style += `${element.style}:${this.containerDimensions.width}px ${this.containerDimensions.height}px;`;
          style += `width:${this.containerDimensions.width}px;height:${this.containerDimensions.height}px;`;
        }
      });
    }
    return style;
  }

  public getElementContent(): ImageElementFirebaseData {
    return Object.assign(this.getBaseElementContent(), {
      naturalSize: this._naturalSize,
      scaledSize: this._scaledSize,
      ratio: this._ratio,
      maintainRatio: this._maintainRatio,
      containerDimensions: this._containerDimensions,
      location: this._location
    });
  }

  public setDefaultStyle() {
    if (this.styles.length === 0) {
      const siteDefaults = SiteDefaults.getInstance();
      const siteColours = siteDefaults.colours;
      this.addStyle(
        this.constructStyle('background-color', siteColours.surface)
      );
      this.addStyle(this.constructStyle('color', siteColours.textOnSurface));
      this.addStyle(this.constructStyle('background-size', '100px 200px'));
      this.addStyle(this.constructStyle('background-repeat', 'no-repeat'));
      this.addStyle(
        this.constructStyle('background-image', `url(${this.content})`)
      );
      this.addStyle(this.constructStyle('background-position-x', '0px'));
      this.addStyle(this.constructStyle('background-position-y', '0px'));
      this.addStyle(this.constructStyle('width', '100px'));
      this.addStyle(this.constructStyle('height', '200px'));
    }
  }

  public setImage(image: Image) {
    this.content = image.content;
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
    this.addStyle(
      this.constructStyle('background-image', `url(${this.content})`)
    );
  }

  private calcRatio(width: number, height: number): number {
    return Math.min(width / height, height / width);
  }
}
