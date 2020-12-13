<template>
  <div ref="textContent" v-html="getContent"></div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Vue, Emit, Prop } from 'vue-property-decorator';
import { PageModule } from '@/store/page/page'

@Component({
  props: {
    data: { default: '<p>some data</p>'},
  }
})
export default class TextData extends Vue {
  name="text-data";

  get getContent() {
    return PageModule.editedComponentData;
  }

}

</script>
