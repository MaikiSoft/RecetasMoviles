import { FormLogin } from '../components/FormLogin'
import { StyleSheet, ImageBackground, Text} from 'react-native'
import { BlurView } from 'expo-blur';

export const LoginScreen = () => {
    return (
        <>
            <ImageBackground source={require('../assets/Buffet2.jpg')}
                style={styles.background}
                imageStyle={styles.image}
                resizeMode="cover"
            >
                <BlurView intensity={150} style={styles.containerLogin}>
                    <Text style={styles.title}>Bienvenido a FoodApp</Text>
                        <FormLogin/>
                </BlurView>
            </ImageBackground>
        </>
    )
}

const styles = StyleSheet.create({
    containerLogin: {
        width: '85%',
        padding: 25,
        borderWidth: 5,
        borderColor: '#a25900',
        borderRadius: 5,
        backgroundColor: 'rgba(255, 140, 0, 0.3)',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        opacity: 0.8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#D2691E',
        marginBottom: 20,
    },
})