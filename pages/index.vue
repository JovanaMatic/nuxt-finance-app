<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extra-bold">Summary</h1>
    <div>
      <USelectMenu v-model="selectedView" :options="transactionView" />
    </div>
  </section>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
    <Trend color="green" title="Income" :amount="4000" :last-amount="3000" :loading="isLoading"></Trend>
    <Trend color="red" title="Expense" :amount="4000" :last-amount="5000" :loading="isLoading"></Trend>
    <Trend color="red" title="Investments" :amount="4000" :last-amount="2000" :loading="isLoading"></Trend>
    <Trend color="green" title="Savings" :amount="4000" :last-amount="6000" :loading="isLoading"></Trend>
  </section>

  <section v-if="!isLoading">
    <div v-for="(transactionbyDay, date) in transactionGroupedByDay" :key="date" class="mb-10">
      <DailyTransaction :date="date" :transactions="transactionbyDay" />
      <Transactions v-for="transaction in transactionbyDay" :key="transaction.id" :transaction="transaction" @deleted="refreshTransactions()"/>
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i"/>
  </section>
</template>

<script setup>
  import { transactionView } from '~/constants'
  const selectedView = ref(transactionView[1])
  const isLoading = ref(false)
  const transactionData = ref([])

  const supabase = useSupabaseClient()

  // create a funcion that fetches transactions so that we can call it when:
  // 1. page loads
  // 2. delete event is passed 
  const fetchTransactions = async () => {
    console.log('fetchTransactions')
    isLoading.value = true
    try {
      const { data } = await useAsyncData('transaction', async () => {
        const { data, error } = await supabase.from('transactions').select()
        if (error) return []
        return data
    })
    return data.value

    } finally {
      isLoading.value = false
    }
  }
  // when 'delete' event is emited form child component call a function that re-fetches transaction
  const refreshTransactions = async () => {
    transactionData.value =  await fetchTransactions()
  }
  await refreshTransactions()
  
  const transactionGroupedByDay = computed(() => {
    let grouped = {};
    let newArr = []
    transactionData.value.map(item => {
      if (!grouped.hasOwnProperty(item.created_at.slice(0, 10))) {
        newArr.push(item)
        grouped[item.created_at.slice(0, 10)] =  [item]
      }else{
        grouped[item.created_at.slice(0, 10)].push(item)
      }
      return grouped
    })
    return grouped
  })

</script>

<style scoped>

</style>