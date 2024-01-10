export const useFetchTransactions = () => {
  const transactionData = ref([])
  const supabase = useSupabaseClient()
  const isLoading = ref(false)

  const income = computed(() => transactionData.value.filter(item => item.type === 'Income'))
  const expense = computed(() => transactionData.value.filter(item => item.type === 'Expense'))

  const incomeCount = computed(() => income.value.length)
  const expenseCount = computed(() => expense.value.length)

  const incomeTotal = computed(() => income.value.reduce((acc, curr) => acc + curr.amount, 0))
  const expenseTotal = computed(() => expense.value.reduce((acc, curr) => acc + curr.amount, 0))

  // create a funcion that fetches transactions so that we can call it when:
  // 1. page loads
  // 2. delete event is passed 
  const fetchTransactions = async () => {
    isLoading.value = true
    try {
      const { data } = await useAsyncData('transaction', async () => {
        const { data, error } = await supabase.from('transactions').select().order('created_at', { ascending: false })
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

  return {
    transactionData,
    isLoading,
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    refreshTransactions,
    transactionGroupedByDay
  }


}