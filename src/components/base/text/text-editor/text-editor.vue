<template>
  <div class="w-9/12 h-32 border border-gray-100 z-50 shadow-lg" v-if="show">
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
      <close-button @onClick="onCloseClick()"></close-button>
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
import ColourPicker from '@/components//base/pickers/colour-picker/colour-picker.vue';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import { Style } from '../../../../models/styles/styles';
import { SidebarModule } from '@/store/sidebar/sidebar'

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
    'close-button': CloseButton,
    'font-select': FontSelect,
    'color-picker': ColourPicker,
  },
  props: {
    content: { default: '' },
  }
})
export default class TextEditor extends Vue {
  name = 'text-editor';
  localContent = '';
  range: Range | null = null;

  mounted() {
    this.localContent = this.$props.content;
    const textEditor: HTMLParagraphElement = this.$refs.texteditorcontent as HTMLParagraphElement;
    textEditor.innerText = this.localContent;
  }

  onCloseClick(): void {
    SidebarModule.updateShowTextModal(false);
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


  checkNodeForExistingStyle(node: ParentNode, style: Style, htmlTag: HTMLTags) {
    const nodeList: NodeList = node.querySelectorAll(htmlTag);
    if (nodeList === null) return;
      nodeList.forEach(element => {
        const node: HTMLElement = element as HTMLElement;
        for (const key in node.style) {
          if (key === style.style) {
            node.style[key] = ''; 
            break;
          }
        }
      });
  }

  createNodesFromFragment(range: Range, style: Style, htmlTag: HTMLTags) {
    if(range) {
      const fragment: DocumentFragment = range.extractContents();
      this.checkNodeForExistingStyle(fragment , style, htmlTag);
      const newNode: HTMLElement = document.createElement(htmlTag);
      newNode.style.fontFamily= style.value;
      newNode.appendChild(fragment);
      range.insertNode(newNode);
    }
  }

  getSelection() {
    this.saveCurrentRange();
    console.log("range", this.range)
  }

  getContentRef(): HTMLParagraphElement {
    return this.$refs.texteditorcontent as HTMLParagraphElement;
  }

  changeFont(font: string) {
    const style: Style = { style: 'fontFamily', value: font };
    if (this.range) {
      this.createNodesFromFragment(this.range, style, 'span')
    }
    this.restoreSelection();
  }

  onColourChange(rgbColour: string) {
    const style: Style = {style: 'color', value: rgbColour}
    if (this.range) {
      this.createNodesFromFragment(this.range, style, 'span')
    }
    this.restoreSelection();
    // if(this.textBackgroundorBorder !== 'border'){
    //   const style: Style = { style: this.textBackgroundorBorder, value: rgbColour };
    //   PageModule.updateEditedComponentStyles(style);
    // } else {
    //   this.borderColour = rgbColour;
    //   if(this.borderDefintion){
    //     this.setBorderStyle(this.buildBorder(this.borderDefintion));
    //   }
    // }
  }
  get textContent(): string {
    return this.localContent;
  }

  get show(): boolean {
    return SidebarModule.showTextModal;
  }
}
</script>