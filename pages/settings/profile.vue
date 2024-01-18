<template>
  <UForm :schema="schema" :state="state">
    <UFormGroup label="Full name" class="mb-4" name="name">
      <UInput v-model="state.name"></UInput>
    </UFormGroup>

    <UFormGroup label="Email" class="mb-4" name="email" :peding="isLoading" help="You will receive a confirmation email on both old and new email address">
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
    name: '',
    email: user.value.email
  })

  const schema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email()
  })

</script>

<style scoped>

</style>