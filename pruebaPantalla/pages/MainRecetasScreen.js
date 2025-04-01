import { StyleSheet, Text, View, Image, FlatList, Pressable, Modal, ScrollView, ImageBackground } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCategoriasFiltro, getPLato, getAreasFiltro, getIngredientesFiltro } from '../services/ApiRecetas';
import { GlobalContext } from '../context/GlobalContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';

const MainRecetas = () => {

    const { DataFood, setDataFood } = useContext(GlobalContext);
    const { SelectedFood, setSelectedFood } = useContext(GlobalContext);
    const [recetas, setRecetas] = useState([]);
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

    useEffect(() => {
        console.log("entra al use");
        if (!auth.currentUser) return;
        console.log("entra al use2");
        const recetasRef = ref(db, `usuarios/${auth.currentUser.uid}/recetas`);
        const unsubscribe = onValue(recetasRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const recetasArray = Object.entries(data).map(([id, receta]) => ({
                    id,
                    ...receta,
                }));
                setRecetas(recetasArray);
                console.log("Recetas desde la BD:", recetasArray);
                console.log("lo que trae", data)
            } else {
                console.log("No hay recetas en la BD");
                setRecetas([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchFood = async (name) => {
        if (name.strCategory !== "Receta propia") {
            const data = await getPLato(name.strMeal);
            setSelectedFood(data);
            console.log("after modal", SelectedFood)
        } else {
            const data = recetas.find((receta) => receta.idMeal === name.idMeal);
            setSelectedFood([data]);
            console.log("after modal", SelectedFood)
        }
        setBackModal(styles.containerDark);
        setModalVisible(true);
    };

    const CloseModal = () => {
        setModalVisible(!modalVisible);
        setBackModal(styles.container);
    }

    const ingredientes = () => {
        const ingredientesArray = [];
        for (let i = 1; i <= 20; i++) {
            const ingrediente = SelectedFood[0][`strIngredient${i}`];
            const medida = SelectedFood[0][`strMeasure${i}`];

            if (ingrediente && ingrediente.trim() !== '') {
                ingredientesArray.push(
                    <Text key={i}>{ingrediente} - {medida}</Text>
                );
            }
        }
        return ingredientesArray;
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

    const eliminarReceta = (recetaId) => {
        if (!auth.currentUser) return;

        const recetaRef = ref(db, `usuarios/${auth.currentUser.uid}/recetas/${recetaId}`);

        remove(recetaRef)
            .then(() => {
                alert("Receta eliminada exitosamente!");
                setRecetas((prevRecetas) => prevRecetas.filter(receta => receta.idMeal !== recetaId));
            })
            .catch((error) => {
                console.error("Error al eliminar la receta: ", error);
                alert("Hubo un error al eliminar la receta. Intenta nuevamente.");
            })
            .finally(() => {
                misRecetas();
            })
            ;
    }

    const renderItem = ({ item }) => (
        <Pressable style={styles.card} onPress={() => fetchFood(item)}>
            <Image source={{ uri: item.strMealThumb }} style={styles.image} />
            {item.strCategory === "Receta propia" ? (
                <Pressable style={styles.deleteButton} onPress={() => eliminarReceta(item.id)}>
                    <Icon name="delete" size={35} color="red" />
                </Pressable>
            ) : ''}

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

    const misRecetas = () => {
        setFiltro(recetas);
        console.log('filtro', filtro)
    }
    console.log(recetas)
    console.log(auth.currentUser.uid)
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/Bufett.jpg')}
                style={styles.background} imageStyle={styles.imageBack} resizeMode="cover">
                <FlatList
                    ListHeaderComponent={
                        <>
                            <View style={styles.profileView}>
                                <View style={styles.client}>
                                    <Text style={styles.text}>Nombre</Text>
                                </View>
                                <View style={styles.config}>
                                    <Pressable onPress={() => navigation.navigate('CrearReceta')}>
                                        <Image source={require('../assets/conf.png')} style={{ width: 30, height: 30 }} />
                                    </Pressable>
                                </View>
                            </View>
                            <View style={styles.head}>
                                <Pressable onPress={() => cambio()} style={styles.btnOptions}><Text>Cambiar</Text></Pressable>
                                <Pressable onPress={() => navigation.navigate('Filtros')} style={styles.btnOptions}><Text>Filtro</Text></Pressable>
                                <Pressable onPress={() => misRecetas()} style={styles.btnOptions}><Text>mis recetas</Text></Pressable>
                            </View>
                        </>
                    }
                    data={filtro}
                    extraData={recetas}
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
        marginTop: 40,
        marginBottom: 20,
        height: 50,
        padding: 10,
    },
    config: {
        backgroundColor: 'white',
        width: 50,
        height: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    client: {
        backgroundColor: 'white',
        width: '80%',
        height: 50,
        marginRight: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
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
    deleteButton: {
        position: 'absolute',
        top: 10,
        left: 10,
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