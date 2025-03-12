import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList, Pressable, Modal, ScrollView } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { getCategoriasFiltro, getPLato, getAreasFiltro, getIngredientesFiltro } from '../services/ApiRecetas';
import { GlobalContext } from '../context/GlobalContext';
import { getPais } from '../services/paisesService';

const MainRecetas = () => {
    const { DataFood, setDataFood } = useContext(GlobalContext);
    const { SelectedFood, setSelectedFood } = useContext(GlobalContext);
    const [filtro, setFiltro] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [backModal, setBackModal] = useState(styles.container);
    const navigation = useNavigation();

    const randomFood = ['Beef', 'Chicken', 'Pork', 'Lamb', 'Vegetarian', 'Vegan', 'Dessert', 'Seafood', 'Breakfast', 'Pasta', 'Starter', 'Side', 'Miscellaneous'];


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
        } else  if (DataFood.filtro === 'i') {
            const fetchFiltro = async () => {
                console.log('contexto', DataFood);
                const data = await getIngredientesFiltro(DataFood.text);
                setFiltro(data);
            };
            fetchFiltro();
        }
             else {
            const fetchFiltro = async () => {
                console.log('contexto', DataFood);
                const data = await getPLato(DataFood.text);
                setFiltro(data);
            };
            fetchFiltro();
        }
    }, [DataFood]);
    const traerImagenBander = async (nameBand) => {
            let x = nameBand.ToLowerCase();
            const data = await getPais(x);
            console.log(data);
            return <Image source={{uri: data[0].bandera}} style={{width:100, height:100}}/>;
    };

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

    const ingredientes = () => {
        let ingredientesArray = [];
    
        for (let i = 1; i < 21; i++) {
            if (SelectedFood[0][`strIngredient${i}`] !== '' && SelectedFood[0][`strIngredient${i}`] !== null) {
                ingredientesArray.push(
                    <Text key={i}>{SelectedFood[0][`strIngredient${i}`]} - {SelectedFood[0][`strMeasure${i}`]}</Text>
                );
            }
        }
    
        return ingredientesArray; // Devuelve todos los ingredientes como un array de elementos JSX
    };

    const cambio = () =>{
        let random = Math.floor(Math.random() * randomFood.length);
        console.log(randomFood[random]);
        if(DataFood.text !== randomFood[random]){
            setDataFood(prevState => ({
                ...prevState,
                text: randomFood[random],
            }));
        } else {
            cambio();
        }
        
    }

    console.log('filtro', SelectedFood);
    return (
        <>
            <View style={backModal}>
                <View style={styles.head}>
                <Pressable onPress={() => cambio()} style={styles.btnOptions}><Text>Cambiar</Text></Pressable>
                <Pressable onPress={() => navigation.navigate('Filtros')} style={styles.btnOptions}><Text>Filtro</Text></Pressable>
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
                                <Pressable
                                    style={[styles.btnModal, styles.buttonOpen]}
                                    onPress={() => fetchFood(item.strMeal)}>
                                    <Text style={styles.textStyle}>Ver mas</Text>
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
                                <ScrollView style={{ maxHeight: 250 }}>
                                <Text><Text style={styles.titleModal}>Plato:</Text> {SelectedFood[0].strMeal}</Text>
                                <Text><Text style={styles.titleModal}>Ingredientes principales:</Text> {SelectedFood[0].strTags}</Text>
                                <Text><Text style={styles.titleModal}>Area:</Text> {() => traerImagenBander(SelectedFood[0].strArea)}</Text>
                                
                                {ingredientes()}
                                
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
                                </ScrollView>
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
    btnOptions: {
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
    },
    titleModal:{
        fontWeight: 'bold',
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
        marginRight: 10,
        justifyContent: 'flex-start',
        width: '95%',
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
        textAlign: 'center',
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
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    modalText: {
        marginBottom: 5,
        textAlign: 'center',
    },
    imageContainer: {
        position: 'relative',  // Coloca la imagen en la parte superior
        top: -35,              // La mueve hacia arriba fuera del modal
        alignSelf: 'center',   // La centra horizontalmente


    },
});

export default MainRecetas;