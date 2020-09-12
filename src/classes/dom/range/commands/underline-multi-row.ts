/**
 * @description : if the entire selection is underlined remove it otherwise underline the selection taking into account parts may aleady be underlined
 * 
 */

import { HTMLTags } from '../range-base';
import { MultiRowBase } from '../../multi-row-base';
import { Style } from '@/models/styles/styles';

 export class MultiRowUnderline extends MultiRowBase {
   
    private isUnderlined = false;
    private hasTextNode = false;
    private hasSpanNodeNoUnderline = false;
    private underline: Style = {
      style: 'textDecoration',
      value: 'underline',
    };


    constructor(range: Range) {
      super(range);
    }

    public process(htmlTag: HTMLTags) {
      if (!this.rangeValues) { throw new Error('RH: range values not set')};
      this.fragment = this.range.extractContents();
      const node: ParentNode = this.fragment as ParentNode;
      console.log('%c⧭', 'color: #733d00', node);
     
      
      this.isUnderlined = this.checkForUnderline(node);
      console.log('%c%s', 'color: #00b300', this.isUnderlined);
      if (this.isUnderlined) {
        this.hasTextNode = this.checkForTextNode(node);
      }
      if (!this.hasTextNode) {
        this.hasSpanNodeNoUnderline = this.checkForSpanNodeWithoutUnderline(node);
      }
      console.log('%c%s', 'color: #00bf00', this.isUnderlined);
      console.log('%c%s', 'color: #0088cc', this.hasSpanNodeNoUnderline);
      console.log('%c%s', 'color: #917399', this.hasTextNode);
      (this.isUnderlined && !this.hasSpanNodeNoUnderline && !this.hasTextNode) 
        ? this.removeUnderline(node) :
        this.addUnderline(node, htmlTag);

    }

    /**
     * @description check if there is an underline class present on any of the child nodes of the parent
     * @param parentNode 
     */
    private checkForUnderline(node: ParentNode): boolean {
      for (let index = 0; index < node.childElementCount; index++) {
        const parentNode = node.children[index];
        return this.findUnderlineInChildren(parentNode);
      }
      return false;
    }

    private findUnderlineInChildren(parentNode: Node): boolean {
      for (let index = 0; index < parentNode.childNodes.length; index++) {
        const childNode = parentNode.childNodes[index];
        console.log('%c⧭', 'color: #e50000', childNode);
        if (childNode.nodeName === 'SPAN') {
          const spanElement = childNode as HTMLSpanElement;
          console.log('%c⧭', 'color: #ffa640', spanElement);
          if (spanElement.className.includes('underline')) {
            console.log("true")
            return true;
          }
        }
        if (childNode.hasChildNodes()) {
          return this.findUnderlineInChildren(childNode);
        }
      }
      return false;
    }

    /**
     * @description check for the presence of text node in the first children of each 
     * @param parentNode 
     */
    private checkForTextNode(node: ParentNode): boolean {
      for (let index = 0; index < node.childElementCount; index++) {
        const parentNode = node.children[index];
        for (let index = 0; index < parentNode.childNodes.length; index++) {
          const childNode = parentNode.childNodes[index];
          if (childNode.nodeName === '#text') {
              return true;
          }
        }
      }
      return false;
    }
    
    /**
     * @description check if there are any span nodes at the first level of child nodes for
     *  that node do not have a class underline
     * 
     * @param parentNode 
     */
    private checkForSpanNodeWithoutUnderline(node: ParentNode): boolean {
      for (let index = 0; index < node.childElementCount; index++) {
        const parentNode = node.children[index];
        for (let index = 0; index < parentNode.childNodes.length; index++) {
          const childNode = parentNode.childNodes[index];
          if (childNode.nodeName === 'SPAN') {
              if (!(childNode as HTMLSpanElement).className.includes('underline')) {
                return true;
              }
          }
        }
      }
      return false;
    }

    private addUnderline(parentNode: ParentNode, htmlTag: HTMLTags) {
      console.log("Add underline called")
      if (this.isUnderlined) {
        this.addUnderlineToSegment(parentNode, htmlTag);
      } else {
        this.addUnderlineToSelection(parentNode, htmlTag)
      }
    }

   addUnderlineToSelection(parentNode: ParentNode, htmlTag: HTMLTags) {
    console.log('%c%s', 'color: #1d5673','addUnderlineToSelection');
    this.applyStyle(htmlTag, this.underline, 'class');
    this.reInsertNodes();
   }

   private addUnderlineToSegment(parentNode: ParentNode, htmlTag: HTMLTags) {
    // find the text or span nodes at the first level under the paragraph tags
    // and apply underline style to them
    // - if the node is a text node append the text to the span node
    // - if the node is a span node append it to the span node as a child
    // 
    console.log("segment")
   }

    private removeUnderline(parentNode: ParentNode) {
      console.log("remove underline called")
    }
 }