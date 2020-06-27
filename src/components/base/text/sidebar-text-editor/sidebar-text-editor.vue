<template>
  <div>
    <p>Text Styles</p>
    <div class="sidebar-button-panel w-full">
      <font-select @onFontClick="onFontClick"></font-select>
      <icon-select
        iconSelect="font_bold-32.png"
        :iconList="fontWeightIconList"
        @selectChange="fontWeightChange"
      >
      </icon-select>
      <img
        src="@/assets/icons/font_italic-32.png"
        class="text-accent-600 cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': isFontItalic}"
        @click="onItalicClick" 
      />
      <img
        src="@/assets/icons/font_underlined-32.png"
        class="text-accent-600 cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': isFontUnderlined}"
        @click="onUnderlinedClick"
      />
    
    </div>
    <div class="sidebar-button-panel w-full mt-2 items-center">
      <span class="text-sm font-bold">Text</span>
      <input
        type="text"
        name="text"
        v-model="textContent"
        @change="textChange"
        class="text-sm w-32 app-input-field mb-2"
        placeholder="Enter content"
      />
      <drop-down 
        class="ml-1"
        :selectList="fontSizes"
        :defaultValue="16"
        @onSelectChange="onFontSizeChange"
      >
      px
      </drop-down>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import IconSelect from '@/components/base/pickers/icon-select/icon-select.vue';
import FontSelect from '@/components/base/pickers/font-selector/font-selector.vue'
import DropDown from '@/components/base/pickers/drop-down/drop-down.vue';
import {
  IconPickerInterface,
  fontWeightIconList 
} from '@/models/components/icon-picker-models';

@Component({
  props: {
    textValue: {
      default: '',
    },
  },
  components: {
    'icon-select': IconSelect,
    'font-select': FontSelect,
    'drop-down': DropDown,
  },
})
export default class SideBarTextEditor extends Vue {
  isFontItalic = false;
  isFontUnderlined = false;
  fontSizes = [6, 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 26, 28, 36, 48, 72];
  fontWeightIconList = fontWeightIconList;
  textContent = '';

  mounted() {
    this.textContent = this.$props.textValue;
  }

  @Emit('onFontWeightChange')
  fontWeightChange(iconElement: IconPickerInterface): IconPickerInterface {
    return iconElement;
  }

  @Emit('onItalicClick')
  onItalicClick() {
    this.isFontItalic = !this.isFontItalic;
    if(this.isFontItalic) {
      return 'italic';
    } 
    return 'not-italic';
  }

  @Emit('onUnderlineClick')
  onUnderlinedClick() {
    this.isFontUnderlined = !this.isFontUnderlined;
    if(this.isFontUnderlined) {
      return 'underline';
    } 
    return 'no-underline';
  }

  @Emit('onFontClick')
  onFontClick(fontName: string): string {
    return fontName;
  }

  @Emit('onFontSizeChange') 
  onFontSizeChange(fontSize: number): number {
    return fontSize;
  }

  @Emit('onTextChange')
  textChange(): string {
    return this.textContent;
  }
}
</script>
