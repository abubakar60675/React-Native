import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
    children: React.ReactNode;
    containerStyles?: string;
    textStyles?: string;
    isLoading?: boolean;
}


const CustomButton: React.FC<Props> = ({containerStyles="",textStyles="", isLoading=false, children, ...props }) => {
    return (
        <>
            <TouchableOpacity className={`bg-secondary rounded-xl min-h-[62px] items-center justify-center ${containerStyles} ${isLoading ? "opacity-50":""}`} {...props}
            activeOpacity={0.7}
            disabled={isLoading}
            >
                <Text className={`text-primary font-bold font-psemibold ${textStyles}`}>
                    {children}
                </Text>
            </TouchableOpacity>

        </>
    )
}

export default CustomButton