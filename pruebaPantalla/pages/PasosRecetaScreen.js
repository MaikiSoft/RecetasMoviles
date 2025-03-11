import { WebView } from 'react-native-webview';
import { StyleSheet, Image, View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';

const PasosRecetaScreen = () => {
    const route = useRoute();
    const { receta } = route.params;

    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state) => {
        if (state === 'ended') {
            setPlaying(false);
        }
    }, []);

    //console.log(receta)
    return (
        <View style={styles.container}>
            <Text style={styles.text}>¡Bienvenido a la nueva pantalla!</Text>
            <Text style={styles.text}>{receta.strMeal}</Text>
            <Image source={{ uri: receta.strMealThumb }} style={{ width: 100, height: 100 }}></Image>
            <View>
                <Text>video</Text>
                <YoutubePlayer
                    height={400}
                    width={300}
                    play={playing}
                    videoId={receta.strYoutube.split("v=")[1]} 
                    onChangeState={onStateChange}
                    WebView={WebView}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default PasosRecetaScreen