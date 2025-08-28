import { Platform } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import { IMChatScreen } from '../Core/chat';
import {
  IMEditProfileScreen,
  IMUserSettingsScreen,
  IMContactUsScreen,
  IMProfileSettingsScreen,
} from '../Core/profile';
import { IMAllFriendsScreen } from '../Core/socialgraph/friendships';
import { IMNotificationScreen } from '../Core/notifications';
import { FeedSearchScreen, DetailPostScreen, ProfileScreen } from '../screens';
import { IMLocalized } from '../Core/localization/IMLocalization';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import RegistrarScreen from '../screens/HomeScreen/RegistrarScreen';
import BIScreen from '../screens/HomeScreen/BIScreen';

const MainStack = createStackNavigator();
const MainStackNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackTitle: IMLocalized('Back'),
        headerShown: false
      }}
      initialRouteName="HomeScreen">
      <MainStack.Screen
        name="NavStack"
        options={{ headerShown: false }}
        component={BottomTabNavigator}
      />
      <MainStack.Screen name="BIScreen" component={BIScreen} />
      <MainStack.Screen name="RegistrarScreen" component={RegistrarScreen} />
      {/* <MainStack.Screen name="PersonalChat" component={IMChatScreen} /> */}
      {/* <MainStack.Screen
        options={{ headerShown: false }}
        name="FeedSearch"
        component={FeedSearchScreen}
      />
      <MainStack.Screen name="MainDetailPost" component={DetailPostScreen} />
      <MainStack.Screen name="MainProfile" component={ProfileScreen} />
      <MainStack.Screen name="Notification" component={IMNotificationScreen} />
      <MainStack.Screen
        name="ProfileSettings"
        component={IMProfileSettingsScreen}
      />
      <MainStack.Screen name="EditProfile" component={IMEditProfileScreen} />
      <MainStack.Screen name="AppSettings" component={IMUserSettingsScreen} />
      <MainStack.Screen name="ContactUs" component={IMContactUsScreen} />
      <MainStack.Screen name="AllFriends" component={IMAllFriendsScreen} />
      <MainStack.Screen
        name="MainProfilePostDetails"
        component={DetailPostScreen}
      /> */}
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
