import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList, Pressable, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { getCategoriasFiltro, getPLato, getAreasFiltro, getIngredientesFiltro } from '../services/ApiRecetas';

const MainRecetas = () => {
    const [filtro, setFiltro] = useState({});
    const [SelectedFood, setSelectedFood] = useState({});
    const textFiltro = 'Beef';
    const [modalVisible, setModalVisible] = useState(false);
    const [backModal, setBackModal] = useState(styles.container);

    useEffect(() => {
        const fetchFiltro = async () => {
            const data = await getCategoriasFiltro(textFiltro);
            setFiltro(data);
        };
        fetchFiltro();
    }, []);

    const fetchFood = async (name) => {
        const data = await getPLato(name);
        setSelectedFood(data);
        setBackModal(styles.containerDark);
        setModalVisible(true)
    };

    const CloseModal = () => {
        setModalVisible(!modalVisible);
        setBackModal(styles.container);
    }

    console.log('filtro', SelectedFood);
    return (
        <>
            <View style={backModal}>
                <View style={styles.head}>
                    <Text>volver</Text>
                    <Text>Categoria</Text>
                </View>

                <FlatList
                    data={filtro}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image
                                source={{ uri: item.strMealThumb }}
                                style={{ width: 150, height: 150 }}
                            />
                            <View style={{ padding: 10 }}>
                                <Text>{item.strMeal}</Text>
                                <Text>Area</Text>
                                <Pressable
                                    style={[styles.btnModal, styles.buttonOpen]}
                                    onPress={() => fetchFood(item.strMeal)}>
                                    <Text style={styles.textStyle}>Show Modal</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={<Text>No hay datos</Text>}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    style={{ flex: 1 }} // Asegura que FlatList use todo el espacio disponible
                />
                <StatusBar style="auto" />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {SelectedFood.length > 0 ? (

                            <>
                                <Text style={styles.modalText}>hola {SelectedFood[0].strTags}</Text>
                                <Pressable
                                    style={[styles.btnModal, styles.buttonClose]}
                                    onPress={() => CloseModal()}>
                                    <Text style={styles.textStyle}>Hide Modal</Text>
                                </Pressable>
                            </>

                        ) : (
                            <><Text style={styles.modalText}>cargando...</Text>
                                <Pressable
                                    style={[styles.btnModal, styles.buttonClose]}
                                    onPress={() => CloseModal()}>
                                    <Text style={styles.textStyle}>Hide Modal</Text>
                                </Pressable>
                            </>)}
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
    },
    containerDark: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 50,
        justifyContent: 'flex-start',
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        marginLeft: 10,
        justifyContent: 'flex-start',
        width: '100%',
        marginTop: 10,
        height: 200,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    btnModal: {
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10,
        borderWidth: 1,
        backgroundColor: '#5BB3FF',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: 300,
        height: 300,
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
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default MainRecetas;