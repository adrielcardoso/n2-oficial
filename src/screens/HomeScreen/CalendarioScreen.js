import React, { useEffect, useMemo } from "react";
import { StatusBar, SafeAreaView, View, Alert, ActivityIndicator } from "react-native";
import { Avatar, Button, ButtonGroup, Header, Image, ListItem, Text } from "react-native-elements";
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import LottieView from 'lottie-react-native';
import { useSelector } from "react-redux";
import RNMonthly from "react-native-monthly";
import {Agenda, LocaleConfig, Calendar} from 'react-native-calendars';
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome';
import { firebase } from './../../Core/api/firebase/config';
import { ScrollView } from "react-native-gesture-handler";
import AdMobScreen from "../../AdMobScreen";

// import { RewardedAd, TestIds } from '@react-native-firebase/admob';
// import { RewardedAdEventType } from '@react-native-firebase/admob';

// const rewarded_android = "ca-app-pub-4021080639697239/7410701799"
// const rewarded_ios = "ca-app-pub-4021080639697239/6097620128"
// const rewarded = RewardedAd.createForAdRequest(Platform.OS=="android"?rewarded_android:rewarded_ios, {
//     requestNonPersonalizedAdsOnly: true,
// });

// rewarded.onAdEvent((type, error, reward) => {
//   if (type === RewardedAdEventType.LOADED) {
//     rewarded.show();
//   }
//   if (type === RewardedAdEventType.EARNED_REWARD) {
//     console.log('User earned reward of ', reward);
//   }
// });

moment.locale('pt-br');

export default class CalendarioScreen extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      currentUser: null,
      momentos: [],
      loading: true,
      momentosUnicos: [],
      itens: [],
      size: ['P', 'M', 'G', 'GG', 'XG'],
      currentDate: moment(new Date()).format('YYYY-MM-DD')
    }
  }

  componentWillMount(){
    LocaleConfig.locales['pt'] = {
      monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
      monthNamesShort: ['Jan.','Fev.','Mar','Abr','Mai','Jun','Jul.','Ago','Set.','Out.','Nov.','Dez.'],
      dayNames: ['Domingo', 'Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
      dayNamesShort: ['Dom.','Seg.','Ter.','Qua.','Qui.','Sex.','Sab.'],
      today: 'Hoje\'hui'
    };
    LocaleConfig.defaultLocale = 'pt';
  }

  DummyView = () => {
      if(!this.state.currentUser){
          const currentUser = useSelector(state => state.auth.user)
          useEffect(() => {
              this.setState({
                  currentUser : currentUser
              }, () => this.loadMonth(moment(new Date()).format('YYYY-MM-DD')))
          }, [])
      }
      return null
  }

  loadMonth = (month) => {
    let mes = new Date(month)
    mes.setDate(0)
    mes.setHours(0, 0, 0)
    let mesAte = new Date(month)
    mesAte.setDate(moment(mesAte).daysInMonth())
    mesAte.setHours(23, 59, 59)
    firebase.firestore().collection('momentos')
        .where('userId', '==', this.state.currentUser.id)
        .where('dt', '>=', mes)
        .where('dt', '<=', mesAte)
        .get().then((querySnapshot) => {
          this.setSnap(querySnapshot, month)
        })
  }

  loadSingleMonth = (month) => {
      firebase.firestore().collection('momentos')
        .where('userId', '==', this.state.currentUser.id)
        .where('dt', '>=', new Date(month.dateString + 'T00:00:00'))
        .where('dt', '<=', new Date(month.dateString + 'T23:59:59'))
        .get().then((querySnapshot) => {
          this.setSnap(querySnapshot)
        })
  }

  setSnap = (querySnapshot, month) => {
    let data = {}
    let momentos = []
    querySnapshot.forEach((doc) => {

      let date = doc.data().dt.toDate()

      let dateStr = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')

      let tempDoc = {
        id: doc.id,
        ...doc.data(), 
      }
      if(!data[dateStr]){
        data[dateStr] = {
          dots: []
        }
      }
      if(!data[dateStr].dots){
        data[dateStr]["dots"] = []
      }
      data[dateStr].dots.push(
        {key: 'workout', color: 'green'}
      )
      data[dateStr].selected = true

      momentos.push({...tempDoc, date: date})
    })

    if(month){

      console.log(data)

      this.setState({
        markItens:data, 
        momentos: momentos, 
        loading: false,
      })
    }else{
      this.setState({
        momentosUnicos: momentos, 
        momentos: momentos, 
        loading: false,
      })
    }
    // this.setState({
    //   markItens:data, 
    //   momentosUnicos: momentos, 
    //   loading: false,
    // }, () => {
    //   // if(!month) return;
    //   // this.setState({
    //   //   momentosUnicos: momentos.filter(single => 
    //   //     single.dateStr == moment(month).format('YYYY-MM-DD'))
    //   // })
    // })
  }

  render(){
    return (
      <>
        <this.DummyView/>
        <ScrollView>
          <Header
            centerComponent={
                <Image
                    style={{width: 100,height: 50}}
                    source={require('../../../assets/numero2.png')}  />
            }
            containerStyle={{
              backgroundColor:"#fff"
            }}
            // centerComponent={{ text: 'NUMERO 2 💩', style: { color: '#fff', fontWeight:"bold" } }}
            rightComponent={{ onPress: () => {
              Alert.alert(
                'Informativo',
                'os dias com marcações representam dias com Momentos registrados! 💩',
                [
                  {
                    text: 'Ok', onPress: () => {}
                  }
                ],
                {cancelable: false},
              );
            }, icon: 'info', color: '#696969', iconStyle: { color: '#696969', fontWeight:"bold"} }}
          />
          <Calendar
            monthFormat={'MM/yyyy'}
            markedDates={this.state.markItens}
            // markedDates={{
            //   '2021-08-25': {selected: true, marked: true, selectedColor: 'blue'},
            // }}
            enableSwipeMonths={true}
            current={this.state.currentDate}
            onDayLongPress={(month) => this.props.navigation.navigate('RegistrarScreen', {
              currentUser:this.state.currentUser, callback: (lastMoment) => {
                
                this.loadMonth(moment(lastMoment).format('YYYY-MM-DD'))
                this.setState({
                  currentDate: moment(lastMoment).format('YYYY-MM-DD'),
                  loading: true,
                  momentoSucesso: true, lastMoment: lastMoment
                })

                // this.loadSingleMonth({dateString:moment(lastMoment).format('YYYY-MM-DD')})
                // rewarded.load();
              }, 
              paramday: month
            })}
            onDayPress={(month) => {
              this.setState({
                currentDate: month.dateString,
                loading: true
              }, () => this.loadSingleMonth(month))
            }}
            onMonthChange={async (month) => {
              this.setState({
                loading: true,
                currentDate: month.dateString,
              }, () => this.loadMonth(moment(month.dateString).format('YYYY-MM-DD')))
            }}
            firstDay={1}
            onPressArrowLeft={subtractMonth => subtractMonth()}
            onPressArrowRight={addMonth => addMonth()}
          />
           <Text style={{
              textAlign:"center",
              fontSize: 15,
              fontWeight:"bold",
              color:"#696969",
              margin: 20
            }}>
              Dia Selecionado {moment(this.state.currentDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}</Text>
          <View>
              {this.state.loading ? <ActivityIndicator size="large" color="#0e88f2" /> : <View/>}
              {!this.state.loading && this.state.momentosUnicos.length==0?<View style={{
                alignItems:"center",
                padding: 20
              }}>
                  <Text style={{
                    textAlign:"center",
                    fontSize: 20,
                    fontWeight:"bold",  
                    color:"#696969",
                    marginBottom: 20
                  }}>
                    Não existem registros de momentos no dia {moment(this.state.currentDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}</Text>
                  <LottieView source={require('./../../../assets/vazio.json')} autoPlay style={{width: 200}} />
              </View>:<View/>}
              {this.state.momentosUnicos.map(single => {
                return <ListItem key={single.id} bottomDivider onPress={() => this.props.navigation.navigate('RegistrarScreen', {
                  current: single, 
                  scenary: 'PUT',
                  currentUser:this.state.currentUser, callback: (lastMoment) => {
                    
                    this.setState({momentoSucesso: true, lastMoment: lastMoment})
                    this.loadMonth(moment(lastMoment).format('YYYY-MM-DD'))
                    this.setState({
                      currentDate: moment(lastMoment).format('YYYY-MM-DD'),
                      loading: true
                    })

                    this.loadSingleMonth({dateString:moment(lastMoment).format('YYYY-MM-DD')})

                  }
                })}>
                    <LottieView source={require('./../../../assets/papel.json')} autoPlay style={{width: 50}} />
                    <ListItem.Content>
                      <ListItem.Title>{moment(single.date).format('DD/MM/YYYY HH:mm')}</ListItem.Title>
                      <ListItem.Subtitle>{"Resultado do momento: "+this.state.size[single.size]}</ListItem.Subtitle>
                      <ListItem.Subtitle>{single.descricao?single.descricao:"Não foi registrado observações"}</ListItem.Subtitle>
                      {
                        single.tipoCoco&&single.tipoCoco.id ? 
                        <View style={{margin:10, alignItems:"center"}}>
                          <Text style={{paddingTop: 10,paddingBottom:10, color:"#696969", fontWeight:"bold"}}>O Resultado dessa obra foi o cocô {single.tipoCoco.title} {" "+single.tipoCoco.reacao} </Text>
                          <Avatar
                            rounded
                            size="xlarge"
                            avatarStyle={
                              {
                                borderColor:"#41e037",
                                borderWidth: 1
                              }
                            }
                            source={single.tipoCoco.icon}  />
                        </View> : <View/>
                      }
                    </ListItem.Content>
              </ListItem>
              })}
          </View>
          <AdMobScreen />
        </ScrollView>
      </>
    );
  }
}

