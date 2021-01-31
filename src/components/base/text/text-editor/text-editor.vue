<template>
  <div class="w-full h-32 border border-gray-100 z-50 shadow-lg m-0" v-if="show">
    <div class="w-full h-12 flex flex-row justify-between" ref="text-editor-toolbar">
      <div class="sidebar-button-panel">
        <span
          @click="reset"
          class="bg-gray-500 cursor-pointer hover:text-red-600"
        >
          Reset
        </span>
        <font-select @onChange="onChange"></font-select>
        <drop-down 
          class="ml-1"
          :thisIconButton="fontSizeButton"
          @onSelectChange="onFontSizeChange"
        >
          px
        </drop-down>
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
        <colour-select @onColourChange="onColourChange" flexAlignment="horizontal" :showLabels="false"></colour-select>
      </div>
      <div>
        <close-button @onClick="onCloseClick()"></close-button>
      </div>
    </div>
    <div
      id="texteditorcontent"
      class="bg-white h-full p-1"
      contenteditable="plaintext-only"
      ref="texteditorcontent"
      @mouseup="getSelection()"
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
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import IndentOutdent from '@/components/base/text/text-editor/indent/indent-outdent.vue';
import TextAlignment from '@/components/base/text/text-editor/justify/justify.vue';
import ColourSelect from '@/components/base/pickers/colour-picker/colour-select.vue';
import ParagraphComponent from './paragraph/paragraph.vue';
import IconSelect from '@/components/base/pickers/icon-select/icon-select.vue';
import FontSelect from '@/components/base/pickers/font-selector/font-selector.vue';
import DropDown from '@/components/base/pickers/drop-down/drop-down.vue';
import IconToggleButton from '@/components/base/buttons/icon-toggle-button/icon-toggle-button.vue';
import { Style, StyleTags } from '../../../../models/styles/styles';
import { SidebarModule } from '@/store/sidebar/sidebar';
import { Indents } from '@/classes/dom/range/range-base';
import { Paragraph } from '@/classes/dom/range/commands/newLine';
import { RH } from '@/classes/dom/range/RH';
import { PageModule } from '../../../../store/page/page';
import { AlignText } from '@/classes/dom/range/commands/align-text';
import { fontWeightIconList } from '@/models/components/icon-picker-models';
import { ButtonIconClassList } from '@/models/styles/builders/button-icon-class-list';
import { ButtonIconClassInterface } from '@/models/styles/button-icon/button-icon';
import { ButtonFactory } from '@/models/styles/button-factory/button-factory';
import { ButtonIconNumeric } from '@/models/styles/button-icon/button-numeric-list/button-numeric-list';
import { StyleElement, TextAttributes } from '@/classes/text-attributes/text-attributes';
import { TextModule } from '@/store/text-editor/text-editor';
import { TextElement } from '@/classes/page-element/page-components/text-element/TextElement';

@Component({
  components: {
    'close-button': CloseButton,
    'colour-select': ColourSelect,
    'indent-outdent': IndentOutdent,
    'text-alignment': TextAlignment,
    'icon-select': IconSelect,
    'font-select': FontSelect,
    'icon-toggle-button': IconToggleButton,
    'drop-down': DropDown,
    'paragraph-component': ParagraphComponent,

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
    this.reset();
  }

  onCloseClick(): void {
    const textEditor: HTMLParagraphElement = this.$refs.texteditorcontent as HTMLParagraphElement;
    PageModule.updateEditedComponentData(textEditor.innerHTML);
    SidebarModule.updateShowTextModal(false);
  }

  reset() {
    const textEditor: HTMLDivElement = this.$refs.texteditorcontent as HTMLDivElement;
    textEditor.childNodes.forEach(node => node.remove());
    textEditor.innerHTML = this.localContent;
  }

  mouseOut(event: MouseEvent) {
    event.stopPropagation();
    this.getSelection();
  }

  onKeyDown(key: KeyboardEvent) {
    key.stopPropagation();
    if (key.code === 'Enter') {
      key.preventDefault();
      this.getSelection();
      const paragraph = new Paragraph(this.range);
      paragraph.newLine();
      return;
    }
    if ( key.code === 'ArrowLeft' 
      || key.code === 'ArrowRight'
      || key.code === 'ArrowUp'
      || key.code === 'ArrowDown'
      || key.code === 'End'
      || key.code === 'Home'
      ) { 
        this.getSelection();
      }
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
      console.log('%c⧭', 'color: #cc0088', range)
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
      const style: Style = { style: styleName, value: value };
      this.rangeClone = this.range.cloneRange();
      const rh = new RH(this.range);
      rh.applyStyle('span', style, classOrStyle);
      this.restoreSelection(this.rangeClone);
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
    console.log('%c⧭', 'color: #e5de73', style)
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
    const componentClassSpec = PageModule.editedComponentRef as TextElement;
    const selectedComponent = PageModule.selectedComponent;
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


  .text-editor {
    margin-block-start: 0.5em;
    background-color: bisque;
    height: 24px;
    @apply z-50;
 }
</style>
