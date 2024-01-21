export const useAvatarUrl = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const getAvatarURL = () => {

    if (!user.value?.user_metadata?.avatar_url) null

    const { data } = supabase.storage.from('avatarImages').getPublicUrl(user.value?.user_metadata?.avatar_url)

    return data.publicUrl
  }
  watch(user, () => url.value = getAvatarURL())

  const url = ref(getAvatarURL())
  
  return { url }
}