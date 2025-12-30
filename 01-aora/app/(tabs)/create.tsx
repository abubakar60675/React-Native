import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { icons, videoSource } from '@/constants';
import { useGlobalContext } from '@/context/GlobalProvider';
import { createVideo } from '@/lib/appwrite';
import { useEvent } from 'expo';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


interface FormData {
  title: string;
  thumbnail: any;
  video: any;
  prompt: string;
}
const Create = () => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormData>({
    title: "",
    thumbnail: null,
    video: null,
    prompt: "",
  });
  const { user } = useGlobalContext()

  // Create a player for this item
  const player = useVideoPlayer(
    form.video || videoSource,
    (p) => {
      p.loop = true;
      p.play();
    }
  );


  // Listen to playing state (optional, for button text or debugging)
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });




  const handleChange = (key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePicker = async (type: 'image' | 'video') => {
    // const result = await DocumentPicker.getDocumentAsync({
    //   type: type === "image" ? ['image/jpeg', 'image/png', 'image/jpg'] : ['video/mp4', 'video/mov', 'video/gif'],
    // })

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === "image" ? ['images'] : ['videos'],
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === "image") {
        setForm(prev => ({
          ...prev,
          thumbnail: result.assets[0],
        }))
      }
      if (type === "video") {
        setForm(prev => ({
          ...prev,
          video: result.assets[0],
        }))
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picking was cancelled", JSON.stringify(result, null, 2));
      }, 100);
    }
  }


  const handleSubmit = async () => {
    if (!form.title || !form.thumbnail || !form.video || !form.prompt) {
      Alert.alert("Please fill all the fields");
      return;
    }
    try {
      setUploading(true);
      await createVideo({
        ...form,
        userId: user?.$id,
      });
      Alert.alert("Video uploaded successfully");
    } catch (error) {
      Alert.alert("Error uploading video", (error as Error).message);
    } finally {
      setUploading(false);
      // setForm({
      //   title: "",
      //   thumbnail: null,
      //   video: null,
      //   prompt: "",
      // });
    }
  }


  return (
    <>
      <SafeAreaView className='bg-primary h-full'>
        <ScrollView className='px-4 my-6'>
          <Text className='text-2xl text-white font-psemibold'>
            Upload Video
          </Text>
          <FormField label="Video Title" value={form.title} onChangeText={(text) => handleChange("title", text)}
            placeholder='Give your video a catch title...'
            otherStyles='mt-10'
          />
          <View className='mt-7 gap-2'>
            <Text className='text-base text-gray-100 font-pmedium'>Upload Video</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handlePicker('video')}
            >
              {form.video ? <>
                <VideoView
                  style={{ width: "100%", height: 256, borderRadius: 16, }}
                  player={player}
                />

              </> : <>
                <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                  <View className='w-14 h-14 border border-dashed border-secondary-100 justify-center items-center'>
                    <Image source={icons.upload as any} className='w-1/2 h-1/2' resizeMode='contain' />
                  </View>
                </View>
              </>}


            </TouchableOpacity>

          </View>
          <View className='mt-7 gap-2'>
            <Text className='text-base text-gray-100 font-pmedium'>Thumbnail Image</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handlePicker('image')}
            >
              {form.thumbnail ? <>
                <Image source={{ uri: form?.thumbnail?.uri }}
                  className='w-full h-64 rounded-2xl'
                />

              </> : <>
                <View className='w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2  border-black-200 flex-row gap-2'>

                  <Image source={icons.upload as any} className='w-5 h-5' resizeMode='contain' />
                  <Text className='text-sm text-gray-100 font-pmedium'>Choose a file</Text>

                </View>
              </>}
            </TouchableOpacity>

            <FormField label="AI Prompt" value={form.prompt} onChangeText={(text) => handleChange("prompt", text)}
              placeholder='Enter your AI prompt'
              otherStyles='mt-10'
            />
            <CustomButton onPress={handleSubmit} containerStyles="mt-7" isLoading={uploading}>Submit & Publish</CustomButton>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default Create