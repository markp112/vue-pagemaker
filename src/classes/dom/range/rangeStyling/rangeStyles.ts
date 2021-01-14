import { Style } from "@/models/styles/styles";
import { ClassOrStyle } from "../range-base";

export class RangeStyles {
  getStylesFromNodeHeirarchy(node: Node, nodeWithUnderline: Node): Style[] {
    console.log('%c%s', 'color: #5200cc', node.nodeName);
    const styles: Style[] = [];
    if (!node) return styles;
    styles.push(...this.getStylesFromNode(node));
    console.log('%c⧭', 'color: #607339', styles);
    if (node.isEqualNode(nodeWithUnderline)) return styles;
    if (node.parentNode) styles.push(...this.getStylesFromNodeHeirarchy(node.parentNode, nodeWithUnderline));
    return styles;
  }
  
  public isStyleTag(classOrStyle: ClassOrStyle): boolean {
    return classOrStyle === 'style';
  }

  public setStyleOrClass(node: Node, style: Style, classOrStyle: ClassOrStyle ): Node {
    if (this.isStyleTag(classOrStyle)) {
      return this.setStyle(node, style);
    } else {
      return this.setClass(node, style);
    }
  }

  public setStyles(node: Node, styles: Style[]): Node {
    styles.forEach(style => {
      this.setStyle(node, style);
    })
    return node;
  }

  public setStyle(node: Node, style: Style): Node {
    const element = node as HTMLElement;
    element.style.setProperty(style.style, style.value);
    return node;
  }
  
  public setClass(node: Node, style: Style): Node;

  public setClass(node: Node, style: string): Node;
  
  public setClass(node: Node, styleOrString: string | Style): Node {
    const element = node as HTMLElement;
    if (typeof(styleOrString) === 'string' ) {
      element.className += ` ${styleOrString}`;
    } else {
      element.className += ` ${styleOrString.style} ${styleOrString.value}`;
    }
    return node;
  }

  public clearExistingClasses(node: Node, style: Style): Node {
    if (node.hasChildNodes()) {
      node.childNodes.forEach(node => {
       return this.clearExistingClasses(node, style);
      })
    }
      // each class will have a style name (which does nothing)
      // followed by the actual Tailwind class
      // style.style is used to identify if there is already 
      // a style defined of the same class family e.g. font weight
      const element: HTMLElement = node as HTMLElement;
      if (element.className) {
        if (element.className.includes(style.style)) {
          const classes = element.className.split(' ');
            let itemPos = 0;
            classes.forEach((item, index) => {
              if (item === style.style) {
                itemPos = index;
              }
            })
            classes[itemPos] = '';
            classes[itemPos + 1] = '';
            element.className = classes.filter(item => item !== '').join(' ');
        }
      }
    return node;
  }

  public clearExistingStyles(node: Node, style: Style): Node {
    if (node.nodeName === '#text') return node;
    if (node.hasChildNodes()) {
      node.childNodes.forEach(node => {
        return this.clearExistingStyles(node, style)
      });
    }
    const element: HTMLElement = node as HTMLElement;
    element.style.removeProperty(style.style);
    return node;
  }

  public removeNodesWithEmptyStyles(node: Node): Node {
    if (node.nodeName === '#text') return node;
    if (node.hasChildNodes()) {
      node.childNodes.forEach(childNode => {
        return this.removeNodesWithEmptyStyles(childNode);
      });
    }
    if (node.nodeName === 'SPAN') {
      const element: HTMLSpanElement = node as HTMLSpanElement;
      if (!element) return node;
      const innerText = element.textContent;
      if (element.style.length > 0 || element.className !== '') return node;
      if (innerText) {
        if (element.previousSibling) {
          element.previousSibling.textContent += innerText;
        } else if (element.nextSibling) {
          element.nextSibling.textContent = `${innerText}${element.nextSibling.textContent}`;  
        }
        if (element.parentNode) {
          element.parentNode.textContent += innerText;
        }
      }
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }
    return node;
    
  }

  public getStylesFromNode(node: Node): Style[] {
    const element = node as HTMLElement;
    const styles: Style[] = []; 
    for (let index = 0; index < element.style.length; index++) {
      const styleName = element.style.getPropertyValue(index.toString());
      const value: string = element.style.getPropertyValue(styleName);
      const style: Style = {style: styleName, value: value};
      styles.push(style);
    }
    console.log('%c⧭', 'color: #40fff2', styles);
    return styles;
  }
}