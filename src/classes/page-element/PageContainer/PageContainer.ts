import { ComponentRef } from "@/models/components/base-component";
import { PageElementBuilder } from "@/classes/page-element/page-element-builder/PageElementBuilder";
import { PageElement } from "../PageElement";
import { PageElementClasses } from "../factory/page-element-factory";
import { SiteDefaults } from "../../settings/site-defaults/site-defaults";
import {
  ContainerOrientation,
  PageContainerInterface
} from "../models/page-container/PageContainer";
import { FirebasePageDataTypes } from "../firebase-data/FirebaseDataBuilder";

export class PageContainer extends PageElement
  implements PageContainerInterface {
  private _elements: PageElementClasses[];

  constructor(pageElementBuilder: PageElementBuilder) {
    super(pageElementBuilder);
    this._elements = [];
  }

  checkDimensionRelativeToContainerElements(
    componentRef: string,
    dimensionToCheck: number
  ) {
    let totalDimensionOfOtherComponent = 0;
    let totalHeightOrWidth = 0;
    if (this.containerOrientation === "row") {
      totalHeightOrWidth = this.boxDimensions.width.value;
      this.elements
        .filter(element => {
          return element ? element.ref !== componentRef : undefined;
        })
        .forEach(element => {
          if (element) {
            const boxDimensions = element.boxDimensions;
            const units = boxDimensions.width.units;
            if (units === "%") {
              const divisor: number = boxDimensions.width.value / 100;
              totalDimensionOfOtherComponent +=
                this.boxDimensions.width.value * divisor;
            } else {
              totalDimensionOfOtherComponent +=
                element.boxDimensions.width.value;
            }
          }
        });
    } else {
      totalHeightOrWidth = this.boxDimensions.height.value;
      this.elements
        .filter(element => {
          return element ? element.ref !== componentRef : undefined;
        })
        .forEach(element => {
          if (element) {
            totalDimensionOfOtherComponent +=
              element.boxDimensions.height.value;
          }
        });
    }

    return dimensionToCheck + totalDimensionOfOtherComponent >=
      totalHeightOrWidth
      ? totalHeightOrWidth - totalDimensionOfOtherComponent - 4
      : dimensionToCheck;
  }

  getWidthOfAllComponents(): number {
    let width = 0;
    this._elements.forEach(element => {
      if (element) {
        width += element.boxDimensions.width.value;
      }
    });
    return width;
  }

  getHeightOfAllComponents(): number {
    let height = 0;
    this._elements.forEach(element => {
      if (element) {
        height += element.boxDimensions.width.value;
      }
    });
    return height;
  }

  get elements(): PageElementClasses[] {
    return this._elements;
  }

  get containerOrientation(): ContainerOrientation {
    return this.classDefinition.includes("flex-row") ? "row" : "column";
  }

  setDefaultStyle() {
    if (this.styles.length === 0) {
      const siteDefaults = SiteDefaults.getInstance();
      this.addStyle(
        this.constructStyle("font-family", siteDefaults.typography.fontName)
      );
      this.addStyle(
        this.constructStyle("font-size", siteDefaults.typography.fontSizeBody)
      );
      const siteColours = siteDefaults.colours;
      this.addStyle(
        this.constructStyle("background-color", siteColours.surface)
      );
      this.addStyle(this.constructStyle("color", siteColours.textOnSurface));
    }
  }

  addNewElement(newElement: PageElementClasses) {
    if (newElement) {
      const existingElement = this._elements.filter(element => {
        if (element) {
          element.ref === newElement.ref;
        }
      })[0];
      if (!existingElement) {
        this._elements.push(newElement);
      } else {
        this._elements = this._elements.filter(element => {
          if (element) {
            element.ref !== newElement.ref;
          }
        });
        this._elements.push(newElement);
      }
    }
  }

  getAnElement(ref: ComponentRef): PageElementClasses {
    return this._elements.filter(element => {
      if (element) {
        return element.ref === ref;
      }
    })[0];
  }

  deleteElement(ref: ComponentRef) {
    this._elements = this._elements.filter(element => {
      if (element) {
        return element.ref !== ref;
      }
    });
  }

  getElementContent(): FirebasePageDataTypes {
    return Object.assign(this.getBaseElementContent(), {
      elements: this._elements
    });
  }
}
