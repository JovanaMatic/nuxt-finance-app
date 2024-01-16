<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extra-bold">Summary</h1>
    <div>
      <USelectMenu v-model="selectedView" :options="transactionView" />
    </div>
  </section>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
    <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="previousIncomeTotal" :loading="isLoading"></Trend>
    <Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="previousExpenseTotal" :loading="isLoading"></Trend>
    <Trend color="red" title="Investments" :amount="4000" :last-amount="2000" :loading="isLoading"></Trend>
    <Trend color="green" title="Savings" :amount="4000" :last-amount="6000" :loading="isLoading"></Trend>
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses for this period.
      </div>
    </div>
    <div>
      <TransactionModal v-model="isOpen" @saved="refreshTransactions()"></TransactionModal>
      <UButton icon="i-heroicons-plus" color="white" variant="solid" label="Add" @click="isOpen = true" />
    </div>
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
  const isOpen = ref(false)
  
  const { current, previous } = useSelectedTimePeriod(selectedView)

  const { isLoading, incomeTotal, expenseTotal, incomeCount, expenseCount, refreshTransactions, transactionGroupedByDay } = useFetchTransactions(current)
  await refreshTransactions()
  
  const {
    incomeTotal: previousIncomeTotal,
    expenseTotal: previousExpenseTotal } = useFetchTransactions(previous)
</script>

<style scoped>

</style>