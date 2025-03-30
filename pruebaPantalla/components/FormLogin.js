import { Pressable, StyleSheet, Text, TextInput, View, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebaseConfig';

export const FormLogin = () => {
  const [email, setEmail] = useState({});
  const [password, setPassword] = useState({});

  //const [initializing, setInitializing] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace('Tabs');
      }
      //setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Tabs');
    } catch (error) {
      console.log(error);
    }
  }

  const registrarse = async () => {
    console.log(email.text);
    console.log(password);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response.user);
      setModalVisible(true)
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <View style={styles.cont}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          placeholder="ejemplo@email.com"
          placeholderTextColor="#8B4513"
          style={styles.input}
          onChangeText={(text) =>
            setEmail(text)}
        />
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="********"
          placeholderTextColor="#8B4513"
          style={styles.input}
          onChangeText={(text) =>
            setPassword(text)}
          secureTextEntry
        />
        <Pressable style={styles.messagePassword}>
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </Pressable>
        <View style={styles.containerBtn}>
          <Pressable style={styles.btnLogin} onPress={handleSubmit}>
            <Text style={styles.btnText}>Login</Text>
          </Pressable>
          <Pressable style={[styles.btnLogin, styles.registerBtn]} onPress={registrarse}>
            <Text style={styles.btnText}>Register</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Usuario creado con exito</Text>
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}>
              <Text>Cerrar Ventana</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  messagePassword: {
    alignItems: 'flex-end',
    marginBottom: 15
  },
  cont: {
    width: '100%',
    margin: 'auto'
  },
  label: {
    fontSize: 16,
    color: '#D2691E', // Marrón cálido
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 228, 181, 0.7)', // Crema translúcido
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 8,
    fontSize: 16,
    color: '#8B4513',
  },
  containerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  btnLogin: {
    flex: 1,
    height: 50,
    backgroundColor: '#FF8C00', // Naranja fuerte
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  registerBtn: {
    backgroundColor: '#CD853F', // Marrón suave
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
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
  }
});