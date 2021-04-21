import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageElement } from '../../PageElement';
import { Image } from '@/models/components/components';
import {
  ImageElementFirebaseData,
  ImageElementInterface
} from '../../models/pageElements/ImageElementModel';
import { Style } from '@/models/styles/styles';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';
import { ADimension } from '@/classes/dimensions/adimensions';
import { ALocation } from '@/classes/a-location/aLocation';
import { MousePosition } from '@/components/page-builder-elements/generic/mixins/generic-components-mixin';

export interface ContainerProps {
  location: ALocation;
  dimensions: ADimension;
};

export interface ImageProps {
  location: ALocation;
  naturalSize: ADimension;
  scaledSize: ADimension;
}

type ImageOrContainer = 'container' | 'image';

export class ImageElement extends PageElement implements ImageElementInterface {
  private _ratio: number;
  private _maintainRatio: boolean;
  private _container: ContainerProps = {
    location: new ALocation(0, 0),
    dimensions: new ADimension(0,0),
  };
  private _image: ImageProps = {
    location: new ALocation(0, 0),
    naturalSize: new ADimension(0, 0),
    scaledSize: new ADimension(0, 0),
  };;

  constructor(builder: PageElementBuilder) {
    super(builder);
    this._maintainRatio = true;
    this._image.location = builder.imageLocation;
    this._image.naturalSize = builder.naturalSize;
    this._image.scaledSize = builder.scaledSize;
    this._container.location = builder.containerLocation;
    this._container.dimensions = builder.containerDimensions;
    this._ratio = this.calcRatio(
      this._image.naturalSize.width,
      this._image.naturalSize.height
    );
  }

  toString(): string {
    throw new Error('Method not implemented.');
  }

  get image(): ImageProps {
    return this._image;
  }

  get container(): ContainerProps {
    return this._container;
  }

  get naturalSize(): ADimension {
    return this._image.naturalSize;
  }

  set naturalSize(size: ADimension) {
    this._image.naturalSize = size;
    this._ratio = this.calcRatio(
      this._image.naturalSize.width,
      this._image.naturalSize.height
    );
  }

  get scaledSize(): ADimension {
    return this._image.scaledSize;
  }

  set scaledSize(dimensions: ADimension) {
    this._image.scaledSize = dimensions;
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

  get containerDimensions(): ADimension {
    return this._container.dimensions;
  }

  set containerDimensions(dimensions: ADimension) {
    if (dimensions.width > this.scaledSize.width) this.scaledSize.width = dimensions.width;
    if (dimensions.height > this.scaledSize.height) this.scaledSize.height = dimensions.height;
    this._container.dimensions = dimensions;
  }

  set containerLocation(location: ALocation) {
    this._container.location = location;
  }

  get containerLocation(): ALocation {
    return this._container.location;
  }

  get imageLocation(): ALocation {
    return this._image.location;
  }

  set imageLocation(location: ALocation) {
    this._image.location = location;
  }

  public getContainerStyles(): string {
    let style = '';
    style += this._container.dimensions.toStyle();
    style += this._container.location.toStyle();
    const styles: Style[] = this.styles;
    if (styles.length > 0) {
      styles.forEach(element => {
        style += `${element.style}:${element.value};`;
      });
    }
    return style;
  }
  

  public getImageStyle(): string {
    let style = '';
    style += this._image.scaledSize.toStyle();
    style += this._image.location.toStyle();
    const styles: Style[] = this.styles;
    if (styles.length > 0) {
      styles.forEach(element => {
        style += `${element.style}:${element.value};`;
      });
    }
    return style;
  }

  public getElementContent(): ImageElementFirebaseData {
    return Object.assign(this.getBaseElementContent(), {
      naturalSize: this._image.naturalSize.toStringObject(),
      scaledSize: this._image.scaledSize.toStringObject(),
      ratio: this._ratio,
      maintainRatio: this._maintainRatio,
      containerDimensions: this._container.dimensions.toStringObject(),
      containerLocation: this._container.location.toStringObject(),
      location: this._image.location.toStringObject(),
    });
  }

  public setDefaultStyle() {
    if (this.styles.length === 0) {
      const siteDefaults = SiteDefaults.getInstance();
      const siteColours = siteDefaults.colours;
      this.addStyle(this.constructStyle('color', siteColours.textOnSurface));
      this.addStyle(this.constructStyle('width', `${this.scaledSize.width}px`));
      this.addStyle(this.constructStyle('height', `${this.scaledSize.height}px`));
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
    this._image.naturalSize = image.naturalSize;
    this._ratio = image.ratio;
    this._maintainRatio = image.maintainRatio;
  }

  private calcRatio(width: number, height: number): number {
    return Math.min(width / height, height / width);
  }

  public pan(deltaMouse: MousePosition, itemToPan: ImageOrContainer) {
    if (itemToPan === 'image') {
      this.imageLocation.left += deltaMouse.x;
      this.imageLocation.top += deltaMouse.y;
    }
    else if (itemToPan === 'container') {
      this.containerLocation.left += deltaMouse.x;
      this.containerLocation.top += deltaMouse.y;
    }
  }
}
