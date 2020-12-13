<template>
  <section ref="textEditor"></section>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component';

@Component({
  props: {
    content: { default: ''},
  }
})
export default class ParagraphComponent extends Vue {

  mounted() {
    const textEditor = this.$refs.textEditor as HTMLElement;
    textEditor.innerHTML = this.$props.content;
  }
  
}
</script>