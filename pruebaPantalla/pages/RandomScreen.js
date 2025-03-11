import { StyleSheet, Text, View, Image, Pressable, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { getRecetaRandom } from '../services/ApiRecetas';
import { getPais } from '../services/paisesService';

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
            const data = await getPais(area);
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
            setArea(recetaData[0].strArea.toLowerCase());
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
                        <Text>Prueba una receta de:</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            pais && (
                                <View style={styles.card}>
                                    <Text>{pais.nombre}</Text>
                                    <Image source={{ uri: pais.bandera }} style={styles.iconTab} />
                                </View>
                            )
                        )}
                        <Pressable
                            style={styles.button}
                            onPress={() => {
                                setModalVisible(false)
                                navigation.navigate("PasoRecetas")
                            }}>
                            <Text style={styles.textStyle}>Ver receta</Text>
                        </Pressable>
                        <Pressable
                            style={styles.button}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>

                    </View>
                </View>
            </Modal>
            <View style={{ paddingBottom: 10 }}>
                <Image
                    style={styles.iconTab}
                    source={{
                        uri: 'https://reactnative.dev/img/tiny_logo.png',
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
        backgroundColor: '#000',
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: 'orange'
    },
    modalView: {
        height: 300,
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