import { Style } from "@/models/styles/styles";

export type StyleOwner = 'Parent' | 'Sibling' | 'selectedNode';
export type StyleType = 'class' | 'style';

interface NodeStyle {
  owner: StyleOwner;
  style: Style;
  type: StyleType;
}

export class CurrentStyling {
  styles: NodeStyle[] = [];
  
  clear() {
    this.styles = [];
  }

  private createStyle(styleName: string, value: string): Style {
    const style: Style = { 
      style: styleName,
      value: value
    };
    return style;
  }

  private addNodeStyle(styleName: string, value: string, owner: StyleOwner, type: StyleType) {
    const nodeStyle: NodeStyle = {
      owner: owner,
      type: type,
      style: this.createStyle(styleName, value),
    }
    this.styles.push(nodeStyle);
  }

  public setStylesFromNode(node: Node, owner: StyleOwner) {
    if (node.nodeName !=='SPAN') return [];
    const element = node as HTMLElement;
    for (let index = 0; index < element.style.length; index++) {
      const styleName = element.style.item(index);
      const value: string = element.style.getPropertyValue(styleName);
      this.addNodeStyle(styleName, value, owner, 'style');
    }
  }

  public setStylesFromNodeHeirarchy(startNode: Node, ultimateParentNode: Node, owner: StyleOwner) {
    if (!startNode) return;
    this.setStylesFromNode(startNode, owner);
    if (startNode.isEqualNode(ultimateParentNode)) return;
    if (startNode.parentNode) this.setStylesFromNodeHeirarchy(startNode.parentNode, ultimateParentNode,owner);
  }

  public setClassesFromNode(node: Node, owner: StyleOwner) {
    if (node.nodeName !== 'SPAN') return;
    const className: string = (node as HTMLElement).className;
    if (className.replace(' ','') !== '') {
      this.addNodeStyle(className, className, owner, 'class');
    }
  }

  public setClassesFromNodeHiearchy(startNode: Node, ultimateParentNode: Node, owner: StyleOwner) {
    if (!startNode) return '';
    this.setClassesFromNode(startNode, owner);
    if (startNode.isEqualNode(ultimateParentNode)) return;
    if (startNode.parentNode) {
      this.setClassesFromNodeHiearchy(startNode.parentNode, ultimateParentNode, owner);
    } 
  }

  public getStyles(owner: StyleOwner, styleType: StyleType): Style[] | string;
  
  public getStyles(owner: StyleOwner, styleType: StyleType, styleFilter?: string): Style[] | string;
  
  public getStyles(owner: StyleOwner, styleType: StyleType, styleFilter?: string): Style[] | string {
    if (styleType === 'style') return this.getTheStyles(owner, styleFilter);
    return this.getClasses(owner, styleFilter);
  }

  private getTheStyles(owner: StyleOwner, styleFilter?: string): Style[] {
    const style: Style[] = [];
    this.styles.filter(nodeStyle => nodeStyle.owner === owner && nodeStyle.type === 'style')
      .forEach(nodeStyle => {
        if (styleFilter) {
          if (nodeStyle.style.style === styleFilter) {
            style.push(nodeStyle.style);
          }
        } else {
          style.push(nodeStyle.style);
        }
      });
    return style;
  }

  private getClasses(owner: StyleOwner, styleFilter?: string): string {
    let className = '';
    this.styles.filter(nodeStyle => nodeStyle.owner === owner && nodeStyle.type === 'class')
      .forEach(nodeStyle => {
        if (styleFilter) {
          if (nodeStyle.style.style !== styleFilter) {
            className += `${nodeStyle.style.style} `;
          }
        } else {
            className += `${nodeStyle.style.style} `;
        }
      });
    return className;
  }
}