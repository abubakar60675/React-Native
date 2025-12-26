import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { images } from '@/constants'
import { useGlobalContext } from '@/context/GlobalProvider'
import { createUser } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface FormData {
  username: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  })

  const { setIsLoggedIn, setUser } = useGlobalContext();

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      if (!form.username || !form.email || !form.password) {
        Alert.alert("Error", "Please fill in all the fields");
        return
      }
      setIsSubmitting(true);
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLoggedIn(true);
      router.replace('/home');
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error?.message);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SafeAreaView className='bg-primary h-full'>
        <ScrollView>
          <View className='w-full justify-center min-h-full px-4 my-6'>
            <Image source={images.logo as any} resizeMode="contain" className='w-[115px] h-[35px]' />
            <Text className='text-2xl text-white font-semibold mt-10 font-psemibold'>Sign up to Aora</Text>
            <FormField label='Username'
              value={form.username}
              placeholder='Enter your username'
              onChangeText={(text) => handleChange("username", text)}
              otherStyles='mt-7'
            />
            <FormField label='Email'
              value={form.email}
              placeholder='Enter your email'
              onChangeText={(text) => handleChange("email", text)}
              keyboardType='email-address'
              otherStyles='mt-10'
            />
            <FormField label='Password'
              value={form.password}
              placeholder='Enter your password'
              onChangeText={(text) => handleChange("password", text)}
              otherStyles='mt-7'
            />
            <CustomButton containerStyles='mt-7'
              onPress={handleSubmit}
            >
              Sign Up
            </CustomButton>
            <View className='justify-center pt-5 flex-row gap-2'>
              <Text className='text-lg text-gray-100 font-pregular'>
                Already have an account?
              </Text>
              <Link href="/sign-in" className='text-lg font-psemibold text-secondary'>Sign In</Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default SignUp