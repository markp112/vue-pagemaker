<template>
  <div>
    <div class="sidebar-button-panel">
      <font-select @onFontClick="onFontClick"></font-select>
      <icon-select iconSelect="font_bold-32.png" :iconList="fontWeightIconList" @selectChange="fontWeightChange"></icon-select>
      <img src="@/assets/icons/font_italic-32.png"
            class="text-accent cursor-pointer hover:bg-gray-600"
            :class="{'bg-secondary-100': isFontItalic}"
            @click="onItalicClick" />
      <img src="@/assets/icons/font_underlined-32.png"
            class="text-accent cursor-pointer hover:bg-gray-600"
            :class="{'bg-secondary-100': isFontUnderlined}"
            @click="onUnderlinedClick" />
    </div>
    <div class="sidebar-button-panel justify-center items-center mt-0">
      <span class="text-sm mr-2">Label</span>
      <input type="text" 
        name="text" 
        v-model="textContent" 
        @change="textChange" 
        class="text-sm w-32 mb-1 bg-gray-400"
        placeholder="Enter content"
        >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import IconSelect from '@/components/base/pickers/icon-select/icon-select.vue';
import FontSelect from '@/components/base/pickers/font-selector/font-selector.vue'

@Component({
  props: {
    textValue: { 
      default: '' 
      },
  },
  components: {
    'icon-select': IconSelect,
    'font-select': FontSelect,
  },
})
export default class SideBarTextEditor extends Vue {
  textContent = '';
  isFontItalic = false;
  isFontUnderlined = false;
  fontWeightIconList = [
    { icon: '100-32.png', class: 'font-hairline', tooltip: 'font weight hairline' },
    { icon: '200-32.png', class: 'font-thin', tooltip: 'font weight thin' },
    { icon: '300-32.png', class: 'font-light', tooltip: 'font weight light' },
    { icon: '400-32.png', class: 'font-normal', tooltip: 'font weight normal' },
    { icon: '500-32.png', class: 'font-medium', tooltip: 'font weight medium' },
    { icon: '600-32.png', class: 'font-semibold', tooltip: 'font weight semibold' },
    { icon: '700-32.png', class: 'font-bold', tooltip: 'font weight bold' },
    { icon: '800-32.png', class: 'font-extrabold', tooltip: 'font weight extrabold' },
    { icon: '900-32.png', class: 'font-black', tooltip: 'font weight black' },
    ];

  @Emit('onFontWeightChange')
  fontWeightChange(classDef: string):string {
    return classDef;
  }

  @Emit('onTextChange')
  textChange(): string {
    return this.textContent;
  }

  @Emit('onItalicClick')
  onItalicClick(){
    this.isFontItalic = !this.isFontItalic;
    if(this.isFontItalic) {
      return 'italic';
    } 
    return 'not-italic';
  }

  @Emit('onUnderlineClick')
  onUnderlinedClick(){
    this.isFontUnderlined = !this.isFontUnderlined;
    if(this.isFontUnderlined) {
      return 'underline';
    } 
    return 'no-uunderline';
  }

  @Emit('onFontClick')
  onFontClick(fontName: string) {
    return fontName;
  }
}
</script>
