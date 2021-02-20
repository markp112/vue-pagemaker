import { ImageElement } from "@/classes/page-element/page-components/image-element/ImageElement";
import { PageContainer } from "@/classes/page-element/PageContainer/PageContainer";
import { Dimension } from "@/models/components/box-dimension";
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
    // this._imageContainer.width = this.checkElementFitsWithOtherContainerElements(
    //   this._imageContainer.width
    // );
    this._imageContainer = this.containWithinParentElement();
    this._setNewSizes(deltaChange);
  }

  private _setNewSizes(deltaChange: MousePostion) {
    this._imageElement.scaledSize.width += deltaChange.x;
    this._imageElement.scaledSize.height += deltaChange.y;
    this._imageElement.containerDimensions = this._imageContainer;
  }

  // private checkElementFitsWithOtherContainerElements(width: number): number {
  //   const newWidth = this._imageElement.parent.checkDimensionRelativeToContainerElements(
  //     this._imageElement.ref,
  //     width
  //   );
  //   return newWidth;
  // }

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
