<template>
  <div>
    <div class="mb-4">
      <UFormGroup label="Current avatar" class="w-full" help="This will be blank by default">
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar"/>
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup label="New avatar" class="w-full" name="avatar"
        help="After choosing an image click Save to actually upload the new avatar">
        <UInput type="file" ref="fileInput" />
      </UFormGroup>
    </div>

    <UButton type="submit" color="black" variant="solid" label="Save" :loading="isLoading" :disabled="isLoading"
      @click="saveAvatar"></UButton>
  </div>
</template>

<script setup>
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const isLoading = ref(false)
  const { toastSuccess, toastError } = useAppToast()
  const fileInput = ref()

  const saveAvatar = async () => {
    isLoading.value = true
    try {
      // files are defined as array and w eonly need first element in the array
      const file = fileInput.value.input.files[0]
      
      if(!file) { 
      toastError({
        title: 'Please select the file you want to upload'
      })
      return 
      }
      
      const fileExtension = file.name.split('.').pop()
      // generate a random file name so that we do not store the exact file name in db
      const generateRandomFileName = `${Math.random()}${fileExtension}`
      
      console.log(fileExtension)
      
    } catch (error) {
      toastError({
        title: 'Error while uploading image',
        description: error.message
      })
      } finally {
      isLoading.value = false
    }
  }
</script>

<style scoped>

</style>