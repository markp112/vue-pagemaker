// import { BoxDimensionsInterface } from '@/models/components/box-dimension';
// import { Style } from '@/models/styles/styles';
// import { ImageManipulator, MousePostion } from './imageManipulation';

// export class Resize extends ImageManipulator {

//   public resize(currentMousePosition: MousePostion): { boxDimensions: BoxDimensionsInterface, style: Style} {
//     const resize: Resize = new Resize();
//     return {
//       boxDimensions: resize.reSizeContainers(currentMousePosition),
//       style: resize.resizeImage(),
//     };
//   }

//   private reSizeContainers(currentMousePosition: MousePostion): BoxDimensionsInterface {
//     const resizedDimensions = this.calculateNewDimensions(currentMousePosition);
//     this.lastMousePosition = currentMousePosition;
//     resizedDimensions.width.value = 
//       this.checkWidthFitsWithinContainer(
//         resizedDimensions.width.value
//       );
//     const constrainedDimensions = this.checkDimensionsRelativeToContainer(resizedDimensions);
//     this.imageWidth = constrainedDimensions.width.value;
//     this.imageHeight = constrainedDimensions.height.value;
//     return constrainedDimensions;
//   }

//   private resizeImage(): Style {
//     const backgroundSize = 'background-size' as const;
//     let style = {
//       style: backgroundSize,
//       value: `${this.imageWidth}px ${this.imageHeight}px`
//     };
//     if (this.naturalSize) {
//       if (this.imageWidth > this.naturalSize.width) {
//         style = {
//           style: backgroundSize,
//           value: `${this.imageWidth}px ${this.naturalSize.height}px`
//         };
//       } else if (this.imageWidth < this.naturalSize.width) {
//         style = {
//           style:backgroundSize,
//           value: `${this.naturalSize.width}px ${this.naturalSize.height}px`
//         };
//       }
      
//     }
//     return style;
//   }

//   private checkWidthFitsWithinContainer(width: number) {
//     if (this.parent) {
//       return this.parent.checkDimensionRelativeToContainerElements(
//         this.imageRef, 
//         width
//       );
//     }
//     return width;
//   }

//   private checkDimensionsRelativeToContainer(dimensions: BoxDimensionsInterface): BoxDimensionsInterface {
//     const checkedDimensions = dimensions;   
//     if (this.imageBoundRect.top < this.containerBoundingRect.top) {
//         checkedDimensions.top.value = this.containerBoundingRect.top;
//     }
//     if (this.parent) {
//       if (dimensions.height.value > this.parent.boxDimensions.height.value) {
//         checkedDimensions.height.value = this.parent.boxDimensions.height.value;
//       }
//     }
//     return checkedDimensions;
//   }

//   private calculateNewDimensions(currentMousePosition: MousePostion): BoxDimensionsInterface {
//     const changeX = currentMousePosition.x - this.lastMousePosition.x;
//     const changeY = currentMousePosition.y - this.lastMousePosition.y;
//     return {
//       height: { value: this.imageBoundRect.height + changeY, units: 'px' },
//       width: { value: this.imageBoundRect.width + changeX, units: 'px' },
//       top: { value: this.imageBoundRect.top, units: 'px' },
//       left: { value: this.imageBoundRect.left, units: 'px' },
//     };
//   }

// }