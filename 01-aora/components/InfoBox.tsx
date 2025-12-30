import React from 'react'
import { Text, View } from 'react-native'
interface Props {
    title: string,
    subTitle?: string,
    containerStyles?: string,
    titleStyles: string,
}
const InfoBox: React.FC<Props> = ({ title, subTitle = "", containerStyles = "", titleStyles }) => {
    return (
        <>
            <View className={containerStyles}>
                <Text className={`text-white text-center font-psemibold ${titleStyles}`}>{title}</Text>
                {subTitle && <Text className="text-gray-100 text-sm text-center font-pregular">{subTitle}</Text>}
            </View>
        </>
    )
}

export default InfoBox