import React from 'react'
import { FlatList, Text } from 'react-native'
interface Props {
    posts: {
        id: number
    }[]
}
const Trending: React.FC<Props> = ({ posts }) => {
    return (
        <>
            <FlatList
                data={posts}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={({ item }) => {
                    return <>
                        <Text className='text-white'>{item?.id}</Text>
                    </>
                }}
                horizontal
            />
        </>
    )
}

export default Trending