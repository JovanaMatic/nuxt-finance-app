<template>
  <UForm :schema="schema" :state="state" @submit="saveProfile">
    <UFormGroup label="Full name" class="mb-4" name="name">
      <UInput v-model="state.name"></UInput>
    </UFormGroup>

    <UFormGroup label="Email" class="mb-4" name="email" :loading="isLoading" :disabled="isLoading" help="You will receive a confirmation email on both old and new email address">
      <UInput v-model="state.email"></UInput>
    </UFormGroup>

    <UButton type="submit" color="black" variant="solid" label="Save"></UButton>
  </UForm>
</template>

<script setup>
  import { z } from 'zod'

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const { toastSuccess, toastError } = useAppToast()
  const isLoading = ref(false)

  const state = ref({
    name: user.value.user_metadata?.full_name,
    email: user.value.email
  })

  const schema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email()
  })

  const saveProfile = async () => {
    isLoading.value = true
    try {
      const data = {
        full_name: state.value.name
      }
      const { error } = await supabase.auth.updateUser(data)

      if(state.value.email !== user.value.email) {
        data.email = state.value.email
      }
      console.log(data)

      if (error) throw error

      toastSuccess({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully'
      })
    }
    catch (error) {
      toastError({
        title: 'Error updating profile',
        description: error.message
      })
    } finally {
      isLoading.value = false
    }
  }

</script>

<style scoped>

</style>