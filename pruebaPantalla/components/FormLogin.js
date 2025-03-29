import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import app from '../firebaseConfig';

export const FormLogin = () => {
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const [initializing, setInitializing] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {

        navigation.replace('Tabs');
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async () => {
    const auth = getAuth();
    const email = data.email;
    const password = data.password;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Tabs');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <View style={styles.cont}>
        <Text>Username</Text>
        <TextInput placeholder="example@tbri.com" style={styles.input} value={data.email} onChangeText={(text) => {
          setData({
            ...data,
            email: text
          })
        }} />
        <Text>Password</Text>
        <TextInput placeholder="********" style={styles.input} value={data.password} onChangeText={(text) => {
          setData({
            ...data,
            password: text
          })
        }} secureTextEntry />
        <Pressable style={styles.messagePassword}><Text>¿Olvidaste tu contraseña?</Text></Pressable>
        <View style={styles.containerBtn}>
          <Pressable style={styles.btnLogin} onPress={() => handleSubmit()}><Text>Login</Text></Pressable>
          <Pressable style={styles.btnLogin}><Text>Register</Text></Pressable>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  messagePassword: {
    alignItems: 'flex-end',
  },
  cont: {
    width: '90%',
    margin: 'auto'
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  containerBtn:{
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems:'center',
},
btnLogin:{
    margin: 'auto',
    paddingVertical: 10,
    width:'40%',
    justifyContent:'center',
    alignItems:'center',
    height: '100%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
}
});