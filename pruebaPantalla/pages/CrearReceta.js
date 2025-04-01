import { View, Text, TextInput, Pressable, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../firebaseConfig';
import { ref, push } from 'firebase/database';
import uuid from 'react-native-uuid';

const CrearReceta = () => {
  const [nombreReceta, setNombreReceta] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [pasos, setPasos] = useState([]);
  const [imagenURL, setImagenURL] = useState('');
  const [videoURL, setVideoURL] = useState('');

  const agregarIngrediente = () => {
    setIngredientes([...ingredientes, { nombre: '', cantidad: '', unidad: 'gramos' }]);
  };

  const eliminarIngrediente = (index) => {
    setIngredientes(ingredientes.filter((_, i) => i !== index));
  };

  const actualizarIngrediente = (index, campo, valor) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes[index][campo] = valor;
    setIngredientes(nuevosIngredientes);
  };

  const agregarPaso = () => {
    setPasos([...pasos, '']);
  };

  const eliminarPaso = (index) => {
    setPasos(pasos.filter((_, i) => i !== index));
  };

  const actualizarPaso = (index, valor) => {
    const nuevosPasos = [...pasos];
    nuevosPasos[index] = valor;
    setPasos(nuevosPasos);
  };


  const guardarReceta = () => {
    const idReceta = uuid.v4();
    if (!nombreReceta || ingredientes.length === 0 || pasos.length === 0) {
      alert('Por favor, completa todos los campos antes de guardar la receta.');
        return;
    }
    const recetaRef = ref(db, `usuarios/${auth.currentUser.uid}/recetas/`);
    let ingredientesFormat = {};
    ingredientes.forEach((ingrediente, index) => {
      if (ingrediente.nombre) {
        ingredientesFormat[`strIngredient${index + 1}`] = ingrediente.nombre;
        ingredientesFormat[`strMeasure${index + 1}`] = `${ingrediente.cantidad} ${ingrediente.unidad}`;
      }
    });

     
    const receta = {
      idMeal: idReceta,
      strMeal: nombreReceta,
      strCategory: 'Receta propia',
      strArea: 'Receta propia',
      strInstructions: pasos.join('\n'),
      strMealThumb: imagenURL,
      strTags: null,
      strYoutube: videoURL,
      ...ingredientesFormat,
    };

    push(recetaRef, receta)
      .then(() => {
        alert('Receta guardada exitosamente!');
        setNombreReceta('');
        setIngredientes([]);
        setPasos([]);
        setImagenURL('');
        setVideoURL('');
      })
      .catch((error) => {
        console.error('Error al guardar la receta: ', error);
        alert('Hubo un error al guardar la receta. Intenta nuevamente.');
      });
 };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Receta</Text>

      <Text>Nombre de la receta</Text>
      <TextInput
        placeholder="Nombre de la receta"
        style={styles.input}
        value={nombreReceta}
        onChangeText={setNombreReceta}
      />

      <Text>Ingredientes</Text>
      {ingredientes.map((ingrediente, index) => (
        <View key={index} style={styles.contAdd}>
          <View style={[styles.inputGroup, { flex: 2 }]}>
            <Text>Ingrediente</Text>
            <TextInput
              placeholder="Ej: Harina"
              style={[styles.input, { width: '100%' }]}
              value={ingrediente.nombre}
              onChangeText={(text) => actualizarIngrediente(index, 'nombre', text)}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 2 }]}>
            <Text>Cantidad</Text>
            <TextInput
              placeholder="Ej: 200"
              keyboardType="numeric"
              style={[styles.input, { width: '100%' }]} 
              value={ingrediente.cantidad}
              onChangeText={(text) => actualizarIngrediente(index, 'cantidad', text)}
            />
          </View>

          <View style={[styles.inputGroup, {flex: 2}]}>
            <Text>Unidades</Text>
            <Picker
              selectedValue={ingrediente.unidad}
              onValueChange={(itemValue) => actualizarIngrediente(index, 'unidad', itemValue)}
              style={[styles.input, { width: '100%'}]} 
            >
              <Picker.Item label="Gramos" value="gramos" />
              <Picker.Item label="Kilos" value="kilos" />
              <Picker.Item label="Miligramos" value="miligramos" />
              <Picker.Item label="Cucharadas" value="cucharadas" />
              <Picker.Item label="Mililitros" value="mililitros" />
              <Picker.Item label="Litros" value="litros" />
            </Picker>
          </View>

          <Pressable onPress={() => eliminarIngrediente(index)} style={styles.deleteButton}>
            <Image source={require('../assets/eliminar.png')} style={{ width: 20, height: 20 }} />
          </Pressable>
        </View>
      ))}
      <Pressable onPress={agregarIngrediente} style={styles.addButton}>
        <Text style={styles.addButtonText}>Añadir Ingrediente</Text>
      </Pressable>

      <Text>Pasos</Text>
      {pasos.map((paso, index) => (
        <View key={index} style={styles.contAdd}>
          <View style={styles.inputGroup}>
            <Text>Paso {index + 1}</Text>
            <TextInput
              placeholder={`Ej: Mezclar la harina`}
              style={styles.input}
              value={paso}
              onChangeText={(text) => actualizarPaso(index, text)}
            />
          </View>
          <Pressable onPress={() => eliminarPaso(index)} style={styles.deleteButton}>
            <Image source={require('../assets/eliminar.png')} style={{ width: 20, height: 20 }} />
          </Pressable>
        </View>
      ))}
      <Pressable onPress={agregarPaso} style={styles.addButton}>
        <Text style={styles.addButtonText}>Añadir Paso</Text>
      </Pressable>

      <Text>URL de Imagen</Text>
      <TextInput
        placeholder="Pega aquí la URL de la imagen"
        style={styles.input}
        value={imagenURL}
        onChangeText={setImagenURL}
      />

      <Text>URL de Video</Text>
      <TextInput
        placeholder="Pega aquí la URL del video"
        style={styles.input}
        value={videoURL}
        onChangeText={setVideoURL}
      />

      <Pressable onPress={guardarReceta} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar Receta</Text>
      </Pressable>
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  contAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  inputGroup: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CrearReceta;
