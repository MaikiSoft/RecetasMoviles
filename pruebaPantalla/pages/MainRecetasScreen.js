import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList, Pressable, Modal } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getCategoriasFiltro, getPLato, getAreasFiltro, getIngredientesFiltro } from '../services/ApiRecetas';
import { GlobalContext } from '../context/GlobalContext';

const MainRecetas = () => {
    const { DataFood } = useContext(GlobalContext);
    const { SelectedFood, setSelectedFood } = useContext(GlobalContext);
    const [filtro, setFiltro] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [backModal, setBackModal] = useState(styles.container);

    const navigation = useNavigation();

    useEffect(() => {
        if (DataFood.filtro === 'c') {
            const fetchFiltro = async () => {
                console.log('contexto', DataFood);
                const data = await getCategoriasFiltro(DataFood.text);
                setFiltro(data);
            };
            fetchFiltro();
        }
        else if (DataFood.filtro === 'a') {
            const fetchFiltro = async () => {
                console.log('contexto', DataFood);
                const data = await getAreasFiltro(DataFood.text);
                console.log(data)
                setFiltro(data);
            };
            fetchFiltro();
        } else {
            const fetchFiltro = async () => {
                console.log('contexto', DataFood);
                const data = await getIngredientesFiltro(DataFood.text);
                setFiltro(data);
            };
            fetchFiltro();
        }
    }, [DataFood]);

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
                    <Pressable onPress={() => navigation.navigate('Filtros')}><Text>Filtro</Text></Pressable>
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
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri: SelectedFood[0].strMealThumb }} style={{ width: 350, height: 250, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
                                </View>
                                <Text style={styles.modalText}>hola {SelectedFood[0].strTags}</Text>
                                <View style={styles.buttonContainer}>
                                    <Pressable
                                        style={[styles.btnModal, styles.buttonClose]}
                                        onPress={() => CloseModal()}>
                                        <Text style={styles.textStyle}>cerrar</Text>
                                    </Pressable>

                                    <Pressable
                                        style={[styles.btnModalRecetas, styles.buttonRedirect]}
                                        onPress={() => {
                                            CloseModal()
                                            navigation.navigate("PasoRecetas", { receta: SelectedFood[0]})
                                        }}>
                                        <Text style={styles.textStyle}>Ver receta</Text>
                                    </Pressable>
                                </View>
                            </>

                        ) : (
                            <><Text style={styles.modalText}>cargando...</Text>
                                <View style={styles.buttonContainer}>
                                    <Pressable
                                        style={[styles.btnModal, styles.buttonClose]}
                                        onPress={() => CloseModal()}>
                                        <Text style={styles.textStyle}>error</Text>
                                    </Pressable>

                                    <Pressable
                                        style={[styles.btnModalRecetas, styles.buttonClose]}
                                        onPress={() => CloseModal()}>
                                        <Text style={styles.textStyle}>Ver receta</Text>
                                    </Pressable>
                                </View>
                            </>)}
                    </View>
                </View>
            </Modal>
            <StatusBar style="auto" />
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

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
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
    btnModalRecetas: {
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
        margin: 80,
        justifyContent: 'top',
        alignItems: 'center',
    },
    modalView: {
        width: 350,
        height: 'auto',
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
        backgroundColor: '#4489FE',
    },
    buttonClose: {
        backgroundColor: '#E4080A',
    },
    buttonRedirect: {
        backgroundColor: '#7DDA58',
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
    imageContainer: {
        position: 'relative',  // Coloca la imagen en la parte superior
        top: -35,              // La mueve hacia arriba fuera del modal
        alignSelf: 'center',   // La centra horizontalmente


    },
});

export default MainRecetas;