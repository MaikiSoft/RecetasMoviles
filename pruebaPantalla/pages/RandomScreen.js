import { StyleSheet, Text, View, Image, Pressable, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { getRecetaRandom } from '../services/ApiRecetas';
import { getPais, getPaisPorNombre } from '../services/paisesService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RandomScreen = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [area, setArea] = useState("american");
    const [receta, setReceta] = useState([]);
    const [pais, setPais] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPais = async () => {
            setLoading(true);
            const data = area != 'usa' ? await getPais(area) : await getPaisPorNombre(area);
            setPais(data[0]);
            setLoading(false);
        };
        fetchPais();
    }, [area]);

    const OpenModal = async () => {
        setLoading(true);
        const recetaData = await getRecetaRandom();
        if (recetaData.length > 0) {
            setReceta(recetaData[0]);
            let areaCorrecta = recetaData[0].strArea.toLowerCase() == 'american' ? 'usa' : recetaData[0].strArea.toLowerCase();
            setArea(areaCorrecta);
        }
        setModalVisible(true);
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 28, paddingBottom: 5, textAlign: 'center' }}>Prueba una receta de:</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            pais && (
                                <View>
                                    <Text style={{ fontSize: 20, paddingBottom: 20, textAlign: 'center' }}>{pais.nombre}</Text>
                                    <Image source={{ uri: pais.bandera }} style={styles.bandera} />
                                </View>
                            )
                        )}
                        <View style={styles.buttonContainer}>
                            <Pressable
                                style={styles.button}
                                onPress={() => {
                                    setModalVisible(false)
                                    navigation.navigate("PasoRecetas", {receta: receta})
                                }}>
                                <Text style={styles.textStyle}>Ver receta</Text>
                            </Pressable>
                            <Pressable
                                style={styles.button}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Cerrar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={{ paddingBottom: 10 }}>
                <View style={{ alignItems: 'center'}} >
                    <Icon name="keyboard-arrow-down" size={65} color="red" />
                </View>
                <Image
                    style={{width:300, height:300}}
                    source={{
                        uri: 'https://th.bing.com/th/id/R.f92f4215313a66c9583afb66238b8baa?rik=7fjLJzmiZlrAKQ&pid=ImgRaw&r=0',
                    }}
                />
            </View>
            <Pressable
                style={styles.button}
                onPress={OpenModal}>
                <Text >Prueba algo nuevo</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#04023E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconTab: {
        width: 35,
        height: 35,
    },
    bandera: {
        width: 170,
        height: 100,
        borderWidth: 3,
        borderColor: 'black'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 10
    },
    button: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: 'orange',
        marginHorizontal:10
    },
    modalView: {
        height: 360,
        width: 300,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default RandomScreen;