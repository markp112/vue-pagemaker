import { Style } from "@/models/styles/styles";
import { ClassOrStyle } from "../range-base";

export class RangeStyles {
  public isStyleTag(classOrStyle: ClassOrStyle): boolean {
    return classOrStyle === "style";
  }

  public setStyleOrClass(
    node: Node,
    style: Style,
    classOrStyle: ClassOrStyle
  ): Node {
    if (this.isStyleTag(classOrStyle)) {
      return this.setStyle(node, style);
    } else {
      return this.setClass(node, style);
    }
  }

  public setStyles(node: Node, styles: Style[]): Node {
    styles.forEach(style => {
      this.setStyle(node, style);
    });
    return node;
  }

  public setStyle(node: Node, style: Style): Node {
    if (!node) return node;
    const element = node as HTMLElement;
    element.style.setProperty(style.style, style.value);
    return node;
  }

  public setClass(node: Node, style: Style): Node;

  public setClass(node: Node, style: string): Node;

  public setClass(node: Node, styleOrString: string | Style): Node {
    const element = node as HTMLElement;
    let leadingSpace = "";
    if (element.className.replace(" ", "").length !== 0) {
      leadingSpace = " ";
    }
    if (typeof styleOrString === "string") {
      element.className += `${leadingSpace}${styleOrString}`;
    } else {
      element.className += `${leadingSpace}${styleOrString.style} ${styleOrString.value}`;
    }
    return node;
  }

  public clearExistingClasses(node: Node, style: Style): Node {
    if (node.hasChildNodes()) {
      node.childNodes.forEach(node => {
        return this.clearExistingClasses(node, style);
      });
    }
    // each class will have a style name (which does nothing)
    // followed by the actual Tailwind class
    // style.style is used to identify if there is already
    // a style defined of the same class family e.g. font weight
    const element: HTMLElement = node as HTMLElement;
    if (element.className) {
      if (element.className.includes(style.style)) {
        const classes = element.className.split(" ");
        const cleanedClasses = classes.filter(
          className => className !== style.style
        );
        element.className = cleanedClasses.join(" ");
        return element;
      }
    }
    return node;
  }

  public clearExistingStyles(node: Node, style: Style): Node {
    if (!node) return node;
    if (node.nodeName === "#text") return node;
    const element: HTMLElement = node as HTMLElement;
    if (element.nodeName === "SPAN") {
      element.style.removeProperty(style.style);
    }
    if (node.hasChildNodes()) {
      node.childNodes.forEach(childNode => {
        return this.clearExistingStyles(childNode, style);
      });
    }
    return node;
  }

  public removeNodesWithEmptyStyles(node: Node): Node {
    if (node.nodeName === "#text") return node;
    if (node.hasChildNodes()) {
      node.childNodes.forEach(childNode => {
        return this.removeNodesWithEmptyStyles(childNode);
      });
    }
    if (node.nodeName === "SPAN") {
      const element: HTMLSpanElement = node as HTMLSpanElement;
      if (element.style.length > 0 || element.className !== "") return node;
      const innerText = element.textContent;
      if (innerText) {
        if (node.hasChildNodes()) {
          for (let index = node.childNodes.length -1; index >= 0; index--) {
            const childNode = node.childNodes[index];
            const cloneNode = childNode.cloneNode(true);
            if (node.nextSibling) {
              node.parentNode!.insertBefore(cloneNode, node.nextSibling);
            } else {
              node.parentNode!.append(cloneNode);
            }
          }
        }
      }
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }
    return node;
  }

  public getStylesFromNode(node: Node): Style[] {
    if (!node) return [];
    if (node.nodeName !== "SPAN") return [];
    const element = node as HTMLElement;
    const styles: Style[] = [];
    for (let index = 0; index < element.style.length; index++) {
      element.style.getPropertyValue("0");
      const styleName = element.style.item(index);
      const value: string = element.style.getPropertyValue(styleName);
      const style: Style = { style: styleName, value: value };
      styles.push(style);
    }
    return styles;
  }

  public getStylesFromNodeHeirarchy(
    startNode: Node,
    ultimateParentNode: Node
  ): Style[] {
    const styles: Style[] = [];
    if (!startNode) return styles;
    styles.push(...this.getStylesFromNode(startNode));
    if (startNode.isEqualNode(ultimateParentNode)) return styles;
    if (startNode.parentNode)
      styles.push(
        ...this.getStylesFromNodeHeirarchy(
          startNode.parentNode,
          ultimateParentNode
        )
      );
    return styles;
  }

  public getClassesFromNode(node: Node): string {
    if (node.nodeName !== "SPAN") return "";
    return (node as HTMLElement).className;
  }

  public getClassesFromNodeHiearchy(startNode: Node, ultimateParentNode: Node): string {
    if (!startNode) return "";
    let className = this.getClassesFromNode(startNode);
    if (startNode.isEqualNode(ultimateParentNode)) return className.trim();
    if (startNode.parentNode) {
      className += ` ${this.getClassesFromNodeHiearchy(
        startNode.parentNode,
        ultimateParentNode
      )}`;
    }
    return className.trim();
  }
}
