import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { images } from '@/constants'
import { Link } from 'expo-router'
import React, { useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface FormData {
    email: string;
    password: string;
}

const SignIn = () => {
    const [form, setForm] = useState<FormData>({
        email: "",
        password: "",
    })
    const handleChange = (key: string, value: string) => {
        setForm(prev => ({
            ...prev,
            [key]: value,
        }));
    };
    const handleSubmit = () => {
        console.log("submit")
    }

    return (
        <>
            <SafeAreaView className='bg-primary h-full'>
                <ScrollView>
                    <View className='w-full justify-center min-h-full px-4 my-6'>
                        <Image source={images.logo as any} resizeMode="contain" className='w-[115px] h-[35px]' />
                        <Text className='text-2xl text-white font-semibold mt-10 font-psemibold'>Log in to Aora</Text>
                        <FormField label='Email'
                            value={form.email}
                            placeholder='Enter your email'
                            onChangeText={(text) => handleChange("email", text)}
                            keyboardType='email-address'
                            otherStyles='mt-7'
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
                            Sign In
                        </CustomButton>
                        <View className='justify-center pt-5 flex-row gap-2'>
                            <Text className='text-lg text-gray-100 font-pregular'>
                                Don't have an account?
                            </Text>
                            <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>Sign Up</Link>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default SignIn