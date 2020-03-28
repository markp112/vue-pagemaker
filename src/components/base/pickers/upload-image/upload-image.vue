<template>
<section>
    <div class="flex flex-col justify-center align-middle h-32 w-full border bg-white">
  
   
    <h3>Upload a file by dropping it here</h3>
    <div class="flex flex-row justify-start">
        <input
          class="w-full border"
          type="file"
          @change="setImage( $event.target.name, $event.target.files)"
          accept="image/png, image/jpeg"
          />
          <font-awesome-icon icon="upload" prefix="fas" class="ml-2 mr-2 cursor-pointer"></font-awesome-icon>
          
    </div>
  </div>

</section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator'
import FormButton from '@/components/base/buttons/form-button.vue';
@Component ({
  components:{
    'form-button': FormButton,
  }
})
export default class UploadImage extends Vue {


  @Emit('image-url')
  setImage(targetName:string, file: File[]) {
    const url = file[0];
    console.log("url =", url)
    const formData = new FormData()
    const imageUrl = URL.createObjectURL(url);
    console.log('%c%s', 'color: #f2ceb6', imageUrl, "ImageURL")
    formData.append(targetName, url);
    const imageData = {formData: formData, imageUrl: imageUrl, file: url}
    
    return imageData;
    
  }

  
}
</script>