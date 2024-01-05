<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extra-bold">Summary</h1>
    <div>
      <USelectMenu v-model="selectedView" :options="transactionView" />
    </div>
  </section>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
    <Trend color="green" title="Income" :amount="4000" :last-amount="3000" :loading="false"></Trend>
    <Trend color="red" title="Expense" :amount="4000" :last-amount="5000" :loading="false"></Trend>
    <Trend color="red" title="Investments" :amount="4000" :last-amount="2000" :loading="false"></Trend>
    <Trend color="green" title="Savings" :amount="4000" :last-amount="6000" :loading="false"></Trend>
  </section>

  <section>
    <Transactions v-for="transaction in data" :key="transaction.id" :transaction="transaction"/>
  </section>
</template>

<script setup>
  import { transactionView } from '~/constants'
  const selectedView = ref(transactionView[1])

  const supabase = useSupabaseClient()

  const { data, error } = await useAsyncData('transactions', async () => {
    const { data, error } = await supabase.from('transactions').select()
    if (error) return []
    return data
  })



</script>

<style scoped>

</style>