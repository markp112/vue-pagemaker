<template>
  <div class="flex justify-between flex-row mt-8">
    <FormButton label="Cancel" v-on:onClick="cancelClick()"></FormButton>
    <FormButton label="Save" v-on:onClick="saveClick()"></FormButton>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Emit } from "vue-property-decorator";
import FormButton from "@/components/base/buttons/form-button.vue";

@Component({
  components: {
    FormButton
  }
})
export default class SubmitCancel extends Vue {
  name = "submit-cancel";

  @Emit("cancelClicked") cancelClick() {
    return;
  }

  @Emit("saveClicked") saveClick() {
    return;
  }
}
</script>
