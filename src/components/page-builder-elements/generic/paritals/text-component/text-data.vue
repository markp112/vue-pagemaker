<template>
  <div 
    ref="textContent"
    v-html="getContent"
  >
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Vue } from "vue-property-decorator";

@Component({
  props: {
    content: {
      default: ""
    }
  }
})
export default class TextData extends Vue {
  name = "text-data";

  get getContent() {
    return this.$props.content;
  }
}
</script>
