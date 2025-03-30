import { StyleSheet, Image, View, Text, FlatList, Pressable, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';


const PasosRecetaScreen = () => {
    const image = { uri: 'https://img.freepik.com/premium-vector/top-view-picnic-summer-design_91128-80.jpg?w=996' };

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
                    <Text style={styles.description}>{item.texto}</Text>
                </View>
            )}
        </Pressable>
    );

    //console.log(receta)
    return (

        <View style={styles.container}>
            <ImageBackground source={image} resizeMode="cover" style={{ justifyContent: 'center', flex: 1}}>
                <Text style={styles.text}>{receta.strMeal}</Text>
                <FlatList
                    ListHeaderComponent={
                        <>
                            <View>
                                <Image source={{ uri: receta.strMealThumb }} style={styles.imagenContainer}></Image>
                            </View>
                        </>
                    }
                    data={instrucciones}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListFooterComponent={
                        <>
                            <View style={{margin:'auto', borderWidth:3}}>
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
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#04023E',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color:'white'
    },
    item: {
        backgroundColor: 'orange',
        width: 300,
        padding: 20,
        marginVertical: 8,
        borderRadius:20,
        borderWidth: 3,
        borderColor: 'black',
        margin: 'auto'
    },
    imagenContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        borderWidth: 1,
        borderRadius: 100,
        height: 200,
        width: 200,
        margin:'auto'
    },
    title: {
        fontSize: 18,
    },
    description: {
        marginTop: 10,
    },
});

export default PasosRecetaScreen