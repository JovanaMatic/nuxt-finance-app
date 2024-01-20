<template>
  <UForm :state="state" :schema="schema" @submit="saveSettings">
    <UFormGroup label = "Transaction view" class="mb-4" help="Choose how you would like to see transactions">
      <USelect v-model="state.transactionView" :options="transactionView"></USelect>
    </UFormGroup>
    <UButton type="submit" color="black" variant="solid" label="Save" :pending="isLoading"></UButton>
  </UForm>
</template>

<script setup>
  import { z } from 'zod'
  import { transactionView } from '../../constants'
  const supabase = useSupabaseClient()
  const { toastSuccess, toastError } = useAppToast()
  const user = useSupabaseUser()
  const isLoading = ref(false)
  
  const state = ref({
    transactionView: user.value.user_metadata?.transaction_view ?? transactionView[1]
   })

  const schema = z.object({
    transactionView: z.enum(transactionView)
  })

  const saveSettings = async () => {
    isLoading.value = true

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          transaction_view: state.value.transactionView
        }
      })

      toastSuccess({
        title: 'Success updating data'
      })

      if (error) throw error
    } catch (error) {
      toastError({
        title: 'Error updating settings',
        description: error.message
      })
    }
    finally {
      isLoading.value = false
    }
  }
</script>

<style scoped>

</style>