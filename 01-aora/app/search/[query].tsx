import EmptyState from '@/components/EmptyState'
import SearchInput from '@/components/SearchInput'
import VideoCard from '@/components/VideoCard'
import { searchPosts } from '@/lib/appwrite'
import useAppwrite from '@/lib/hook/useAppwrite'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Search = () => {
  const { query } = useLocalSearchParams();
  const { isLoading, data: posts, refetch } = useAppwrite({ fn: () => searchPosts(query) });



  useEffect(() => {
    refetch()
  }, [query])


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
              <View className='my-6 px-4'>

                <Text className='font-pmedium text-sm text-gray-100'>Search Results</Text>
                <Text className='font-psemibold text-2xl text-white'>{query ?? ""}</Text>
                <View className='mt-6 mb-8'>
                  <SearchInput placeholder="Search for a video topic" initialQuery={query as string} />
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

export default Search