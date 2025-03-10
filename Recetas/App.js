import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getCategorias, getAreas, getIngredientes } from './service/ApiRecetas';
import { useState, useEffect } from 'react';
import { TextInput } from 'react-native-web';
import React from 'react';
import VistaRecetas from './pages/vistaRecetas';

export default function App() {
  const [categoria, setCategoria] = useState({});
  const [area, setArea] = useState({});
  const [ingrediente, setIngrediente] = useState({});
  const [selected, setSelected] = useState('');
  const [verLista, setVerLista] = useState(styles.btnVista);

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

  console.log("categorias:", categoria.strCategory);
  console.log("areas:", area);
  console.log("ingredientes:", ingrediente);

  const vistaLista = (select) => {
    x = selected;
    setSelected(select);

    console.log("categorias:", select);
    
    if (verLista === styles.btnVista) {
      setVerLista(styles.btnVistaVisible);

    } else if(x == select){
      setSelected(''); 
      setVerLista(styles.btnVista);
    }
  };

  const lista = (select) => {
    let x = select
    let text = '';
    if (x === 'Categoria') {
      x = categoria;
      text = 'strCategory';
    }
    if (x === 'Area') {
      x = area;
      text = 'strArea';
    }
    if (x === 'Ingredientes') {
      x = ingrediente;
      text = 'strIngredient';
    }
    console.log(x, text);
    return (
      <>
        {x.map((cat, index) => (
          <View key={index}>
            <Pressable style={styles.options} onPress={() => modalFiltro(cat[text])}>{cat[text]}</Pressable>
            {console.log(cat.text)}
          </View>
        ))}
      </>
    );
  }

  const modalFiltro = (text) => {
    console.log('filtro:', text);
    VistaRecetas(text);
  }
  

  return (
    <View>
      <View style={styles.containerHead}>
        <TextInput placeholder="Buscar receta" style={styles.buscar} />
        <Pressable style={styles.btnSelect}>Buscar</Pressable>
      </View>
      <View>
        <View>
          <View style={styles.containerHead}>
          <Pressable onPress={() => vistaLista('Categoria')} style={styles.btnSelect}>Categorias</Pressable>
          <Pressable onPress={() => vistaLista('Area')} style={styles.btnSelect}>Areas</Pressable>
          <Pressable onPress={() => vistaLista('Ingredientes')} style={styles.btnSelect}>Ingredientes</Pressable>
          </View>
          <View style={[verLista, styles.listas]} >
            {selected !== '' ? (
              lista(selected)
            ) : (
              <View>
                <Text>Cargando...</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerHead: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buscar: {
    fontSize: 20,
    border: '1px solid #000',
    marginVertical: 20,
    marginHorizontal: 5,
    height: 40,
    width: 200,
    borderRadius: 10,
  },
  btnBuscar: {
    backgroundColor: '#000',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  btnVista: {
    display: 'none',
  },
  btnVistaVisible: {
    padding: 10,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSelect:{
    backgroundColor: '#DCDDDC',
    padding: 10,
    border: '1px solid #000',
    boxShadow: '1px 1px 1px #DCDDDC',
    borderRadius: 10,
  },
  options: {
    backgroundColor: '#DCDDDC',
    padding: 10,
    borderRadius: 10,
    width: 200,
    marginVertical: 2,
    border: '1px solid #000',
  },
});
