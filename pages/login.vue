<template>
  <UCard v-if="!success">
    <template #header>
      Login Form
    </template>
    <form @submit.prevent="handleLoading">
      <UFormGroup label="Email" name="email" :required="true" help="You will receive an email with the confirmation link" class="mb-4">
        <UInput type="email" placeholder="you@example.com" icon="i-heroicons-envelope" required v-model="email"/>
      </UFormGroup>
      <UButton type="submit" color="black" variant="solid" :loading="isLoading" :disabled="isLoading">Sign in</UButton>
    </form>
  </UCard>
  <UCard v-else>
    <template #header>
      Email has been sent
    </template>

    <div class="text-center">
      <p class="mb-4">We have sent an email to <strong>{{ email }}</strong> with a link to sign in</p>
      <p>
        <strong>Important:</strong>The link will expire in 5 minutes.
      </p>
    </div>
  </UCard>
</template>

<script setup>
  const success = ref(false)
  const email = ref('')
  const isLoading = ref(false)
  const toast = useToast()
  const supabase = useSupabaseClient()

  const handleLoading = async () => {
    isLoading.value = true
    try {
      const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: 'http://localhost:3000'
      }
    })

    if (error) {
      toast.add({
        title: 'Sign in failed',
        icon: 'i-heroicons-exclamation-circle',
        description: error.message,
        color: 'red'
      })
    } else {
      success.value = true
    }

    }
    finally {
      isLoading.value = false
    }
  }

</script>

<style scoped>

</style>