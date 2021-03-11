<template>
  <div class="flex flex-row flex-wrap justify-venly p-2 h-24">
    <icon-image
      class="ml-2"
      :icon="horizontalStretch"
      @iconClick="iconClicked('horizontal')"
      tooltip="stretch horizontal"
    >
    </icon-image>
    <icon-image
      class="ml-2"
      :icon="verticalStretch"
      @iconClick="iconClicked('vertical')"
      tooltip="stretch vertical"
    >
    </icon-image>
    <icon-image
      class="ml-2"
      :icon="sizeToFit"
      @iconClick="iconClicked('zoomToFit')"
      tooltip="size to fit"
    >
    </icon-image>
    <icon-image
      class="ml-2"
      :icon="zoomOut"
      @iconClick="iconClicked('out')"
      tooltip="zoom out"
    >
    </icon-image>
    <icon-image
      class="ml-2"
      :icon="zoomIn"
      @iconClick="iconClicked('in')"
      tooltip="zoom in"
    >
    </icon-image>
    <icon-image
      class="ml-2"
      :icon="zoomTo50"
      @iconClick="iconClicked('50')"
      tooltip="resize to 50%"
    >
    </icon-image>
    <icon-image
      class="ml-2"
      :icon="zoomTo100"
      @iconClick="iconClicked('100')"
      tooltip="full size"
    >
    </icon-image>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import  IconImage from '@/components/base/icon-image/icon-image.vue';
import Component from 'vue-class-component';
import { IconInterface } from '@/models/font-awesome/icon';
import { ImageManipulator, ZoomDirection, StretchDirection } from '@/classes/images/image-manipulation/imageManipulation';
import { PageModule } from '@/store/page/page';
import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
import { Style } from '@/models/styles/styles';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';

@Component({
  props: {
    theEditedImage:{
      default: ():ImageElement => {
        return new PageElementBuilder().buildAnImage();
      } 
    },
  },
  components: {
    'icon-image': IconImage,
  }
})
export default class ImageSizingToolbar extends Vue{

  imageManipulator!:ImageManipulator;

  horizontalStretch: IconInterface = {
    icon: 'arrow_bidirectional-32.png',
    isImage: true,
    prefix: '',
  };
  verticalStretch: IconInterface = {
    icon: 'arrow_vertical-32.png',
    isImage: true,
    prefix: '',
  };
  sizeToFit: IconInterface = {
    icon: 'resize2-32.png',
    isImage: true,
    prefix: '',
  };
  zoomOut: IconInterface = {
    icon: 'zoom_out-32.png',
    isImage: true,
    prefix: '',
  };
  zoomIn: IconInterface = {
    icon: 'zoom_in-32.png',
    isImage: true,
    prefix: '',
  };
  zoomTo50: IconInterface = {
    icon: '50-32.png',
    isImage: true,
    prefix: '',
  };
  zoomTo100: IconInterface = {
    icon: '100-32.png',
    isImage: true,
    prefix: '',
  };
  
  mounted() {
    this.imageManipulator = new ImageManipulator(this.$props.theEditedImage);
  }

  iconClicked(icon: string) {
    const styles: Style[] = this.imageManipulator.applyAction(icon as ZoomDirection | StretchDirection);
    styles.forEach((style: Style) => {
      PageModule.updateEditedComponentStyles(style);
    });
  }

}
</script>