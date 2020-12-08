<template>
  <div v-html="getData" ref="textContent"></div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Vue, Emit, Prop } from 'vue-property-decorator';

@Component({
  props: {
    data: { default: '<p>some data</p>'},
  }
})
export default class TextData extends Vue {
  name="text-data";

  get getData(): string {
    return this.$props.data;
  }

}

</script>
