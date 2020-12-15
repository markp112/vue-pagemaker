<template>
  <div ref="textContent" v-html="getContent"></div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Vue, Emit, Prop } from 'vue-property-decorator';
import { PageModule } from '@/store/page/page'
import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';

@Component({
  props: {
     thisComponent: {
      default: (): PageElementClasses => {
        return undefined;
      },
    },
  }
})
export default class TextData extends Vue {
  name = 'text-data';

  get getContent() {
    return  this.$props.thisComponent.content;;
  }
}
</script>
