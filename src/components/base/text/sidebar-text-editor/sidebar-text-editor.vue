<template>
  <div class="sidebar-button-panel">
    <icon-select iconSelect="font_bold-32.png" :iconList="fontWeightIconList" @selectChange="fontWeightChange"></icon-select>
    <img src="@/assets/icons/font_italic-32.png"
          class="text-accent cursor-pointer hover:bg-gray-600"
          :class="{'bg-secondary-100': isFontItalic}"
          @click="onItalicClick" />
    <input type="text" 
      name="text" 
      v-model="textContent" 
      @change="textChange" 
      class="text-sm"
      >

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import IconSelect from '@/components/base/pickers/icon-select/icon-select.vue';

@Component({
  props: {
    textValue: { 
      default: '' 
      },
  },
  components: {
    'icon-select': IconSelect,
  },
})
export default class SideBarTextEditor extends Vue {
  textContent = '';
  isFontItalic = false;
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
}
</script>