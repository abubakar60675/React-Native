import { icons } from '@/constants';
import React, { useState } from 'react';
import { Image, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface Props extends TextInputProps {
    label?: string;
    otherStyles?: string;
}


const FormField: React.FC<Props> = ({ label = "", otherStyles = "", ...props }) => {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <>
            <View className={`gap-y-2 ${otherStyles}`}>
                <Text className='text-base text-gray-100 font-pmedium'>{label}</Text>

                <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row'>
                    <TextInput className='flex-1 text-white font-psemibold text-base h-full'
                        placeholderTextColor='#7b7b8b'
                        cursorColor="#FF9C01"
                        {...props}
                        secureTextEntry={label === "Password" && !showPassword}


                    />
                    {label === "Password" && (
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Image source={showPassword ? icons.eye : icons.eyeHide as any} className='w-6 h-6' resizeMode="contain" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </>
    )
}

export default FormField