import EmptyState from '@/components/EmptyState'
import InfoBox from '@/components/InfoBox'
import VideoCard from '@/components/VideoCard'
import { icons } from '@/constants'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getUserPosts, signout } from '@/lib/appwrite'
import useAppwrite from '@/lib/hook/useAppwrite'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, Image, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext()
  const { isLoading, data: posts, refetch } = useAppwrite({ fn: () => getUserPosts(user?.$id) });


  const handleLogout = async () => {
    await signout()
    setUser(null)
    setIsLoggedIn(false)
    router.replace("/sign-in")
  }

  return (
    <>
      <SafeAreaView className='bg-primary h-full'>
        <FlatList
          data={posts}
          keyExtractor={(item) => item?.$id?.toString()}
          renderItem={({ item }) => {
            return <>
              <VideoCard video={item} />
            </>
          }}
          ListHeaderComponent={() => {
            return <>
              <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
                <TouchableOpacity className='w-full items-end mb-10' onPress={handleLogout}>
                  <Image source={icons.logout as any} alt='Logout Image' className='w-6 h-6' resizeMode="contain" />
                </TouchableOpacity>
                <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
                  <Image source={{ uri: user?.avatar }} className='w-[90%] h-[90%] rounded-lg' resizeMode='cover' />
                </View>
                <InfoBox title={user?.username} containerStyles='mt-5' titleStyles='text-lg' />
                <View className='mt-5 flex-row'>
                  <InfoBox title={posts?.length ?? 0} containerStyles='mr-10' titleStyles='text-xl'
                    subTitle='Posts'
                  />
                  <InfoBox title="1.2k" titleStyles='text-xl'
                    subTitle='Followers'
                  />

                </View>
              </View>
            </>
          }}
          ListEmptyComponent={() => {
            return <>
              <EmptyState title="No Videos Found" subTitle="No videos found for this search query" />
            </>
          }}

        />
      </SafeAreaView>
    </>
  )
}

export default Profile