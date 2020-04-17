import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, Platform, StatusBar } from 'react-native';
import { FontAwesome, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import Reducer from './reducers';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { purple, white, gray, black, red } from './utils/colors';
import Constants from 'expo-constants';
import { setLocalNotification } from './utils/notifications';
import AddCard from './components/AddCard';
import DeckLists from './components/DeckLists';
import AddDeck from './components/AddDeck';
import DeckDetail from './components/DeckDetail';
import Quiz from './components/Quiz';
import { blueDark } from './utils/colors';

//initializing App Nav apps
let AppTabs;
if (Platform.OS === 'ios') {
  AppTabs = createBottomTabNavigator();
} else {
  AppTabs = createMaterialTopTabNavigator();
}

//setting up custom header status bar for the app
const AppStatusBar = ({ backgroundColor, ...props }) => {
  return (
    <View style={{ backgroundColor: backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

//setting up tab bar icon for the nav header
const tabBarIcon = (tab, focused, color) => {
  let iconName;

  if (tab === "Decks") {
    iconName = 'elementor';
    return <FontAwesome5 name={iconName} size={27} color={color} />;
  } else if (tab === "Add Deck") {
    iconName = 'plus-square';
    return <FontAwesome name={iconName} size={27} color={color} />;
  }

}

//setting up screen for main view
const MainScreenTab = () => {
  return (
    <AppTabs.Navigator
      screenOptions={({ route }) => ({

      })}
      tabBarOptions={{
        activeTintColor: Platform.OS === 'ios' ? blueDark : blueDark,
        inactiveTintColor: Platform.OS === 'ios' ? black : black,
        showIcon: true,
        style: {
          height: 65,
          backgroundColor: Platform.OS === 'ios' ? white : white,
          shadowColor: 'rgba(0,0,0,0.24)',
          shadowOffset: {
            width: 0,
            height: 3
          },
          color: black,
          shadowRadius: 6,
          shadowOpacity: 1,
        },
        labelStyle: { fontSize: 14, textTransform: 'capitalize', fontWeight: 'bold' }
      }}

    >
      <AppTabs.Screen
        name="Decks"
        component={DeckLists}
        options={{ tabBarIcon: ({ focused, color, size }) => (tabBarIcon('Decks', focused, color, size)) }}

      />
      <AppTabs.Screen
        name="Add Deck"
        component={AddDeck}
        options={{ tabBarIcon: ({ focused, color, size }) => (tabBarIcon('Add Deck', focused, color, size)) }}
      />
    </AppTabs.Navigator>
  );
}

//Setting up App Stack for Nav
const MainNavigator = createStackNavigator();
const MainNavigatorStackScreen = () => {
  return (
    <MainNavigator.Navigator>
      <MainNavigator.Screen name="Home" component={MainScreenTab} options={{ title: 'Decks', headerStyle: {},headerShown:false }} />
      <MainNavigator.Screen name="AddCard" component={AddCard} options={{ title: 'Add Card',  headerBackTitleVisible:true, headerStyle: { backgroundColor: white }, headerTintColor: blueDark, headerTitleAlign: 'center' }} />
      <MainNavigator.Screen name="DeckDetail" component={DeckDetail} options={{ title: 'Deck Detail', headerBackTitleVisible: true,  headerStyle: { backgroundColor: white }, headerTintColor: blueDark, headerTitleAlign: 'center' }} />
      <MainNavigator.Screen name="Quiz" component={Quiz} options={{ title: 'Quiz', headerBackTitleVisible: true,  headerStyle: { backgroundColor: white }, headerTintColor: blueDark, headerTitleAlign: 'center' }} />
    </MainNavigator.Navigator>
  );
}

//setting up app redux store
const store = createStore(
  Reducer, applyMiddleware(thunk)
)

export default class App extends React.Component {

  //setting up local notification after app
  componentDidMount() {
    setLocalNotification()
  }
  render() {
    return (

      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <AppStatusBar backgroundColor={blueDark} barStyle='light-content' />
          <NavigationContainer>
            <MainNavigatorStackScreen />
          </NavigationContainer>
        </View>
      </Provider>

    );
  }
}

