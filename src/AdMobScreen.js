import React, { Component } from 'react';
import { 
  FlatList,
  Dimensions,
  Platform,
  View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';

const BANNER_ID_ANDROID = "ca-app-pub-4021080639697239/6665836038"
const BANNER_ID_IOS = "ca-app-pub-4021080639697239/4481460168"

export default class AdMobScreen extends React.Component {
  render(){
      return <View style={{margin: 30}}>
              <BannerAd
                      unitId={Platform.OS=='android'?BANNER_ID_ANDROID:BANNER_ID_IOS}
                      size={BannerAdSize.BANNER}
                  />
              </View>
  }
}