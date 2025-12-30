
import { icons } from '@/constants';
import { router, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface Props extends TextInputProps {
    label?: string;
    otherStyles?: string;
    initialQuery?: string;
}


const SearchInput: React.FC<Props> = ({ label = "", otherStyles = "", initialQuery = "", ...props }) => {
    const [query, setQuery] = useState(initialQuery);
    const pathname = usePathname();


    return (
        <>


            <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4'>
                <TextInput className='flex-1 text-white font-psemibold text-base h-full'
                    placeholderTextColor='#CDCDE0'
                    cursorColor="#FF9C01"
                    {...props}
                    value={query}
                    onChangeText={(text) => setQuery(text)}
                />
                <TouchableOpacity
                    onPress={() => {
                        if (!query) {
                            Alert.alert("Missing Query", "Please input something to search results across database")
                            return;
                        }
                        if (pathname.startsWith("/search")) {
                            router.setParams({ query })
                        } else {
                            router.push(`/search/${query}`)
                        }
                    }}
                >
                    <Image source={icons.search as any} className='w-6 h-6' resizeMode="contain" />
                </TouchableOpacity>
            </View>

        </>
    )
}

export default SearchInput