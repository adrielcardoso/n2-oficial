import React, { createRef, useEffect } from "react";
import { StatusBar, SafeAreaView, View, Dimensions, Alert, ActivityIndicator } from "react-native";
import { ButtonGroup, Header, Image, Input, Text } from "react-native-elements";
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome';
import {Calendar, LocaleConfig, Agenda} from 'react-native-calendars';
import LottieView from 'lottie-react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import { useSelector } from "react-redux";
import { firebase } from './../../Core/api/firebase/config';
import AdMobScreen from "../../AdMobScreen";
import { ScrollView } from "react-native-gesture-handler";

export default class BIScreen extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      currentUser: null,
      loading: true,
      conf: {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        datasets: [
          {
            data: [
              Math.random() * 5,
              Math.random() * 5,
              Math.random() * 5,
              Math.random() * 5,
              Math.random() * 5,
              Math.random() * 5,
              Math.random() * 5,
              Math.random() * 5,
              Math.random() * 5,
              Math.random() * 5,
              Math.random() * 5,
              Math.random() * 5
            ]
          }
        ]
      },
      momentos: {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2 // optional
          }
        ],
        legend: ["Rainy Days"] // optional
      }
    }
  }

  findData = async () => {
    this.setState({loading: true})
    let meses = []
    let dataset = []
    for(let single of [
      // moment(new Date()).add(-12, 'month'),
      // moment(new Date()).add(-11, 'month'),
      // moment(new Date()).add(-10, 'month'),
      // moment(new Date()).add(-8, 'month'),
      // moment(new Date()).add(-7, 'month'),
      // moment(new Date()).add(-6, 'month'),
      moment(new Date()).add(-5, 'month'),
      moment(new Date()).add(-4, 'month'),
      moment(new Date()).add(-3, 'month'),
      moment(new Date()).add(-2, 'month'),
      moment(new Date()).add(-1, 'month'),
      moment(new Date())
      ]){
        let mes = single.toDate()
        mes.setDate(1)
        mes.setHours(0, 0, 0)
        let mesAte = single.toDate()
        mesAte.setDate(moment(mesAte).daysInMonth())
        mesAte.setHours(23, 59, 59)
        let month = await this.loadMonth(mes, mesAte)
        meses.push(this.state.meses[moment(mes).format('M')-1])
        dataset.push(month)
    }
    this.setState({
      conf: {
        labels: meses,
        datasets: [
          {
            data: dataset
          }
        ]
      },
      loading: false
    })
  }

  DummyView = () => {
      if(!this.state.currentUser){
          const currentUser = useSelector(state => state.auth.user)
          useEffect(() => {
              this.setState({
                  currentUser : currentUser
              }, async () => {
                  this.findData()
              })
          }, [])
          console.log(currentUser)
      }
      return null
  }

  loadMonth = async (mes, mesAte) => {
    return await firebase.firestore().collection('momentos')
            .where('userId', '==', this.state.currentUser.id)
            .where('dt', '>=', mes)
            .where('dt', '<=', mesAte)
            .get()
            .then(snap => snap.size);
  }

  renderContent = () => {

    if(this.state.loading){
      return <SafeAreaView style={{ flex: 1, alignItems: 'center',
                  marginTop:100,
                  justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#696969" />
              </SafeAreaView>
    }

    return <View>
            <Text style={{
              textAlign:"center",
              color:"#696969",
              fontSize:20,
              padding: 40
            }}>Dados Analíticos dos ultímos 6 meses</Text>
            <LineChart
                data={this.state.conf}
                width={Dimensions.get("window").width} // from react-native
                height={Dimensions.get("window").height*0.6}
                yAxisInterval={1}
                segments={3}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 1, // optional, defaults to 2dp
                  color: (opacity = 1) => `#696969`,
                  labelColor: (opacity = 1) => `#696969`,
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                  }
                }}
              />
              <AdMobScreen />
        </View>

  }

  render(){
    
    return (
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
          leftComponent={{ onPress: () => {
            Alert.alert(
              '',
              'Deseja recarregar seus dados analíticos? 💩',
              [
                {
                  text: 'Não', onPress: () => {}
                },
                {
                  text: 'Sim', onPress: () => this.findData()
                }
              ],
              {cancelable: false},
            );
          }, icon: 'cloud', color: '#696969', iconStyle: { color: '#696969', fontWeight:"bold"} }}
          // centerComponent={{ text: 'DADOS ANALÍTICOS 💩', style: { color: '#fff', fontWeight:"bold" } }}
          rightComponent={{ onPress: () => {
            Alert.alert(
              'Informativo',
              'O Contador representa a quantidade de dias efetuado no mês! 💩',
              [
                {
                  text: 'Ok', onPress: () => {}
                }
              ],
              {cancelable: false},
            );
          }, icon: 'info', color: '#696969', iconStyle: { color: '#696969', fontWeight:"bold"} }}
        />
        <this.DummyView/>
       {this.renderContent()}
      </ScrollView>
    );
  }
}

