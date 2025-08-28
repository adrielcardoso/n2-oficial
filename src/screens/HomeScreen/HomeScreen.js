import React, { useEffect, useMemo } from "react";
import { StatusBar, SafeAreaView, View, Alert, Platform, TouchableOpacityBase, TouchableOpacity } from "react-native";
import { Avatar, Button, ButtonGroup, Header, Image, Text } from "react-native-elements";
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import LottieView from 'lottie-react-native';
import { useSelector } from "react-redux";
import AdMobScreen from "../../AdMobScreen";
import { RewardedAd, TestIds } from '@react-native-firebase/admob';
import { RewardedAdEventType } from '@react-native-firebase/admob';

const rewarded_android = "ca-app-pub-4021080639697239/7410701799"
const rewarded_ios = "ca-app-pub-4021080639697239/6097620128"
const rewarded = RewardedAd.createForAdRequest(Platform.OS=="android"?rewarded_android:rewarded_ios, {
    requestNonPersonalizedAdsOnly: true,
});

rewarded.onAdEvent((type, error, reward) => {
  if (type === RewardedAdEventType.LOADED) {
    rewarded.show();
  }
  if (type === RewardedAdEventType.EARNED_REWARD) {
    console.log('User earned reward of ', reward);
  }
});

export default class HomeScreen extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      currentUser: null,
      momentoSucesso: false
    }
  }

  DummyView = () => {
      if(!this.state.currentUser){
          const currentUser = useSelector(state => state.auth.user)
          useEffect(() => {
              this.setState({
                  currentUser : currentUser
              })
          }, [])
          console.log(currentUser)
      }
      return null
  }

  render(){
    return (
      <>
        {!this.state.momentoSucesso ? 
        <Header
          // centerComponent={{ text: 'NUMERO 2 💩', style: { color: '#fff', fontWeight:"bold" } }}
          containerStyle={{
            backgroundColor:"#fff"
          }}
          centerComponent={
              <Image
                  style={{width: 200,height: 100}}
                  source={require('../../../assets/numero2.png')}  />
          }
          rightComponent={{ onPress: () => {
            Alert.alert(
              'Informativo',
              'o botão registrar momento, ajudará a registrar esse momento tão especial! 💩',
              [
                {
                  text: 'Ok', onPress: () => {}
                }
              ],
              {cancelable: false},
            );
          }, icon: 'info', color: '#fff', iconStyle: { color: '#fff', fontWeight:"bold"} }}
        />:<View/>}
        <this.DummyView/>
        <SafeAreaView style={{ flex: 1, alignItems: 'center',
                  backgroundColor:"#fff",
                  justifyContent: 'center' }}>
            
            {this.state.momentoSucesso ? 
            <View style={{backgroundColor:"#fff"}}>
              <LottieView source={require('../../../assets/sucesso.json')} loop autoPlay style={{width: 300}} />
              <Text style={{textAlign:"center", color:"#696969", fontSize: 20}}>Momento registrado com sucesso</Text>
              <Button type="clear" 
                titleStyle={{
                    color:"#2293f4",
                    fontWeight:"bold"
                }}
                onPress={() => {
                  this.setState({
                    momentoSucesso: false
                  })
                  this.props.navigation.navigate('CalendarioScreen', {
                    reload: true
                  })
                }}
                loading={this.state.loading}
                buttonStyle={{
                    borderWidth:1,
                    borderColor:"#2293f4",
                    marginTop: 20
                }} title={"CONTINUAR"} />
            </View> : <View/>}

            {!this.state.momentoSucesso ? 
            <View style={{alignItems:"center"}}>
              <AwesomeButtonRick 
              onPress={async () => this.props.navigation.navigate('RegistrarScreen', {
                currentUser:this.state.currentUser, callback: (date) => {
                  this.setState({momentoSucesso: true, lastMoment: date})
                }
              })}
              borderWidth={1}
              borderColor={"#cdcdcd"}
              borderRadius={200}
              backgroundColor={"#fff"}
              backgroundShadow={"#cdcdcd"}
              width={300}
              height={300}>
                  <LottieView source={require('../../../assets/papel.json')} autoPlay style={{width: 150}} />
            </AwesomeButtonRick> 
            </View>: <View/> }
            <View style={{paddingTop:20, alignItems:"center"}}>
              <TouchableOpacity onPress={() => {
                  rewarded.load();
              }}>
                  <LottieView source={require('../../../assets/video.json')} autoPlay style={{width: 100}} />
              </TouchableOpacity>
              <AdMobScreen />
            </View>
        </SafeAreaView>
      </>
    );
  }
}

