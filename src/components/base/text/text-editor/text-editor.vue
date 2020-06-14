<template>
  <div class="w-9/12 h-32 border border-gray-100 z-50 shadow-lg m-0" v-if="show">
    <div class="w-full sidebar-button-panel h-12" ref="text-editor-toolbar">
      <span
        @click="reset"
        class="bg-gray-500 cursor-pointer hover:text-red-600"
      >
        Reset
      </span>
      <text-editor-controls
        @onFontWeightChange="onFontWeightChange"
        @onItalicClick="onItalicClick"
        @onUnderlineClick="onUnderlineClick"
        @onFontClick="onFontClick"
        @onFontSizeChange="onFontSizeChange"
      ></text-editor-controls>
      <indent-outdent
        @onIndentClick="onIndentClick"
        @onOutdentClick="onOutdentClick">
      </indent-outdent>
      <colour-select @onColourChange="onColourChange"></colour-select>
      <close-button @onClick="onCloseClick()"></close-button>
    </div>
    <div
      id="texteditorcontent"
      class="bg-white h-full text-editor"
      contenteditable="plaintext-only"
      ref="texteditorcontent"
      data-editor="textContent"
      @mouseup="getSelection"
      
      @keydown="onKeyDown"
      
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ColourDropdown from '@/components/base/pickers/colour-picker/colour-dropdown.vue';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import SideBarTextEditor from '../sidebar-text-editor/sidebar-text-editor.vue';
import IndentOutdent from '@/components/base//text/text-editor/indent/indent-outdent.vue';
import { Style } from '../../../../models/styles/styles';
import { SidebarModule } from '@/store/sidebar/sidebar';
// import { RH, Indents, Paragraph } from '@/classes/dom/range/rangev2';
import { Indents, Paragraph } from '@/classes/dom/range/range-base';
import { RH } from '@/classes/dom/range/RH';
import { PageModule } from '../../../../store/page/page';
import { IconPickerInterface } from '../../../../models/components/icon-picker-models';

@Component({
  components: {
    'close-button': CloseButton,
    'text-editor-controls': SideBarTextEditor,
    'colour-select': ColourDropdown,
    'indent-outdent': IndentOutdent,
  },
  props: {
    content: { default: '' },
  },
})
export default class TextEditor extends Vue {
  name = 'text-editor';
  localContent = '';
  range: Range = new Range();

  mounted() {
    this.localContent = this.$props.content;
    const textEditor: HTMLDivElement = this.$refs.texteditorcontent as HTMLDivElement;
    this.reset();
  }

  onCloseClick(): void {
    const textEditor: HTMLParagraphElement = this.$refs.texteditorcontent as HTMLParagraphElement;
    PageModule.updateEditedComponentData(textEditor.innerHTML);
    SidebarModule.updateShowTextModal(false);
  }

  reset() {
    const textEditor: HTMLDivElement = this.$refs.texteditorcontent as HTMLDivElement;
    const paraNode = document.createElement('p');
    paraNode.innerHTML = this.localContent;
    textEditor.childNodes.forEach(node => node.remove());
    textEditor.innerHTML = this.localContent;
  }

  mouseOut(event: MouseEvent) {
    console.log('%c%s', 'color: #ff0000', 'mouseOut')
    event.stopPropagation();
    this.getSelection();
  }

  onKeyDown(key: KeyboardEvent) {
    if (key.code === 'Enter') {
      this.getSelection();
      const paragraph = new Paragraph(this.range);
      paragraph.newLine();
    }
    if ( key.code === 'ArrowLeft' 
      || key.code === 'ArrowRight'
      || key.code === 'ArrowUp'
      || key.code === 'ArrowDown'
      || key.code === 'End'
      || key.code === 'Home'
      ) this.getSelection();
  }

  saveCurrentRange() {
    const selection: Selection | null = window.getSelection
      ? window.getSelection()
      : document.getSelection();
    const content: HTMLParagraphElement = this.getContentRef();
    if (!selection || !content) {
      return;
    }
    for (let i = 0; i < selection.rangeCount; i++) {
      const range = selection.getRangeAt(0);
      let start: Node | null = range.startContainer;
      let end: Node | null = range.endContainer;
      // for IE11 : node.contains(textNode) always return false
      start = start.nodeType === Node.TEXT_NODE ? start.parentNode : start;
      end = end.nodeType === Node.TEXT_NODE ? end.parentNode : end;
      if (content.contains(start) && content.contains(end)) {
        this.range = range;
        console.log('%c⧭', 'color: #40fff2', range)
        break;
      }
    }
  }

  restoreSelection(range: Range) {
    const selection: Selection | null = window.getSelection 
      ? window.getSelection() : document.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
    // if (this.rangeHandler.range) {
    //   selection.addRange(this.rangeHandler.range);
    // }
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

  getSelection() {
    console.log("getSelectionCalled")
    this.saveCurrentRange();
  }

  getContentRef(): HTMLParagraphElement {
    return this.$refs.texteditorcontent as HTMLParagraphElement;
  }

  setStyle(styleName: string, value: string): void {
    console.log('%c%s', 'color: #00b300', 'setStyle')
    const style: Style = { style: styleName, value: value };
    const rh = new RH(this.range);
    rh.applyStyle('span', style);
  
    // this.restoreSelection(rh.range);
  }

  onFontClick(font: string): void {
    this.setStyle('fontFamily', font);
  }

  onFontWeightChange(iconElement: IconPickerInterface): void {
    this.setStyle('fontWeight', iconElement.domEquivalent);
  }

  onItalicClick(): void {
    this.setStyle('fontStyle', 'italic');
  }
  onUnderlineClick(): void {
    this.setStyle('textDecoration', 'underline');
  }

  onFontSizeChange(fontSize: number): void {
    this.setStyle('fontSize', `${fontSize}px`);
  }

  onColourChange(rgbColour: string) {
    this.setStyle('color', rgbColour);
  }

  onIndentClick() {
    // const indent = this.rangeHandler.applyIndent();
    // this.rangeHandler.applyIndent(style)
    const indent = new Indents(this.range);
    indent.createIndent();
  }

  onOutdentClick() {
    // const indent = this.rangeHandler.removeIndent();
    const indent = new Indents(this.range);
    indent.removeIndent();
    // this.rangeHandler.applyIndent(style)
  }
  get textContent(): string {
    return this.localContent;
  }

  get show(): boolean {
    return SidebarModule.showTextModal;
  }
}
</script>

<style lang="postcss" scoped>
 
</style>
