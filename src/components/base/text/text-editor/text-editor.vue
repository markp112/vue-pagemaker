<template>
  <div class="w-9/12 h-32 border border-gray-100 z-50 shadow-lg" v-if="show">
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
      <colour-select @onColourChange="onColourChange"></colour-select>
      <close-button @onClick="onCloseClick()"></close-button>
      </div>
      <p
        id="texteditorcontent"
        class="bg-white h-full"
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
import ColourDropdown from '@/components/base/pickers/colour-picker/colour-dropdown.vue';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import SideBarTextEditor from '../sidebar-text-editor/sidebar-text-editor.vue';
import { Style } from '../../../../models/styles/styles';
import { SidebarModule } from '@/store/sidebar/sidebar'
import { RH } from '@/classes/dom/range';
import { PageModule } from '../../../../store/page/page';
import { IconPickerInterface } from '../../../../models/components/icon-picker-models';


@Component({
  components: {
    'close-button': CloseButton,
    'text-editor-controls': SideBarTextEditor,
    'colour-select': ColourDropdown,
  },
  props: {
    content: { default: '' },
  }
})
export default class TextEditor extends Vue {
  name = 'text-editor';
  localContent = '';
  range: Range | null = null;
  rangeHandler: RH = new RH();

  mounted() {
    this.localContent = this.$props.content;
    const textEditor: HTMLParagraphElement = this.$refs.texteditorcontent as HTMLParagraphElement;
    textEditor.innerHTML = this.localContent;
  }

  onCloseClick(): void {
    const textEditor: HTMLParagraphElement = this.$refs.texteditorcontent as HTMLParagraphElement;
    PageModule.updateEditedComponentData(textEditor.innerHTML);
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
          this.rangeHandler.range = range;
          break;
        }
      }
    }

    restoreSelection() {
      const selection: Selection | null = window.getSelection ? window.getSelection() : document.getSelection();
      if (!selection) return;
      selection.removeAllRanges();
      if (this.rangeHandler.range) {
        selection.addRange(this.rangeHandler.range);
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

  getSelection() {
    this.saveCurrentRange();
    // console.log("range", this.rangeHandler.range)
  }

  getContentRef(): HTMLParagraphElement {
    return this.$refs.texteditorcontent as HTMLParagraphElement;
  }

  setStyle(styleName: string, value: string): void {
    const style: Style = { style: styleName, value: value };
    if (this.rangeHandler.range) {
      // this.createNodesFromFragment(this.range, style, 'span')
      this.rangeHandler.applyStyle(style, 'span', this.getContentRef());
    }
    this.restoreSelection();
  }

  onFontClick(font: string): void {
    this.setStyle('fontFamily', font);
  }

  onFontWeightChange(iconElement: IconPickerInterface): void {
    this.setStyle('fontWeight', iconElement.domEquivalent);
  }

  onItalicClick(classDef: string): void {
    this.setStyle('fontStyle', 'italic');
  }
  onUnderlineClick(classDef: string): void {
    this.setStyle('textDecoration', 'underline');
  }


  onFontSizeChange(fontSize: number): void {
    this.setStyle('fontSize', `${fontSize}px`);
  }

  onColourChange(rgbColour: string) {
    this.setStyle('color', rgbColour);
  }

  get textContent(): string {
    return this.localContent;
  }

  get show(): boolean {
    return SidebarModule.showTextModal;
  }
}
</script>