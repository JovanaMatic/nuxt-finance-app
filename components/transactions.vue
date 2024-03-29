<template>
  <div class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
   <div class="flex items-center justify-between space-x-4 col-span-2">
    <div class="flex items-center space-x-1">
      <UIcon :name="icon" :class="iconColor"/>
      <div>{{ transaction.description }}</div>
    </div>

    <div>
      <UBadge v-if="transaction.category" color="white">Category: {{ transaction.category }}</UBadge>
    </div>
   </div>

   <div class="flex items-center justify-end space-x-2">
    <div>{{ currency }}</div>
    <div>
      <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
        <UButton color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" :loading="isLoading"></UButton>
      <TransactionModal v-model="isOpen" :transaction="transaction" @saved="emit('edited')"></TransactionModal>
      </UDropdown>
    </div>
   </div>
  </div>
</template>

<script setup>
  const props = defineProps({
      transaction: Object
  })
    console.log(props.transaction)

  const isOpen = ref(false)
  const emit = defineEmits(['deleted', 'edited'])

  const supabase = useSupabaseClient()
  const { toastSuccess, toastError } = useAppToast()

  const isLoading = ref(false)

  const deleteTransaction = async () => {
    isLoading.value = true
    try {
      await supabase
        .from('transactions')
        .delete()
        .eq('id', props.transaction.id)

        toastSuccess({
          title: 'Transaction deleted.',
          description: 'Data will be loaded in a few seconds'
        })
        emit('deleted', props.transaction.id)

    } catch(err) {
        toastError({
          title: 'Error deleting transaction.'
        })
    } finally {
      isLoading.value = false
    }
  }
  // good practice to separate condition that we repeat through multiple places into one code line
  const isIncome = computed(() => props.transaction.type === 'Income')

  const icon = computed(() => isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left')
  const iconColor = computed(() => isIncome.value ? 'text-green-600' : 'text-red-400')

  const { currency }  = useCurrency(props.transaction.amount)

  const items = [
    [
      {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => isOpen.value = true
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction
    }
    ]
  ]
</script>

<style scoped>

</style>