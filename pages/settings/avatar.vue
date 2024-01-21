<template>
  <div>
    <div class="mb-4">
      <UFormGroup label="Current avatar" class="w-full" help="This will be blank by default">
        <UAvatar :src="url" alt="Avatar"/>
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
  const { url } = useAvatarUrl()

  const saveAvatar = async () => {
    isLoading.value = true
    try {
      // files are defined as array and we only need first element in the array
      const file = fileInput.value.input.files[0]

      if(!file) {
      toastError({
        title: 'Please select the file you want to upload'
      })
      return
      }


      const fileExtension = file.name.split('.').pop()
      // generate a random file name so that we do not store the exact file name in db
      const generateRandomFileName = `${Math.random()}.${fileExtension}`

      // store the current avatar image in tha user metadata
      const avatarUrl = user.value.user_metadata?.avatar_url
      const { error } = await supabase.storage.from('avatarImages').upload(generateRandomFileName, file)

      // if there is an error it will be stored in the catch block 
      if (error) throw error

      await supabase.auth.updateUser({
        data: {
          avatar_url: generateRandomFileName
        }
      })

      fileInput.value.input.value = null

      // delete old avatar from supabase db
      if (avatarUrl) {
        const { error } = await supabase.storage.from('avatarImages').remove([avatarUrl])
        if (error) throw error
      }

      const dataImage = supabase.storage.from('avatarImages').getPublicUrl(avatarUrl)
      console.log(dataImage)

      toastSuccess({
        title: 'File uploaded successfully'
      })

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