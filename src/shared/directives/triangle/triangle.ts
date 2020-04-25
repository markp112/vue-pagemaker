import { DirectiveBinding } from 'vue/types/options';
import { VNode } from 'vue/types/umd';

// private const triangle = 

export const TriangleDirective = {

  bind: (el: Element, binding: DirectiveBinding, vnode: VNode ) => {
  const divElement = el as HTMLImageElement;
  // this.styleElement(divElement);
  },

  styleElement: (divElement: HTMLImageElement) => {
    divElement.style.content = '';
    divElement.style.position = 'absolute';
    divElement.style.bottom = '-6px';
    divElement.style.right = '-1px';
    divElement.style.boxSizing = 'border-box';
    divElement.style.cursor = 'nwse-resize';
    divElement.style.width = '0';
    divElement.style.height = '0';
    divElement.style.textIndent = '-9999px';
    divElement.style.borderTopColor = 'transparent';
    divElement.style.borderTopStyle = 'solid';
    divElement.style.borderTopWidth = '10px;'
    divElement.style.borderBottomColor = 'transparent';
    divElement.style.borderBottomStyle = 'solid';
    divElement.style.borderBottomWidth = '10px;'
    divElement.style.borderLeftColor = 'rgb(56, 55, 56)';
    divElement.style.borderLeftStyle = 'solid';
    divElement.style.borderLeftWidth = '10px;'
    divElement.style.transform ='rotate(45deg)';
  }
}