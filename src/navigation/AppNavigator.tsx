import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import PlayersScreen from '../screens/PlayersScreen';
import NewGameScreen from '../screens/NewGameScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import HistoryScreen from '../screens/HistoryScreen';
import GameDetailScreen from '../screens/GameDetailScreen';
import { RootStackParamList } from '../types';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const PlayersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Players" component={PlayersScreen} />
  </Stack.Navigator>
);

const NewGameStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NewGame" component={NewGameScreen} />
  </Stack.Navigator>
);

const LeaderboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
  </Stack.Navigator>
);

const HistoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="History" component={HistoryScreen} />
    <Stack.Screen name="GameDetail" component={GameDetailScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Feather.glyphMap = 'circle';

            if (route.name === 'PlayersTab') {
              iconName = focused ? 'users' : 'users';
            } else if (route.name === 'NewGameTab') {
              iconName = focused ? 'plus-circle' : 'plus-circle';
            } else if (route.name === 'LeaderboardTab') {
              iconName = focused ? 'award' : 'award';
            } else if (route.name === 'HistoryTab') {
              iconName = focused ? 'clock' : 'clock';
            }

            return <Feather name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.primary[500],
          tabBarInactiveTintColor: COLORS.neutral[400],
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: COLORS.neutral[200],
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        })}
      >
        <Tab.Screen 
          name="PlayersTab" 
          component={PlayersStack} 
          options={{ tabBarLabel: 'Players' }}
        />
        <Tab.Screen 
          name="NewGameTab" 
          component={NewGameStack} 
          options={{ tabBarLabel: 'New Game' }}
        />
        <Tab.Screen 
          name="LeaderboardTab" 
          component={LeaderboardStack} 
          options={{ tabBarLabel: 'Leaderboard' }}
        />
        <Tab.Screen 
          name="HistoryTab" 
          component={HistoryStack} 
          options={{ tabBarLabel: 'History' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;