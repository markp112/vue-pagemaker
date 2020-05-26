import { Style } from '@/models/styles/styles';
import { Site } from '@/models/sites/site';
import { text } from '@fortawesome/fontawesome-svg-core';

type HTMLTags = 'span' | 'p' | 'b' | 'u' | 'i' | 'text' | 'undefined';
type ComponentType = Vue | Element | Vue[] | Element[]
interface KeyValueString {
  [key: string]: HTMLTags;
}
export class RH {
  private _range: Range | null = null;

  set range(range: Range | null) {
    this._range = range;
    console.log('%c⧭', 'color: #00e600', this._range);
  }

  get range(): Range | null {
    return this._range;
  }

  public applyStyle(style: Style, htmlTag: HTMLTags, rootComponent: ComponentType) {
    if (!this._range) throw new Error('RH: Range not set');
    const firstNodeType : HTMLTags = this.getFirstNodeType();
    console.log('%c%s', 'color: #00a3cc', firstNodeType);
    const parentNodeType: HTMLTags = this.getParentNodeType();
    console.log('%c%s', 'color: #aa00ff', parentNodeType);
    let wrapperNode: HTMLElement;
    const evaluateType = this.evaluateSelectionType(firstNodeType, parentNodeType);
    if (evaluateType === 'wrapper'){
      wrapperNode = this.getTheWrapperNode(firstNodeType, parentNodeType)
      this.handleWrapperNode(wrapperNode, firstNodeType, parentNodeType, style, htmlTag);
    } else {
      this.handleFragment(style, htmlTag);
    }
    // const nodeList = (rootComponent as Node).childNodes;
    // this.cleanEmptyTagsFromNodeList(nodeList);
    // this.mergeElementStyleContent(nodeList);
  }

  private evaluateSelectionType(firstNodeType: HTMLTags, parentNodeType: HTMLTags): string {
    if (!this._range) throw new Error('RH: Range not set');
    if (firstNodeType === 'text' && parentNodeType === 'span') {
      return 'fragment'
    }
    if (!this._range.commonAncestorContainer.hasChildNodes() && firstNodeType === 'text') {
      return 'wrapper';
    }
    if (parentNodeType === 'undefined' && firstNodeType === 'p') {
      return 'wrapper';
    }
    return 'fragment';
  }


  private handleFragment(style: Style, htmlTag: HTMLTags) {
    if (!this._range) throw new Error('RH: Range not set');
    const fragment: DocumentFragment = this._range.extractContents();
    console.log(fragment);
    const hasChildNodes = this._range.commonAncestorContainer.hasChildNodes()
    const wrapperNode: HTMLElement = this.getFragmentWrapperNode(htmlTag, fragment);
    console.log('%c⧭', 'color: #ffa640', wrapperNode);

    if ((fragment as ParentNode).childElementCount > 0 ) {
      const nodeList = fragment.querySelectorAll('span');
      nodeList.forEach(node => {
        this.clearExistingStyles(node, style.style, htmlTag);
      });
    }
    this.setStyle(wrapperNode, style.style, style.value);
    // if (this._range.commonAncestorContainer.nodeName !== 'SPAN') {
    if (!hasChildNodes) wrapperNode.appendChild(fragment)
    // }
    this._range.insertNode(wrapperNode);
  }

  private handleWrapperNode(wrapperNode: HTMLElement, firstNodeType: HTMLTags, parentNodeType: HTMLTags, style: Style, htmlTag: HTMLTags) {
    if (!this._range) throw new Error('RH: Range not set');
    if (firstNodeType === 'span') {
      this.clearExistingStyles(wrapperNode, style.style, htmlTag);
    }
    if (this._range.commonAncestorContainer.hasChildNodes()) {
      this.clearExistingStyles(this._range.commonAncestorContainer, style.style, htmlTag);
    }
    const fragment: DocumentFragment = this._range.extractContents();
    const nodeList: NodeList = fragment.querySelectorAll('span');
    console.log('%c⧭', 'color: #917399', wrapperNode);

    if (nodeList.length > 0 ) {
      const element: HTMLElement = nodeList[0] as HTMLElement;
      console.log('%c%s', 'color: #0088cc', element.style.length);
      if (element.style.length < 1) {
        const content = element.innerText;
        (element as ChildNode).remove();
        wrapperNode.innerText = content;
      }
    }
    
    this.setStyle(wrapperNode, style.style, style.value);
    console.log('%c⧭', 'color: #e50000', wrapperNode);
    // const nodeList = fragment.querySelectorAll('span');
    // this.cleanEmptyTagsFromNodeList(nodeList);
    // this.mergeElementStyleContent(nodeList);
    if (firstNodeType !== 'span' && parentNodeType !== 'span' && firstNodeType !== 'p') {
      wrapperNode.appendChild(fragment);
    }
    this._range.insertNode(wrapperNode);
  }


  private getFirstNodeType(): HTMLTags  {
    if(!this._range) throw new Error('Range not set');
    const nodeName = this._range.commonAncestorContainer.nodeName;
    return nodeName ? this.getTypeOfNode(nodeName) : 'undefined';
  }

  private getParentNodeType(): HTMLTags {
    if(!this._range) throw new Error('Range not set');
    const commonAncestorContainer: Node = this._range.commonAncestorContainer;
    const nodeName: string | undefined = commonAncestorContainer.parentNode?.nodeName;
    return nodeName ? this.getTypeOfNode(nodeName) : 'undefined';
    // if (nodeName === 'SPAN' && this._range.startOffset === 0) {
    //   if (commonAncestorContainer.textContent === commonAncestorContainer.parentNode?.textContent) {
    //     return 'span';
    //   }
    // }
    // return 'undefined';
  }

  private getTypeOfNode(nodeName: string): HTMLTags  {
    const nodeMap: KeyValueString = {
      '#text': 'text',
      'SPAN': 'span',
      'P': 'p',
    };
    const value: HTMLTags = nodeMap[nodeName];
    return value === undefined ? 'undefined' : value;
  }

  private getTheWrapperNode(firstNodeType: HTMLTags, parentNodeType: HTMLTags): HTMLElement {
    if(!this._range) throw new Error('Range not set');
    if (firstNodeType === 'span') {
      return this._range?.commonAncestorContainer.childNodes[0] as HTMLElement;
    }
    if (parentNodeType === 'span') {
      return this._range.commonAncestorContainer.parentNode as HTMLElement;
    }
    if (firstNodeType === 'p' && (this._range.commonAncestorContainer as HTMLElement).firstElementChild?.nodeName ==='SPAN') {
      return ((this._range.commonAncestorContainer as HTMLElement).firstElementChild as HTMLElement);
    }
    return document.createElement('span');
  }

  private getFragmentWrapperNode(htmlTag: HTMLTags, fragment: DocumentFragment): HTMLElement {
    if(!this._range) throw new Error('Range not set');
      const hasChildNodes = this._range.commonAncestorContainer.hasChildNodes();
      if (hasChildNodes) {
        const firstElementChild: NodeList = (fragment as ParentNode).querySelectorAll('span');
        console.log('%c⧭', 'color: #00b300', firstElementChild);
      if (firstElementChild) {
        return firstElementChild[0] as HTMLElement;
      }
    }
    return  document.createElement(htmlTag);

  }


  private isExistingSpanNode(nodeList: NodeList): boolean {
    if (nodeList.length === 0) return false;
    return nodeList[0].nodeName === 'SPAN' ? true : false;
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
              value: this.getStyleProperty(node, existingStyle),
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

  private getNewWrapperNode(htmlTag: HTMLTags): HTMLElement {
    return document.createElement(htmlTag);
  }

  private addBackExistingStyles(element: HTMLElement, existingStyles: Style[]) {
    if (existingStyles.length === 0) return;
    existingStyles.forEach(style => {
      this.setStyle(element, style.style, style.value);
    })
  }

  // **remove this style it is is already present on any of the selected nodes
  private clearExistingStyles(nodeList: Node, styleName: string, htmlTag: HTMLTags): void {
    if (nodeList.hasChildNodes()) {
      nodeList.childNodes.forEach(node => {
        this.clearExistingStyles(node, styleName, htmlTag)
      });
    }
    if (nodeList.nodeName === '#text') return;
    const element: HTMLElement = nodeList as HTMLElement;
    if (element.style.length > 0) {
      this.setStyle(element, styleName, '');
    }
    
    // if (nodeList) {
    //   nodeList.forEach(node => {
    //     if (node.nodeName !== '#text') {
    //       if (node.hasChildNodes()) this.clearExistingStyles(node.childNodes, styleName, htmlTag);
    //       const element: HTMLElement = node as HTMLElement;
    //       if (element.style.length > 0) {
    //         this.setStyle(element, styleName, '');
    //       }
    //     }
    //   })
    // }
  }

  private setStyle(element: HTMLElement, styleName: string, value: string): void {
    for (const key in element.style) {
      if (key === styleName) {
        element.style[key] = value;
        console.log('%c⧭', 'color: #19aedb', element, styleName, value, key,element.style[key] );
        
        break;
      }
    }
  }

  getStyleName(style: string): string {
    if (!style.includes('-')) return style;
    const words: string[] = style.split('-');
    for (let index = 1; index < words.length; index++) {
      words[index] = words[index][0].toUpperCase() + words[index].substr(1);
    }
    return words.join('');
  }

  private cleanEmptyTagsFromNodeList(nodeList: NodeList): void {
    console.log("cleanEmptyTagsFromNodeList", nodeList)
    nodeList.forEach(node => {
      if (node.nodeType === 1) {
        if (node.hasChildNodes()) {
          this.cleanEmptyTagsFromNodeList(node.childNodes);
        }
        const htmlElement: HTMLElement = (node as HTMLElement);
        console.log('%c⧭', 'color: #733d00', htmlElement);
        if (htmlElement.style.length < 2 && htmlElement.innerHTML.length === 0) {
          (node as ChildNode).remove();
        }
        if (htmlElement.innerHTML.length === 0 && node.nodeName === 'SPAN')
          (node as ChildNode).remove();
      }
    })
  }

  private mergeElementStyleContent(nodeList: NodeList): void {
    // const nodeList: NodeList = fragment.querySelectorAll('span');
    nodeList.forEach(element => {
      if (element.nodeName ==='SPAN') {
        console.log("element=", element,(element as HTMLElement).style.length )
        if ((element as HTMLElement).style.length < 1) {
          const previousNode = element.previousSibling;
          const content = (element as HTMLElement).innerText;
          if (previousNode) {
            previousNode.textContent += content;
          } else {
            // (element.parentNode as HTMLElement).innerText += content;
            if (element.parentNode) {
              if (element.parentNode.textContent !== content) {
                element.parentNode.textContent += content;
              } else {
                element.parentNode.textContent = content;
              }
            }
          }
          (element as ChildNode).remove()
        }
      }
    });
  }
}