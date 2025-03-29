import { FormLogin } from '../components/FormLogin'
import {StyleSheet, View} from 'react-native'

export const LoginScreen = () => {
    return (
        <>
        <View style={styles.container}>
            <View style={styles.containerLogin}>
                <FormLogin></FormLogin>
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    containerLogin: {
        backgroundColor: '#fcfcfc',
        width: '80%',
        marginTop: '30%',
        height: '40%',
        borderWidth: 2,
        borderColor: '#000',
        borderRadius:7,
    },
    container: {
        flex: 1,
        backgroundColor: '#fdfedb',
        alignItems: 'center',
        justifyContent: 'center',
      },
})