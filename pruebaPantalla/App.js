import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import RandomScreen from './pages/RandomScreen';
import FavoritosScreen from './pages/FavoritosScreen';
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
      <Tab.Screen
        name="Favoritos"
        component={FavoritosScreen}
        options={{
          title: 'Recetas favoritas',
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
        <SafeAreaView  style={styles.container}>
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
    
  },
  iconTab: {
    width: 35,
    height: 35,
  },

});
