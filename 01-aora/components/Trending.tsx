import { icons, videoSource } from '@/constants';
import { useEvent, useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useState } from 'react';
import { FlatList, Image, ImageBackground, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface Item {
    $id: any,
    thumbnail: string,
    video: string,
}
interface Props {
    posts: Item[]
}
interface ItemProps {
    activeItem: any,
    item: Item,
}

const zoomIn: any = {
    0: {
        scale: 0.9
    },
    1: {
        scale: 1.1
    }
}

const zoomOut: any = {
    0: {
        scale: 1
    },
    1: {
        scale: 0.9
    }
}




const TrendingItem: React.FC<ItemProps> = ({ activeItem, item }) => {
    const [play, setPlay] = useState(false);

    // Create a player for this item
    const player = useVideoPlayer(
        item.video || videoSource,
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

    return <>
        <Animatable.View className='mr-5' animation={activeItem === item?.$id ? zoomIn : zoomOut} duration={500} >
            {play ? <VideoView
                style={{ width: 208, height: 288, borderRadius: 35, marginTop: 12, backgroundColor: "rgba(255,255,255,0.1)", }}
                player={player}
                allowsPictureInPicture
                fullscreenOptions={{
                    enable: true,
                }}

            /> :
                <TouchableOpacity className='relative items-center justify-center' activeOpacity={0.7} onPress={handlePlay}>
                    <ImageBackground source={{ uri: item?.thumbnail }} className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40' resizeMode='cover' />
                    <Image source={icons.play as any} className='absolute w-12 h-12' resizeMode='contain' />
                </TouchableOpacity>
            }

        </Animatable.View>

    </>
}

const Trending: React.FC<Props> = ({ posts }) => {
    const [activeItem, setActiveItem] = useState(posts[0]);
    const handleViewableItemsChanged = ({ viewableItems }: { viewableItems: any }) => {
        if (viewableItems && viewableItems?.length > 0) {
            setActiveItem(viewableItems?.[0]?.key);
        }

    }
    return (
        <>
            <FlatList
                data={posts}
                keyExtractor={(item) => item?.$id?.toString()}
                renderItem={({ item }) => {
                    return <>
                        <TrendingItem activeItem={activeItem} item={item} />
                    </>
                }}
                onViewableItemsChanged={handleViewableItemsChanged}

                viewabilityConfig={{
                    itemVisiblePercentThreshold: 70
                }}

                horizontal
            />
        </>
    )
}

export default Trending