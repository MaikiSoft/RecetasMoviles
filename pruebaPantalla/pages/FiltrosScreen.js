import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, TextInput,ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getCategorias, getAreas, getIngredientes, getPLato } from '../services/ApiRecetas';
import { GlobalContext } from '../context/GlobalContext';

export default function FiltrosScreen() {
  const { DataFood, setDataFood } = useContext(GlobalContext);
  const [categoria, setCategoria] = useState([]);
  const [area, setArea] = useState([]);
  const [ingrediente, setIngrediente] = useState([]);
  const [selected, setSelected] = useState('');
  const [verLista, setVerLista] = useState(false);
  const [AutoCompletar, setAutoCompletar] = useState([]);
  const [text, setText] = useState('');

  const navigation = useNavigation();


  const salir = () => {
    navigation.navigate('Tabs');
  }

  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await getCategorias();
      setCategoria(data);
    };
    const fetchAreas = async () => {
      const data = await getAreas();
      setArea(data);
    };
    const fetchIngredientes = async () => {
      const data = await getIngredientes();
      setIngrediente(data);
    };
    fetchIngredientes();
    fetchCategorias();
    fetchAreas();
  }, []);

  useEffect(() => {
    if (text.length > 2) {
      getPLato(text)
        .then((meals) => {
          setAutoCompletar(meals || []);
        })
        .catch((error) => console.error(error));
    } else {
      setAutoCompletar([]);
    }
  }, [text]);

  

  const vistaLista = (select) => {
    if (selected === select) {
      setSelected('');
      setVerLista(false);
    } else {
      setSelected(select);
      setVerLista(true);
    }
  };

  const lista = (select) => {
    let x = [];
    let text = '';
    if (select === 'Categoria') {
      x = categoria;
      text = 'strCategory';
    }
    if (select === 'Area') {
      x = area;
      text = 'strArea';
    }
    if (select === 'Ingredientes') {
      x = ingrediente;
      text = 'strIngredient';
    }

    return (
      <>
        {x.map((cat, index) => (
          <Pressable key={index} style={styles.options} onPress={() => aplicarFiltro(cat[text], select)}>
            <Text>{cat[text]}</Text>
          </Pressable>
        ))}
      </>
    );
  };

  const aplicarFiltro = (filtroName, filtro) => {
    setDataFood(prevState => ({
      ...prevState,
      filtro: filtro[0].toLowerCase(),
      text: filtroName,
    }));
    console.log('filtro', DataFood);
    navigation.goBack()
  }
  const handleSelect = (filtroName) => {
    setDataFood(prevState => ({
      ...prevState,
      filtro: '',
      text: filtroName,
    }));
    console.log('filtro', DataFood);
    navigation.goBack()
  };
  return (
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.containerHead}>
      <TextInput
        style={styles.input}
        placeholder="Buscar receta..."
        value={text}
        onChangeText={setText}
      />
        <Pressable style={styles.btnExit} onPress={() => salir()}>
          <Image source={require('../assets/eliminar.png')} style={{ width: 20, height: 20 }} />
        </Pressable>
        </View>
        <View style={styles.resultsSearch}>       
           {AutoCompletar.length > 0 && (
        <FlatList
          data={AutoCompletar}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item.strMeal,)}>
              <Text style={styles.AutoCompletar}>{item.strMeal}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionList}
        />
      )}</View>

      
      <View style={styles.containerHead}>
        <Pressable onPress={() => vistaLista('Categoria')} style={styles.btnSelect}>
          <Text>Categorias</Text>
        </Pressable>
        <Pressable onPress={() => vistaLista('Area')} style={styles.btnSelect}>
          <Text>Áreas</Text>
        </Pressable>
        <Pressable onPress={() => vistaLista('Ingredientes')} style={styles.btnSelect}>
          <Text>Ingredientes</Text>
        </Pressable>
      </View>
      {verLista && <View style={styles.listas}>{selected !== '' ? lista(selected) : <Text>Cargando...</Text>}</View>}
      <StatusBar style="auto" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsSearch: {
    marginVertical: 10,
    width: '70%',
    marginHorizontal: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 200,
    alignItems: 'center',
  },
  containerHead: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  AutoCompletar: {
    padding: 10, 
    borderBottomWidth: 1, 
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  btnSelect: {
    backgroundColor: '#DCDDDC',
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  btnExit: {
    backgroundColor: 'red',
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  options: {
    backgroundColor: '#DCDDDC',
    padding: 10,
    borderRadius: 10,
    width: 200,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  listas: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buscar: {
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: 20,
    marginHorizontal: 5,
    height: 40,
    width: 200,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    width: 200,
    borderRadius: 10,
  },
});
