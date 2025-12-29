
import { icons } from '@/constants';
import React from 'react';
import { Image, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface Props extends TextInputProps {
    label?: string;
    otherStyles?: string;
}


const SearchInput: React.FC<Props> = ({ label = "", otherStyles = "", ...props }) => {

    return (
        <>


            <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4'>
                <TextInput className='flex-1 text-white font-psemibold text-base h-full'
                    placeholderTextColor='#7b7b8b'
                    cursorColor="#FF9C01"
                    {...props}
                />
                <TouchableOpacity>
                    <Image source={icons.search as any} className='w-6 h-6' resizeMode="contain" />
                </TouchableOpacity>
            </View>

        </>
    )
}

export default SearchInput