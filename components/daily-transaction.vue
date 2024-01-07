<template>
  <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold">
   <div class="flex items-center justify-between">
    {{ date }}
   </div>

   <div class="flex items-center justify-end mr-10">
    <div>{{ currency }}</div>
   </div>
  </div>
</template>

<script setup>
  const props = defineProps({
      date: String,
      transactions: Array
  })

  const sum = computed(() => {
    let sum = 0

    props.transactions.map(item => {
      if (item.type === 'Income') {
        sum += item.amount
      } else {
        sum -= item.amount
      }
    })
    return sum
  })
  const { currency } = useCurrency(sum)
</script>

<style scoped>

</style>