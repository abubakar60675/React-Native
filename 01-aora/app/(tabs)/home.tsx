import EmptyState from '@/components/EmptyState'
import SearchInput from '@/components/SearchInput'
import Trending from '@/components/Trending'
import VideoCard from '@/components/VideoCard'
import { images } from '@/constants'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getAllPosts, getLatestPosts } from '@/lib/appwrite'
import useAppwrite from '@/lib/hook/useAppwrite'
import React, { useState } from 'react'
import { FlatList, Image, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { isLoading, data: posts, refetch } = useAppwrite({ fn: getAllPosts });
  const { data: latestPosts, } = useAppwrite({ fn: getLatestPosts });
  const { user } = useGlobalContext()


  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
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
              <View className='my-6 px-4 space-y-6'>
                <View className='justify-between items-center flex-row mb-6'>
                  <View>
                    <Text className='font-pmedium text-sm text-gray-100'>Welcome back,</Text>
                    <Text className='font-psemibold text-2xl text-white'>{user?.username ?? ""}</Text>
                  </View>
                  <View className=''>
                    <Image source={images.logoSmall as any} alt='Small Image' className='w-9 h-10' resizeMode="contain" />
                  </View>
                </View>
                <SearchInput placeholder="Search for a video topic" />
                <View className='w-full flex-1 pt-5 pb-8'>
                  <Text className='text-gray-100 text-lg font-pregular mb-3'>
                    Latest Videos
                  </Text>
                  <Trending posts={latestPosts ?? []} />
                </View>
              </View>
            </>
          }}
          ListEmptyComponent={() => {
            return <>
              <EmptyState title="No Videos Found" subTitle="Be the first to upload a video" />
            </>
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
      </SafeAreaView>
    </>
  )
}

export default Home