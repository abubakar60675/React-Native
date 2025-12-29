import { images } from '@/constants';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';
import CustomButton from './CustomButton';

interface Props {
    title: string;
    subTitle: string;
}
const EmptyState: React.FC<Props> = ({ title, subTitle }) => {
    return (
        <>
            <View className='justify-center items-center px-4'>
                <Image source={images.empty as any} className='w-[270px] h-[215px]' resizeMode="contain" />
                <Text className='font-psemibold text-xl text-white text-center mt-2'>{title}</Text>
                <Text className='font-pmedium text-sm text-gray-100 text-center'>{subTitle}</Text>
                <CustomButton containerStyles='w-full my-5' onPress={() => router.push("/create")}>
                    Create video
                </CustomButton>
            </View>

        </>
    )
}

export default EmptyState