import { StyleSheet, Image, View, Text, FlatList, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';


const PasosRecetaScreen = () => {
    const route = useRoute();
    const { receta } = route.params;

    const [playing, setPlaying] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const instrucciones = receta.strInstructions.split(/\r\n/).filter(item => item.trim() !== '').map((texto, index) => ({ id: (index + 1).toString(), texto }));

    const onStateChange = useCallback((state) => {
        if (state === 'ended') {
            setPlaying(false);
        }
    }, []);

    const renderItem = ({ item }) => (
        <Pressable
            onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
            style={styles.item}
        >
            <Text style={styles.title}>{(item.id)}</Text>
            {expandedId === item.id && (
                <View>
                    {/* <Image source={{ uri: item.image }} style={styles.image} /> */}
                    <Text style={styles.description}>{item.texto}</Text>
                </View>
            )}
        </Pressable>
    );

    //console.log(receta)
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{receta.strMeal}</Text>
            <View style={styles.imagenContainer}>
                <Image source={{ uri: receta.strMealThumb }} style={{ width: 200, height: 180 }}></Image>
            </View>
            <FlatList
                data={instrucciones}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListFooterComponent={
                    <>
                        <View>
                            <YoutubePlayer
                                height={200}
                                width={330}
                                play={playing}
                                videoId={receta.strYoutube.split("v=")[1]}
                                onChangeState={onStateChange}
                            />
                        </View>
                    </>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    item: {
        backgroundColor: 'orange',
        width: 300,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    imagenContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom:10
    },
    title: {
        fontSize: 18,
    },
    description: {
        marginTop: 10,
    },
});

export default PasosRecetaScreen