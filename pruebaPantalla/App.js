import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import RandomScreen from './pages/RandomScreen';
import Main from './pages/MainRecetasScreen';
import {LoginScreen} from './pages/LoginScreen';
import PasosReceta from './pages/PasosRecetaScreen';
import FiltroScreen from './pages/FiltrosScreen'
import { GlobalProvider } from './context/GlobalContext';

export default function App() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  const TabNavigator = () => (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Main}
        options={{
          title: 'Principal',
          tabBarIcon: ({ focused }) => (
            <Image source={require('./assets/icon.png')} style={styles.iconTab} />
          ),
        }}
      />
      <Tab.Screen
        name="Random"
        component={RandomScreen}
        options={{
          title: 'Receta Aleatoria',
          tabBarIcon: ({ focused }) => (
            <Image source={require('./assets/icon.png')} style={styles.iconTab} />
          ),
        }}
      />
    </Tab.Navigator>
  )

  return (
    <SafeAreaProvider>
      <GlobalProvider>
      <NavigationContainer>
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
          <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="PasoRecetas" component={PasosReceta}></Stack.Screen>
            <Stack.Screen name="Filtros" component={FiltroScreen}></Stack.Screen>
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
      </GlobalProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  iconTab: {
    width: 35,
    height: 35,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: 300,
    height: 300,
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
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
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
});
