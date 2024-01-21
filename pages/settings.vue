<template>
  <div class="grid grid-cols-6 gap-8">
    <UVerticalNavigation :links="links" class="col-span-2"/>
    <div class="col-span-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
  const { url } = useAvatarUrl()
  const links = [{
  label: 'Profile',
  to: '/settings/profile',
  avatar: {
    src: url.value
  },
}, {
  label: 'Avatar',
  icon: 'i-heroicons-home',
  to: '/settings/avatar'
}, {
  label: 'Settings',
  icon: 'i-heroicons-chart-bar',
  to: '/settings/settings'
}]
</script>

<style scoped>

</style>