<template>
  <div class="w-9/12 h-32 border border-gray-100 z-50 shadow-lg m-0" v-if="show">
    <div class="w-full sidebar-button-panel h-12 justify-start" ref="text-editor-toolbar">
      <span
        @click="reset"
        class="bg-gray-500 cursor-pointer hover:text-red-600"
      >
        Reset
      </span>
      <font-select @onChange="onChange"></font-select>
      <icon-select
        :buttonIconClassList="fontWeightButton"
        @selectChange="onFontWeightChange"
      >
      </icon-select>
      <icon-toggle-button :thisIconButton="italicButton" @onChange="onItalicClick" ></icon-toggle-button>
      <icon-toggle-button :thisIconButton="underLineButton" @onChange="onUnderlineClick" ></icon-toggle-button>
      <indent-outdent
        @onIndentClick="onIndentClick"
        @onOutdentClick="onOutdentClick">
      </indent-outdent>
      <text-alignment @alignClick="textAlignClick"></text-alignment>
      <colour-select @onColourChange="onColourChange"></colour-select>
      <drop-down 
        class="ml-1"
        :thisIconButton="fontSizeButton"
        @onSelectChange="onFontSizeChange"
      >
      px
      </drop-down>
      <close-button @onClick="onCloseClick()"></close-button>
    </div>
    <div
      id="texteditorcontent"
      class="bg-white h-full text-editor"
      contenteditable="plaintext-only"
      ref="texteditorcontent"
      data-editor="textContent"
      :class="getClasses"
      @mouseup="getSelection"
      @keydown="onKeyDown"
      
      >
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @description Primary text editor
 */

import Vue from 'vue';
import Component from 'vue-class-component';
import ColourDropdown from '@/components/base/pickers/colour-picker/colour-dropdown.vue';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import SideBarTextEditor from '../sidebar-text-editor/sidebar-text-editor.vue';
import IndentOutdent from '@/components/base/text/text-editor/indent/indent-outdent.vue';
import TextAlignment from '@/components/base/text/text-editor/justify/justify.vue';
import { Style, StyleTags } from '../../../../models/styles/styles';
import { SidebarModule } from '@/store/sidebar/sidebar';
import { Indents, Paragraph } from '@/classes/dom/range/range-base';
import { RH } from '@/classes/dom/range/RH';
import { PageModule } from '../../../../store/page/page';
import { AlignText } from '@/classes/dom/range/commands/align-text';
import IconSelect from '@/components/base/pickers/icon-select/icon-select.vue';
import FontSelect from '@/components/base/pickers/font-selector/font-selector.vue';
import DropDown from '@/components/base/pickers/drop-down/drop-down.vue';
import IconToggleButton from '@/components/base/buttons/icon-toggle-button/icon-toggle-button.vue';
import {
  IconPickerInterface,
  fontWeightIconList 
} from '@/models/components/icon-picker-models';
import { ButtonIconClassList } from '@/models/styles/builders/button-icon-class-list';
import { ButtonIconClassInterface } from '@/models/styles/button-icon/button-icon';
import { ButtonFactory } from '@/models/styles/button-factory/button-factory';
import { ButtonIconNumeric } from '@/models/styles/button-icon/button-numeric-list/button-numeric-list';
import { StyleElement, TextAttributes } from '@/classes/text-attributes/text-attributes';
import { TextModule } from '@/store/text-editor/text-editor';
import { PageElement } from '@/classes/page-element/PageElement';
@Component({
  components: {
    'close-button': CloseButton,
    'colour-select': ColourDropdown,
    'indent-outdent': IndentOutdent,
    'text-alignment': TextAlignment,
    'icon-select': IconSelect,
    'font-select': FontSelect,
    'icon-toggle-button': IconToggleButton,
    'drop-down': DropDown,
  },
  props: {
    content: { default: '' },
  },
})
export default class TextEditor extends Vue {
  name = 'text-editor';
  localContent = '';
  range: Range = new Range();
  rangeClone: Range = new Range();
  isFontItalic = false;
  isFontUnderlined = false;
  fontWeightIconList = fontWeightIconList;
  fontWeightButton: ButtonIconClassList = new ButtonFactory().createButton('class-list', 'font-weight') as ButtonIconClassList;
  italicButton: ButtonIconClassInterface = new ButtonFactory().createButton('class', 'italic-button') as ButtonIconClassInterface;
  underLineButton: ButtonIconClassInterface = new ButtonFactory().createButton('class', 'underline-button') as ButtonIconClassInterface;
  fontSizeButton: ButtonIconNumeric = new ButtonFactory().createButton('numeric', 'font-size') as ButtonIconNumeric;

  mounted() {
    this.localContent = this.$props.content;
    TextModule.buildParagraphs(this.localContent);
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
    event.stopPropagation();
    this.getSelection();
  }

  onKeyDown(key: KeyboardEvent) {
    if (key.code === 'Enter') {
      this.getSelection();
      const id = TextModule.createParagraph()
        .then(id => {
          const paragraph = new Paragraph(this.range, id);
          paragraph.newLine();
          return;
        })
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
        break;
      }
    }
  }

  restoreSelection(range: Range) {
    const selection: Selection | null = window.getSelection 
      ? window.getSelection() : document.getSelection();
    if (!selection) return;
    // this.range = this.rangeClone;
    // selection.removeAllRanges();
    selection.addRange(this.rangeClone);
  }

  getSelection() {
    this.saveCurrentRange();
  }

  getContentRef(): HTMLParagraphElement {
    return this.$refs.texteditorcontent as HTMLParagraphElement;
  }

  setStyle(styleName: StyleTags, value: string, classOrStyle: 'class' | 'style'): void {
    if (classOrStyle === 'style') {
      const style: Style = { style: styleName, value: value };
      this.rangeClone = this.range.cloneRange();
      const rh = new RH(this.range);
      rh.applyStyle('span', style, classOrStyle);
      this.restoreSelection(this.rangeClone);
    }
  }

  onChange(fontFamilyStyle: StyleElement): void {
    const styleName = fontFamilyStyle.styleName as StyleTags;
    this.setStyle(styleName, fontFamilyStyle.value, 'style');
  }

  onFontWeightChange(iconElement:  StyleElement): void {
    const textAttributes: TextAttributes = TextAttributes.getInstance();
    this.setStyle('font-weight', iconElement.value, 'class');
  }

  onItalicClick(style: StyleElement): void {
    this.setStyle('font-style', style.value, 'class');
  }
  onUnderlineClick(style: StyleElement): void {
    this.setStyle('text-decoration', style.value, 'class');
  }

  onFontSizeChange(style: StyleElement): void {
    const styleName = style.styleName as StyleTags;
    this.setStyle(styleName, `${style.value}px`, 'style');
  }

  onColourChange(rgbColour: string) {
    this.setStyle('color', rgbColour, 'style');
  }

  onIndentClick() {
    const indent = new Indents(this.range);
    indent.createIndent();
  }

  onOutdentClick() {
    const indent = new Indents(this.range);
    indent.removeIndent();
  }

  textAlignClick(style: string) {
    const align: AlignText = new AlignText();
    const textEditor = this.$refs.texteditorcontent as HTMLDivElement;
    align.alignText(style, textEditor);
  }

  get getClasses(): string {
    const componentClassSpec = PageModule.editedComponentRef as PageElement;
    return componentClassSpec.classDefinition;  
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
 div p {
   margin-block-start: 1em;
   margin-block-end: 1em;
   margin-inline-start: 0px;
   margin-inline-end: 0px;
 }
</style>
