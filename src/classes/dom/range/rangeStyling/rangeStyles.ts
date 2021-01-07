import { Style } from "@/models/styles/styles";
import { ClassOrStyle } from "../range-base";

export class RangeStyles {

  
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

}