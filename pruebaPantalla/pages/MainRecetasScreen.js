import { StyleSheet, Text, View, Image, FlatList, Pressable, Modal, ScrollView, ImageBackground } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCategoriasFiltro, getPLato, getAreasFiltro, getIngredientesFiltro } from '../services/ApiRecetas';
import { GlobalContext } from '../context/GlobalContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const MainRecetas = () => {

    const { DataFood, setDataFood } = useContext(GlobalContext);
    const { SelectedFood, setSelectedFood } = useContext(GlobalContext);
    const [filtro, setFiltro] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [backModal, setBackModal] = useState(styles.container);
    const navigation = useNavigation();

    const randomFood = ['Beef', 'Chicken', 'Pork', 'Lamb', 'Vegetarian', 'Vegan', 'Dessert', 'Seafood', 'Breakfast', 'Pasta', 'Starter', 'Side', 'Miscellaneous'];
    const { favoritos, toggleFavorito } = useContext(GlobalContext);

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
        } else if (DataFood.filtro === 'i') {
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

    const cambio = () => {
        let random = Math.floor(Math.random() * randomFood.length);
        console.log(randomFood[random]);
        if (DataFood.text !== randomFood[random]) {
            setDataFood(prevState => ({
                ...prevState,
                text: randomFood[random],
            }));
        } else {
            cambio();
        }

    }

    const logout = async () => {
        try {
            await signOut(auth);
            console.log('cerrada');
            navigation.replace('Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };


    const renderItem = ({ item }) => (
        <Pressable style={styles.card} onPress={() => fetchFood(item.strMeal)}>
            <Image source={{ uri: item.strMealThumb }} style={styles.image} />

            <Pressable style={styles.favoriteButton} onPress={() => toggleFavorito(item.idMeal)}>
                {favoritos.has(item.idMeal) ? (<Icon name="favorite" size={35} color="red" />) :
                    (
                        <Icon name="favorite-border" size={35} color="black" />
                    )}
            </Pressable>

            <View style={styles.textContainer}>
                <Text style={styles.mealName}>{item.strMeal}</Text>
            </View>
        </Pressable>
    );

    //console.log(receta)
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/Bufett.jpg')}
                style={styles.background} imageStyle={styles.imageBack} resizeMode="cover">
            <FlatList
                ListHeaderComponent={
                    <>
                        <View style={styles.profileView}>
                            <View style={styles.leftColumn}>
                                <Text style={styles.text}>Foto Perfil</Text>
                            </View>
                            <View style={styles.rightColumn}>
                                <Text style={styles.text}>Nombre</Text>
                                <Text style={styles.text}>email</Text>
                                <Text style={styles.text}>Rectas favoritas:</Text>
                            </View>
                        </View>
                        <View style={styles.head}>
                            <Pressable onPress={() => cambio()} style={styles.btnOptions}><Text>Cambiar</Text></Pressable>
                            <Pressable onPress={() => navigation.navigate('Filtros')} style={styles.btnOptions}><Text>Filtro</Text></Pressable>
                            <Pressable onPress={logout} style={styles.btnOptions}><Text>Cerrar Sesion</Text></Pressable>
                        </View>
                    </>
                }
                data={filtro}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.row}
                />
            </ImageBackground>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
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
                                                navigation.navigate("PasoRecetas", { receta: SelectedFood[0] })
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
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnOptions: {
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: 'orange',
    },
    profileView: {
        flexDirection: 'row', // Organiza en fila
        width: '100%',
        height: 200,
        padding: 10,
    },
    leftColumn: {
        flex: 1,
        backgroundColor: '#FFA07A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        borderRadius: 10,
    },
    rightColumn: {
        flex: 1.5,
        backgroundColor: '#FF6347',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        borderRadius: 10,
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    row: {
        justifyContent: 'space-around',
    },
    card: {
        width: 170,
        height: 200,
        borderRadius: 15,
        backgroundColor: '#FFDAB9',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginVertical: 10,
        position: 'relative',
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    textContainer: {
        width: '100%',
        backgroundColor: 'white',
        paddingVertical: 5,
        alignItems: 'center',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    mealName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#8B4513', // Marrón cálido
        textAlign: 'center',
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
        textAlign: 'center',
        maxWidth: 200,
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
    containerDark: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 50,
        justifyContent: 'flex-start',
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
    titleModal: {
        fontWeight: 'bold',
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
    buttonClose: {
        backgroundColor: '#E4080A',
    },
    buttonRedirect: {
        backgroundColor: '#7DDA58',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageBack: {
        opacity: 0.8,
    },
    text: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    }
});

export default MainRecetas;