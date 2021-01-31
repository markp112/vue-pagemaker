
import ImageComponent from '../src/components/page-builder-elements/generic/paritals/image-component-background.vue';
import { storiesOf } from '@storybook/vue';

import { PageElementFactory } from '../src/classes/page-element/factory/page-element-factory';
import { ImageElement } from '../src/classes/page-element/page-components/image-element/ImageElement';


export default {
  title: 'Image Component',
  component: ImageComponent,
}

export const imageComponent = () => ({
  components: { ImageComponent },
  template: '<div><ImageComponent></ImageComponent></div>'
});