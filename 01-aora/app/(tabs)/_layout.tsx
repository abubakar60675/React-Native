import { icons } from '@/constants';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface Props {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<Props> = ({ focused, color, name, icon }) => {
  return (
    <View className='flex-1 items-center justify-center gap-2'>
      <Image source={icon}
        resizeMode="contain"
        tintColor={color}
        className='w-6 h-6'
      />
      <Text className={`text-xs text-center w-full ${focused ? 'font-psemibold' : 'font-pregular'}`} style={{ color: color }} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161612",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
          tabBarIconStyle: {
            flex: 1,
          },

        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.plus} color={color} name="Create" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
            ),
          }}
        />
      </Tabs>

    </>
  )
}

export default TabsLayout