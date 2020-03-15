<template>
    <div class="error" v-if="hasErrors">
        <p v-for="error in formErrors" :key="error"> {{ error }} </p>
      </div>
</template>

<script lang="ts">
  import Component  from 'vue-class-component';
  import { Prop, Vue, Emit } from 'vue-property-decorator';

  @Component({
    // props:{
    //   formErrors: { default :[] },
    //   }
  })
  export default class InvalidForm extends Vue{
    @Prop({default: []})
    formErrors: string[] = []


  created(){
   this.formErrors = [];
  }

  get hasErrors (): boolean {
    console.log("formErrors", this.formErrors.length)
    return this.formErrors.length > 0 ? true : false

  }

  }


</script>

<style lang="postcss" scoped>
  .input-control {
    @apply block border-2 rounded-md w-full p-1;
  }

  .error {
    @apply bg-red-600 text-white w-full mt-2 rounded-md p-2 text-sm;
  }
</style>
