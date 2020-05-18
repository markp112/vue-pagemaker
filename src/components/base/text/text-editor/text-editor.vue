<template>
  <div class="w-9/12 h-32 border border-gray-100 z-50 shadow-lg">
    <div 
      class="w-full sidebar-button-panel"
      ref="text-editor-toolbar"
    >
    <span
      @click="reset"
      class="bg-gray-500 cursor-pointer hover:text-red-600"
    >
      Reset
    </span>
      <font-select @onFontClick="changeFont"></font-select>
    </div>
    <p
      id="texteditorcontent"
      class="bg-gray-200 h-full"
      contenteditable="plaintext-only"
      ref="texteditorcontent"
      data-editor="textContent"
      @mouseup="getSelection"
      @mouseout="getSelection"
    >
    
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import FontSelect from '@/components/base/pickers/font-selector/font-selector.vue';
import { ComponentCounter } from '@/classes/component-counter/singleton-counter';
import { Style } from '../../../../models/styles/styles';

interface NodeDataInterface {
  type: HTMLTags,   // type of node to create
  content: string,  // content for the node
  attribute: Style | null, // style attributes e.g. font-family 
}

class NodeData implements NodeDataInterface {
  _type: HTMLTags;
  _content: string;
  _attribute: Style | null;

  constructor(type: HTMLTags, content: string, attribute?: Style) {
    this._type = type;
    this._content = content;
    this._attribute = attribute === undefined ? null : attribute;
  }

  get type(): HTMLTags {
    return this._type;
  }

  get content(): string {
    return this._content;
  }

  get attribute(): Style | null {
    return this._attribute;
  }

}


type HTMLTags = 'span'| 'p' | 'b' | 'u' | 'i' | 'text';

@Component({
  components: {
    'font-select': FontSelect,
  },
  props: {
    content: { default: '' },
  }
})
export default class TextEditor extends Vue {
  name = 'text-editor';
  localContent = '';
  // activeSelection: SelectedText | null = null;
  currentSelection: Selection | null = null;
  range: Range | null = null;
  componentCounter = new ComponentCounter();

  mounted() {
    this.localContent = this.$props.content;
    const textEditor: HTMLParagraphElement = this.$refs.texteditorcontent as HTMLParagraphElement;
    textEditor.innerText = this.localContent;
  }
  reset() {
    const p = this.getContentRef();
    p.innerHTML =  this.$props.content;
    
  }

  saveCurrentRange(){
      const selection: Selection | null = window.getSelection ? window.getSelection() : document.getSelection();
      const content: HTMLParagraphElement = this.getContentRef();
      if (!selection || !content) {
        return;
      }
      for (let i = 0; i < selection.rangeCount; i++) {
        const range = selection.getRangeAt(0);
        let start: Node | null = range.startContainer;
        let end: Node | null= range.endContainer;
        // for IE11 : node.contains(textNode) always return false
        start = start.nodeType === Node.TEXT_NODE ? start.parentNode : start;
        end = end.nodeType === Node.TEXT_NODE ? end.parentNode : end;
        if (content.contains(start) && content.contains(end)) {
          this.range = range;
          break;
        }
      }
    }

    restoreSelection() {
      const selection: Selection | null = window.getSelection ? window.getSelection() : document.getSelection();
      if (!selection) return;
      selection.removeAllRanges();
      if (this.range) {
        selection.addRange(this.range);
      }
       // else {
      //   const content = this.getContentRef();
      //   const row = RH.prototype.newRow({br: true})
      //   const range = document.createRange()
      //   content.appendChild(row)
      //   range.setStart(row, 0)
      //   range.setEnd(row, 0)
      //   selection.addRange(range)
      //   this.range = range
      // }
    }

    getNewId(tag: string): string {
      return `${tag}-${this.componentCounter.getNextCounter()}`;
    }

  splitRange(range: Range, htmlTag: HTMLTags, style: Style): NodeData[] {
    const nodeData: NodeData[] = [];
    if (range.commonAncestorContainer.textContent) {
      const content = range.commonAncestorContainer.textContent;
      if (range.startOffset === 0 && range.endOffset === content.length) {
        const newNode: NodeData = new NodeData( htmlTag, content, style);
        nodeData.push(newNode);
      } else {
        let newNode: NodeData;
        const startOfContent = content.substring(0, range.startOffset);
        newNode = new NodeData('text', startOfContent)
        nodeData.push(newNode);
        const styledContent: string = content.substring(range.startOffset, range.endOffset);
        newNode = new NodeData(htmlTag, styledContent, style);
        nodeData.push(newNode);
        if (range.endOffset !== content.length) {
          const endOfContent = content.substring(range.endOffset, content.length);
          newNode = new NodeData('text', endOfContent);
          nodeData.push(newNode);
        }
      }
    }
    return nodeData;
  }

  createElement(HtmlTag: HTMLTags, range: Range, style: Style): HTMLElement | null {
    if (range) {
      const newElement: HTMLElement = document.createElement(HtmlTag);
      newElement.style.fontFamily = style.value;
      const currentText = `${range.commonAncestorContainer.textContent}` ;
      const start = range.startOffset;
      const end = range.endOffset;
      newElement.innerText = currentText.slice(start, end);
      newElement.id = this.getNewId(HtmlTag);
      return newElement;
      // const length = currentText.length;
      // if (currentText) {
      //   const newContent = [ 
      //     currentText.slice(0, start),
      //     openingTag,
      //     currentText.slice(start, end),
      //     closingTag,
      //     currentText.slice(end, length)
      //   ].join('');
      //   return newContent;
      // }
    }
    return null;
  }

  getTheTextEditorNode(node: Node): Node | null {
    const element: HTMLElement = node as HTMLElement;
    if (element.id !== 'texteditorcontent')  {
      if (node.parentNode) this.getTheTextEditorNode(node.parentNode) 
      else return null;
    }
    console.log('%c⧭', 'color: #99adcc', node)
    return node;
  }

  findchildNode(node: Node, id: string): Node | null {
    let isFound = false;
    while (node.childNodes.length > 0 && isFound === false) {
      if ((node as HTMLElement).id === id) {
        isFound = true;
        console.log("the found node =", node)
        return node;
      }
    }
    return null;
  }

    getIndexToStyledNode(childNodes: NodeList, nodeToFind: Node): number {
      let matchedIndex = -1;
      childNodes.forEach((element: Node, index) => {
        if (element.nodeValue === nodeToFind.nodeValue) {
            matchedIndex = index;
            
        }
      });
      return matchedIndex;
    }

  createNodesInDom(nodeData: NodeData[], range: Range) {
    console.log('%c⧭', 'color: #364cd9', nodeData)
    if (nodeData.length === 0) return;

    const parentNode: Node | null = range.commonAncestorContainer.parentNode;
    if (parentNode) {
      if (parentNode.childNodes.length > 0) {
        let selectedIndex = this.getIndexToStyledNode(parentNode.childNodes, range.commonAncestorContainer);
        console.log('%c%s', 'color: #33cc99', selectedIndex)
        const childNode: ChildNode = parentNode.childNodes.item(selectedIndex);
        parentNode.removeChild(childNode);
        nodeData.forEach(node => {
          const newNode: HTMLElement = document.createElement(node.type);
          if (node.attribute) {
            newNode.style.fontFamily = node.attribute.value;
          }
          newNode.innerText = node.content;
          parentNode.insertBefore(newNode,parentNode.childNodes[selectedIndex])
          selectedIndex++;
        })
      } else {
        nodeData.forEach(node => {
          const newNode: HTMLElement = document.createElement(node.type);
          if (node.attribute) {
            newNode.style.fontFamily = node.attribute.value;
          }
          newNode.innerText = node.content;
          parentNode.appendChild(newNode)
        })
      }
    }
  }


  // addElementToDom(nodeToAdd: Node, range: Range) {
  //   console.log('%c⧭', 'color: #e5de73', nodeToAdd, "childnode to add")
  //   const parentNode: Node | null = range.commonAncestorContainer.parentNode;
  //   console.log('%c⧭', 'color: #00ff88', parentNode, "parentNode")
  //   if (parentNode) {
  //     if ((parentNode as HTMLElement).id === 'texteditorcontent' && parentNode.childNodes.length === 1) {
  //       console.log("parent node")
  //         const currentContent = (parentNode as HTMLElement).innerText;
  //         const contentStart = currentContent.slice(0, range.startOffset);
  //         const contentEnd = currentContent.slice(range.endOffset, currentContent.length);
  //         (parentNode as HTMLElement).innerText = contentStart;
  //         parentNode.appendChild(nodeToAdd);
  //         const childNode = document.createTextNode(contentEnd);
  //         parentNode.appendChild(childNode);
  //       }
  //     else {
  //       console.log("child nodes")
  //         const selectedNode: Node = range.commonAncestorContainer;
          
  //         let selectedNodeIndex = -1;
  //         parentNode.childNodes.forEach((element: Node, index) => {
  //           console.log('%c%s', 'color: #994d75', element)

  //           if (element.nodeValue === range.commonAncestorContainer.nodeValue) selectedNodeIndex = index;

  //           // gte the index use this to insert before on the child nodes
  //           // 
  //         });
  //           console.log('%c%s', 'color: #7f2200', selectedNodeIndex, "selectedNodeIndex")
  //         if (selectedNodeIndex !== -1) {
  //           // parentNode.childNodes[selectedNodeIndex].remove;
  //           parentNode.replaceChild(nodeToAdd, parentNode.childNodes[selectedNodeIndex] );
  //         }
  //       }
  //     }
  //   }
    

  

  // insertStyledContent(styledContent: string , range: Range): string | null {
  //   console.log('%c⧭', 'color: #408059', range)
  //   const rootNode = this.findNode(range.commonAncestorContainer,'textEditorContent')
  //   if (rootNode) {
  //     console.log("rootNode", rootNode)
  //     const newElement: HTMLElement = document.createElement('span');
      
  //   }
  //   // const content: HTMLParagraphElement = this.getContentRef();
  //   // const currentText = content.innerHTML;
  //   // console.log('%c%s', 'color: #731d6d', currentText,"current text =")
  //   // const parent: Node | null = range.commonAncestorContainer.parentNode;
  //   // console.log('%c%s', 'color: #735656', range.commonAncestorContainer.parentNode)
  //   // if (parent) {
  //   //   console.log("parent = ",parent);
  //   //   (parent as HTMLElement).innerHTML = styledContent;
  //   //   console.log("parent innerHtml", (parent as HTMLElement).innerHTML);
  //   //   const editorNode: Node | null = this.getTheTextEditorNode(parent);
  //   //   console.log('%c⧭', 'color: #807160', editorNode, 'editorNode')
  //   //   // const childNode = document.createElement('span');
  //   //   // // childNode.innerHTML = styledContent;
  //   //   // console.log("childNode", childNode);
  //   //   // console.log("childnode ID", childNode.id);
  //   //   console.log("parent html=", parent)
  //   //   // parent.replaceChild(childNode, parent.childNodes[0]);
      
      
  //   //   if (editorNode) {
  //   //     return (editorNode as HTMLElement).innerHTML;
  //   //   }
  //   // }
  //   return '';
  // }

  getSelection() {
    this.saveCurrentRange();
    console.log("range", this.range)
  }

getContentRef(): HTMLParagraphElement {
  return this.$refs.texteditorcontent as HTMLParagraphElement;
}

changeFont(font: string) {
  const id = this.componentCounter.getNextCounter();
  const style: Style = { style: 'font-family', value: font };
  const content: HTMLParagraphElement = this.getContentRef();
  const currentText = content.innerText;

  if (this.range) {

    const nodeData: NodeData[] = this.splitRange(this.range, 'span', style);
    this.createNodesInDom(nodeData, this.range);

    // const element: HTMLElement | null = this.createElement('span', this.range, style);
    // const editorNode: Node | null = this.getTheTextEditorNode(this.range.commonAncestorContainer);
    // console.log("editor Node", editorNode)
    // this.addElementToDom((element as Node), this.range);

    // const newContent: string | null = this.insertStyledContent(styledContent, this.range);

    // content.innerHTML = newContent === null ? currentText : newContent;
  }

  
  this.restoreSelection();



  // const element: HTMLDivElement = this.$refs.texteditorcontent as HTMLDivElement;
  // if (this.activeSelection) {
  //   const content = [element.innerHTML.slice(0, this.activeSelection.start), style, element.innerHTML.slice(this.activeSelection.end),'</span>'].join('');
  //   this.localContent = content
  // } else {

  //   this.localContent = `<span style="font-family:${font}">${element.innerHTML}</span>`
  // }
}

get textContent(): string {
  return this.localContent;
}
}
</script>