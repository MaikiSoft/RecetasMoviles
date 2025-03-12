import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList, Pressable, Modal, ScrollView, ImageBackground } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { getCategoriasFiltro, getPLato, getAreasFiltro, getIngredientesFiltro } from '../services/ApiRecetas';
import { GlobalContext } from '../context/GlobalContext';

const MainRecetas = () => {
    const fondo = {uri: 'https://previews.123rf.com/images/tkuzminka/tkuzminka2204/tkuzminka220400063/184750090-cartel-de-manta-de-picnic-rojo-fondo-de-dise%C3%B1o-a-cuadros-a-cuadros-banner-rojo-gingham-para-la.jpg'}
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
                <ImageBackground source={fondo} resizeMode="cover" style={{ justifyContent: 'center', flex: 1}}>
                <FlatList
                    data={filtro}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image
                                source={{ uri: item.strMealThumb }}
                                style={{ width: 150, height: 150, borderRadius: 10, marginLeft: 10 }}
                            />
                            <View style={{ padding: 10 }}>
                                <Text style={{fontSize:20, textAlign:'center', maxWidth:200, width:200}}>{item.strMeal}</Text>
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
                    style={{ flex: 1 }}
                />
            </ImageBackground>
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
                                    <Image source={{ uri: SelectedFood[0].strMealThumb }} style={{ width: 350, height: 250, borderTopLeftRadius: 20, borderTopRightRadius: 20}} />
                                </View>
                                <ScrollView style={{ maxHeight: 250 }}>
                                <Text><Text style={styles.titleModal}>Plato:</Text> {SelectedFood[0].strMeal}</Text>
                                <Text><Text style={styles.titleModal}>Ingredientes principales:</Text> {SelectedFood[0].strTags}</Text>
                                <Text><Text style={styles.titleModal}>Ingredientes:</Text></Text>
                                
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
        backgroundColor: 'orange',
    },
    container: {
        flex: 1,
        backgroundColor: '#b0b0b0',
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
        backgroundColor: '#d6eeff',
        flexDirection: 'row',
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
        textAlign:'center',
        maxWidth:200, 
        margin: 'auto',
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
        position: 'relative',  
        top: -35,         
        alignSelf: 'center',   


    },
});

export default MainRecetas;