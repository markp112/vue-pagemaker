import { Style } from '@/models/styles/styles';

type HTMLTags = 'span'| 'p' | 'b' | 'u' | 'i' | 'text';
type ComponentType =  Vue | Element | Vue[] | Element[] 

export class RH {
  private _range: Range | null = null;
  
  set range(range: Range | null) {
    this._range = range;
  }

  get range(): Range | null {
    return this._range;
  }

  public applyStyle(style: Style, htmlTag: HTMLTags, rootComponent: ComponentType) {
    if (!this._range) throw new Error('RH: Range not set');
    const fragment: DocumentFragment = this._range.extractContents();
    const nodeList: NodeList = fragment.querySelectorAll(htmlTag);
    const existingStyles: Style[] = this.getExistingStylesOpeningTag(nodeList, style.style);
    // remove any existing styles for the style we are adding as the new style would apply to the whole range
    this.clearExistingStyles(nodeList, style.style, htmlTag);
    const wrapperNode: HTMLElement = this.getNewWrapperNode(htmlTag, style);
    this.addBackExistingStyles(wrapperNode, existingStyles);
    this.mergeElementStyleContent(fragment);
    wrapperNode.appendChild(fragment);
    this._range.insertNode(wrapperNode);
    // this.cleanEmptyTagsFromNodeList((rootComponent as Node).childNodes);
  }

  private getExistingStylesOpeningTag(nodeList: NodeList, styleName: string): Style[] {
    const node: HTMLElement = (nodeList[0] as HTMLElement);
    const styles: Style[] = [];
    if (node) {
      if (node.style.length > 0) {
        for (let index = 0; index < node.style.length; index++) {
          const existingStyle = this.getStyleName(node.style[index]);
          if (existingStyle !== styleName) {
            const style: Style = {
              style: existingStyle,
              value: this.getStyleProperty(node, existingStyle)
            }
            styles.push(style);
          }
        }
      }
    }
    return styles;
  }

  private getStyleProperty(element: HTMLElement, styleName: string): string {
    for (const key in element.style) {
      if (key === styleName) {
        return element.style[key];
      }
    }
    return '';
  }

  private getNewWrapperNode(htmlTag: HTMLTags, style: Style): HTMLElement {
    const newNode: HTMLElement = document.createElement(htmlTag);
    this.setStyle(newNode, style.style, style.value);
    return newNode;
  }

  private addBackExistingStyles(element: HTMLElement, existingStyles: Style[]) {
    if (existingStyles.length === 0) return;
    existingStyles.forEach(style => {
      this.setStyle(element, style.style, style.value);
    })
  }

  private clearExistingStyles(nodeList: NodeList, styleName: string, htmlTag: HTMLTags): void {
    if (nodeList) {
      nodeList.forEach(node => {
        if (node.nodeName !== '#text') {
          if (node.hasChildNodes()) this.clearExistingStyles(node.childNodes, styleName, htmlTag);
          const element: HTMLElement = node as HTMLElement;
          if (element.style.length > 0) {
            this.setStyle(element, styleName, '');
          }
        }
      })
    }
  }

  private setStyle(element: HTMLElement, styleName: string, value: string): void {
    for (const key in element.style) {
      if (key === styleName) {
        element.style[key] = value;
        break;
      }
    }
  }

  getStyleName(style: string): string {
    if (!style.includes('-')) return style;
    const words: string[] = style.split('-');
    for (let index = 1; index < words.length; index++ ) {
      words[index] = words[index][0].toUpperCase() + words[index].substr(1);
    }
    return words.join('');
  }

  private cleanEmptyTagsFromNodeList(nodeList: NodeList): void {
    nodeList.forEach(node => {
      if (node.nodeType === 1) {
        if (node.hasChildNodes()) {
          this.cleanEmptyTagsFromNodeList(node.childNodes);
        }
        const htmlElement: HTMLElement = (node as HTMLElement);
        if (htmlElement.style.length < 2 && htmlElement.innerHTML.length === 0) {
          (node as ChildNode).remove();
        } 
        if (htmlElement.innerHTML.length === 0 && node.nodeName === 'SPAN')
          (node as ChildNode).remove();
        }
    })
  }

  private mergeElementStyleContent(fragment: ParentNode): void {
    const nodeList: NodeList = fragment.querySelectorAll('span');
    nodeList.forEach(element => {
      if ((element as HTMLElement).style.length < 2) {
        const previousNode = element.previousSibling;
        const content = (element as HTMLElement).innerText;
        if (previousNode) {
          previousNode.textContent += content;
        } else {
          // (element.parentNode as HTMLElement).innerText += content;
          if (element.parentNode) {
            if(element.parentNode.textContent !== content) {
              element.parentNode.textContent += content
            } else {
              element.parentNode.textContent = content;
            }
          }
        }
        (element as ChildNode).remove()
      }
    })
  }

}