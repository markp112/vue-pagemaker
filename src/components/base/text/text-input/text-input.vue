<template>
    <div class="ml-2">
      <span class="text-sm mr-2 font-bold inline-block">Text</span>
      <input
        type="text"
        name="text"
        v-model="textContent"
        @change="textChange"
        class="text-sm w-32 mb-1 app-input-field bg-site-secondary-light text-onSurface"
        placeholder="Enter content"
      />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';

@Component({
  props: {
    textValue: {
      default: '',
    },
  },
})
export default class TextInput extends Vue {
  textContent = '';

  mounted() {
    this.textContent = this.$props.textValue;
  }

  @Emit('onTextChange')
  textChange(): string {
    return this.textContent;
  }
}
</script>
