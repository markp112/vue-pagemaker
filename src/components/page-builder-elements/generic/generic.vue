<template>
    <div :id="$props.thisComponent.ref">
      <span
        v-if="!isImage"
        :class="getClasses()"
        :style="getStyles()"
        @click="onClick($event)"
      >{{ data.content }}</span>
      <img 
        v-if="isImage" 
        :src="data.content" 
        :class="getClasses()"
        @click="onClick($event)"
      />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import {
  Style,
  ComponentRef,
  PageData,
  ComponentContainer,
  PageElement,
} from '@/models/page/page';
import { Content, ComponentTypes } from '@/models//components/components';
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue';

@Component({
  props: {
    thisComponent: {
      default: (): PageData => {
        return new PageElement();
      },
    },
  },
  components: {
    'upload-image': UploadImage,
  }
})
export default class GenericComponent extends Vue {
  name="generic-component";
  showBorder = false;
  isImage = false;
  data: ComponentTypes;
  editorComponent = '';

  created() {
    this.data = this.$props.thisComponent.data;
    if (this.$props.thisComponent.type === 'Image') { 
      this.isImage = true;
      const component = (this.$props.thisComponent as PageElement)
      component.classDefinition += ` ${component.parent.height()} `;
    }
      
  }

  getClasses(): string {
    let componentClassSpec = this.$props.thisComponent.classDefinition;
    if (this.showBorder) {
      componentClassSpec += ' border1';
    }
    return componentClassSpec;
  }

  getStyles(): string {
    let style: string;
    style = '';
    const styles: Style[] = this.$props.thisComponent.styles;
    if (styles.length > 0) {
      styles.forEach(element => {
        style += `${element.style}:${element.value};`;
      });
    }
    return style;
  }

  onClick(event: Event) {
    this.$store.dispatch('updateEditedComponentRef', this.$props.thisComponent);
    this.$store.dispatch('updateShowEditDelete', true);
    this.showBorder = !this.showBorder;
    event.stopPropagation();
  }
}
</script>

<style lang="postcss" scoped>
.border1 {
  @apply border-indigo-800 border border-dashed;
}

.component {
  @apply shadow shadow-xl;
}

.component:hover {
  @apply bg-gray-200 bg-gray-600;
}
</style>