import CustomButton from '@/components/CustomButton'
import { images } from '@/constants'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Redirect, router } from 'expo-router'
import { StatusBar } from "expo-status-bar"
import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const Index = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();
  if (!isLoading && !isLoggedIn) {
    return <>
      <Redirect href="/home" />
    </>
  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className='w-full justify-center items-center h-full px-4'>
          <Image source={images.logo as any} className='w-[130px] h-[84px]' resizeMode="contain" />
          <Image source={images.cards as any} className='max-w-[380px] w-full h-[300px]' resizeMode="contain" />
          <View className='mt-5 relative'>
            <Text className='text-3xl text-white font-bold text-center'>
              Discover Endless Possibilities with{" "}
              <Text className='text-secondary-200'>Aora</Text>
            </Text>
            <Image source={images.path as any} className='absolute -bottom-2 -right-2 w-[136px] h-[15px]' resizeMode="contain" />
          </View>
          <Text className='text-sm font-pregular text-gray-100 text-center mt-7'>
            Where creativity meets innovation: embark on a journey of limitless exploration with Aora
          </Text>
          <CustomButton containerStyles='w-full mt-7' onPress={() => router.push("/sign-in")}>Continue with Email</CustomButton>
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style="light" />
    </SafeAreaView>
  )
}

export default Index
