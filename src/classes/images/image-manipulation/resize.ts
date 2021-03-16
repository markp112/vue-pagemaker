import { ImageElement } from "@/classes/page-element/page-components/image-element/ImageElement";
import { Dimensions } from "@/models/components/components";
import { Units } from "@/models/enums/units/units";
import { MousePostion } from "./imageManipulation";

export class ResizeImage {
  private _imageElement: ImageElement;
  private _imageContainer: Dimensions;

  constructor(imageElement: ImageElement) {
    this._imageElement = imageElement;
    this._imageContainer = this._imageElement.containerDimensions;
  }

  public resize(deltaChange: MousePostion) {
    this._imageContainer.width += deltaChange.x;
    this._imageContainer.height += deltaChange.y;
    this._imageContainer = this.containWithinParentElement();
    this.setNewSizes(deltaChange);
  }

  private setNewSizes(deltaChange: MousePostion) {
    this._imageElement.scaledSize.width
    this._imageElement.scaledSize.width += deltaChange.x;
    this._imageElement.scaledSize.height += deltaChange.y;
    this._imageElement.containerDimensions = { ...this._imageContainer };
  }

  private containWithinParentElement(): Dimensions {
    const checkedDimensions: Dimensions = {
      height: this._imageContainer.height,
      width: this._imageContainer.width,
      units: Units.px
    };
    if (checkedDimensions.height < 0) {
      checkedDimensions.height = 0;
    }
    if (
      checkedDimensions.height >
      this._imageElement.parent.boxDimensions.height.value
      ) {
        checkedDimensions.height = this._imageElement.parent.boxDimensions.height.value;
      }
      if (checkedDimensions.width < 0) {
        checkedDimensions.width = 0;
      }
      if (
        checkedDimensions.width >
        this._imageElement.parent.boxDimensions.width.value
        ) {
          checkedDimensions.width = this._imageElement.parent.boxDimensions.width.value;
        }
    return checkedDimensions;
  }
}
