<template>
  <section ref="textEditor">
    <p
      @select="onSelect" style="background-color:blue; color:white;"
    >
    Some text</p>
    <p @select="onSelect" > {{content}} </p>
  </section>
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
    console.log('%c%s', 'color: #733d00', this.$props.content)
  }

  onSelect() {
    console.log("seelcted")
  }
  
}
</script>