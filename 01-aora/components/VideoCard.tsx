import { icons, videoSource } from '@/constants';
import { useEvent, useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    video: {
        title: string;
        thumbnail: string;
        video: string;
        creator: {
            username: string;
            avatar: string;
        }
    }
}



const VideoCard: React.FC<Props> = ({ video: { title, thumbnail, video, creator: {
    username,
    avatar
} }, }) => {
    const [play, setPlay] = useState(false);

    // Create a player for this item
    const player = useVideoPlayer(
        video || videoSource,
        (p) => {
            p.loop = true;
            // start paused; will play when user taps
            p.pause();
        }
    );
    useEventListener(player, "playToEnd", () => {
        setPlay(false);
    });


    // Listen to playing state (optional, for button text or debugging)
    const { isPlaying } = useEvent(player, "playingChange", {
        isPlaying: player.playing,
    });

    const handlePlay = () => {
        setPlay(true);
        player.play();
    };


    return (
        <>
            <View className='flex-col items-center px-4 mb-14'>
                <View className='flex-row gap-3 items-center'>
                    <View className='justify-center items-center flex-row flex-1'>
                        <View className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5'>
                            <Image source={{ uri: thumbnail }} className='w-full h-full rounded-lg' resizeMode="cover" />
                        </View>
                        <View className='justify-center flex-1 ml-3 gap-y-1'>
                            <Text className='text-white font-psemibold text-sm' numberOfLines={1}>
                                {title}
                            </Text>
                            <Text className='text-gray-100 font-pregular text-xs' numberOfLines={1}>
                                {username}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Image source={icons.menu as any} className='w-5 h-5' resizeMode='contain' />
                    </View>
                </View>

                {play ? (
                    <VideoView
                        style={{ width: "100%", height: 240, borderRadius: 12, marginTop: 12 }}
                        player={player}
                        allowsPictureInPicture
                        fullscreenOptions={{
                            enable: true,
                        }} />
                ) : (
                    <TouchableOpacity className='w-full h-60 rounded-xl mt-3 justify-center items-center relative' activeOpacity={0.7} onPress={handlePlay}>
                        <Image source={{ uri: thumbnail }} className='w-full h-full rounded-xl mt-3' resizeMode="cover" />
                        <Image source={icons.play as any} className='w-12 h-12 absolute' resizeMode="contain" />
                    </TouchableOpacity>
                )}

            </View>
        </>
    )
}

export default VideoCard