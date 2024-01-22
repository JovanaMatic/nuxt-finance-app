<template>
  <div>
    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h2>{{ isEditing ? 'Edit' : 'Add'}} Transaction</h2>
          </div>
        <div>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isOpen = false" />
        </div>
        </div>
      </template>

      <UForm :state="state" :schema="schema" ref="form" @submit="save">
        <UFormGroup :required="true" label="Transaction type" name="type" class="mb-4">
            <USelect :disabled="isEditing" placeholder="Select the transaction type" :options="types" v-model="state.type"></USelect>
          </UFormGroup>

          <UFormGroup label="Amount" required name="amount" class="mb-4">
            <UInput type="number" placeholder="include amount" v-model.number="state.amount"/>
          </UFormGroup>

          <UFormGroup label="Transaction date" required name="created_at" class="mb-4">
            <UInput type="date" icon="i-heroicons-calendar-days-20-solid" placeholder="include date" v-model="state.created_at" />
          </UFormGroup>

          <UFormGroup label="Description" hint="Optional" name="description" class="mb-4">
            <UInput type="text" placeholder="include description" v-model="state.description"/>
          </UFormGroup>

          <UFormGroup :required="true" label="Category" name="category" class="mb-4" v-if="state.type === 'Expense'">
            <USelect :options="categories" v-model="state.category"></USelect>
          </UFormGroup>

          <UButton type="submit" color="black" varian="solid" label="Save"></UButton>
      </UForm>

        <div class="flex justify-end">
          <UButton @click="isOpen = false" color="white" variant="solid" class="mt-5" :loading="isLoading">Close</UButton>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
  import { categories, types } from '~/constants'
  import { z } from 'zod'
  const supabase = useSupabaseClient()
  const { toastSuccess, toastError } = useAppToast()

  const props = defineProps({
    modelValue: Boolean,
    transaction: {
      type: Object,
      required: false
    }
  })
  const emit = defineEmits(['update:modelValue', 'saved'])

  const isEditing = computed(() => !!props.transaction)

  const defaultSchema = z.object({
    created_at: z.string(),
    description: z.string().optional(),
    amount: z.number().positive('Amount needs to be larger that 0')
  })

  const incomeSchema = z.object({
    type: z.literal('Income')
  })

  const expensesSchema = z.object({
    type: z.literal('Expense'),
    category: z.enum(categories)
  })

   const investmentSchema = z.object({
    type: z.literal('Investment')
  })

  const savingSchema = z.object({
    type: z.literal('Saving')
  })

  const schema = z.intersection(
    z.discriminatedUnion('type', [incomeSchema, expensesSchema, investmentSchema, savingSchema]),
    defaultSchema
  )

  const form = ref()
  const isLoading = ref(false)

  const save = async () => {
    if (form.value.errors.length) return

    isLoading.value = true
    try {
      const { error } = await supabase
      .from('transactions')
      .upsert(
        {
          ...state.value,
          id: props.transaction?.id
           })

      if (!error) {
        toastSuccess({
          title: 'Transaction saved'
        })
        isOpen.value = false
        emit('saved')
        return
      }
      throw error
    } catch (e) {
      toastError({
          title: 'Failed to save transaction',
          description: e.message
        })
    } finally {
      isLoading.value = false
    }
  }

  const initialState = isEditing.value ? {
    type: props.transaction.type,
    amount: props.transaction.amount,
    created_at: props.transaction.created_at.split('T')[0],
    description: props.transaction.description,
    category: props.transaction.category
  } : {
    type: undefined,
    amount: 0,
    created_at: undefined,
    description: undefined,
    category: undefined
  }
  const state = ref({...initialState})

  const resetForm = () => {
    Object.assign(state.value, initialState)
    // clear errors if any when closing the form modal
    form.value.clear()
  }

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => {
        if (!value) resetForm()
        emit('update:modelValue', value)
    }
  })

  // watch(isOpen, () => {

  // if (isOpen.value === false) {
  //  setTimeout(() => {
  //   resetForm()
  //  }, 400);
  // }
// })
</script>

<style scoped>

</style>