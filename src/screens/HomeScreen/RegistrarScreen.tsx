import React, { createRef } from "react";
import { StatusBar, SafeAreaView, View, Dimensions, Alert, TextInput, ScrollView } from "react-native";
import { Button, ButtonGroup, Header, Image, Input, ListItem, Text } from "react-native-elements";
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome';
import {Calendar, LocaleConfig, Agenda} from 'react-native-calendars';
import { TextInputMask } from 'react-native-masked-text'
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import LottieView from 'lottie-react-native';
import { firebase } from './../../Core/api/firebase/config';
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import AdMobScreen from "../../AdMobScreen";

export default class RegistrarScreen extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      loading: false,
      dt: moment(new Date()).format('DD/MM/YYYY HH:mm'),
      descricao: null,
      currentUser:null,
      index: 0,
      tipoCoco: null
    }
  }

  componentWillMount(){
    if(this.props.route&&this.props.route.params&&this.props.route.params){

      let dt = this.props.route.params.paramday? moment(this.props.route.params.paramday.dateString, 'YYYY-MM-DD').format('DD/MM/YYYY HH:mm') :(
        this.props.route.params.current&&this.props.route.params.current.date?
        moment(this.props.route.params.current.date).format('DD/MM/YYYY HH:mm'):moment(new Date()).format('DD/MM/YYYY HH:mm')
      )

      if(this.props.route.params.paramday){
        let date = moment(dt, 'DD/MM/YYYY HH:mm').toDate()
        let tempDate = new Date()
        date.setHours(tempDate.getHours());
        date.setMinutes(tempDate.getMinutes())
        dt = moment(date).format("DD/MM/YYYY HH:mm")
      }

      if(this.props.route.params.scenary=='PUT'){
        let data = this.props.route.params.current
        data.dt = dt
        data.index = data.size?data.size:0
        this.setState({...data})
      }else{
        this.setState({dt:dt})
      }

      // this.setState({
      //   currentUser: this.props.route.params,
      //   scenary: this.props.route.params.scenary,
      //   dt: dt,
      //   index: this.props.route.params.current&&this.props.route.params.current.size?this.props.route.params.current.size:0,
      //   userId: this.props.route.params.current&&this.props.route.params.current.userId?this.props.route.params.current.userId:null,
      //   id: this.props.route.params.current&&this.props.route.params.current.id?this.props.route.params.current.id:null,
      //   descricao: this.props.route.params.current&&this.props.route.params.current.descricao?this.props.route.params.current.descricao:null,
      // })
    }
  }
  
  render(){
    return (
      <>
        <ScrollView style={{ flex: 1, backgroundColor:"#fff"}}>
          <Header
            centerComponent={
              <Image
                  style={{width: 100,height: 50}}
                  source={require('../../../assets/numero2.png')}  />
            }
            containerStyle={{
              backgroundColor:"#fff"
            }}
            leftComponent={{ onPress: () => this.props.navigation.goBack(), icon: 'arrow-left', color: '#696969', iconStyle: { color: '#696969', fontWeight:"bold"} }}
            // centerComponent={{ text: 'REGISTRAR MOMENTO 💩', style: { color: '#fff', fontWeight:"bold" } }}
            rightComponent={{ onPress: () => {
              Alert.alert(
                'Informativo',
                'Cadastre a data, tamanho e uma descrição da sua obra! 💩',
                [
                  {
                    text: 'Ok', onPress: () => {}
                  }
                ],
                {cancelable: false},
              );
            }, icon: 'info', color: '#696969', iconStyle: { color: '#696969', fontWeight:"bold"} }}
          />
          <View style={{margin:10}}>

          <Text style={{
                textAlign:"center",
                color:"#696969",
                fontSize:20,
                padding: 20
              }}>Informe os dados referente ao seu momento</Text>

                <View>
                  <Text style={{paddingTop: 10, color:"#696969", fontWeight:"bold"}}>Dia e Horário*</Text> 
                  <TextInputMask
                    type={'datetime'}
                    options={{
                      format: 'DD/MM/YYYY HH:mm'
                    }}
                    style={this.state.id ? {
                        marginVertical: 8,
                        fontSize: 18,
                        borderWidth: 1,
                        borderColor: '#cdcdcd',
                        paddingHorizontal: 12,
                        height: 54,
                        color:"#696969",
                        backgroundColor:"#cdcdcd"
                    } : {
                      marginVertical: 8,
                        fontSize: 18,
                        borderWidth: 1,
                        borderColor: '#cdcdcd',
                        paddingHorizontal: 12,
                        height: 54,
                        color:"#696969"
                    }}
                    editable={!this.state.id}
                    placeholderTextColor={"#cdcdcd"}
                    placeholder="Selecionar Dia e Horário"
                    value={this.state.dt}
                    onBlur={() => {
                        if(!moment(this.state.dt, 'DD/MM/YYYY HH:mm').isValid()){
                          Alert.alert(
                            '',
                            'Informe uma data válida',
                            [
                              {
                                text: 'Ok', onPress: () => {
                                  this.setState({dt: null})
                                }
                              }
                            ],
                            {cancelable: false},
                          );
                        }
                    }}
                    onChangeText={text => {
                      this.setState({dt: text})
                    }}
                  />
                </View>

                <View>
                  <Text style={{paddingTop: 10, color:"#696969", fontWeight:"bold"}}>Considerar a quantidade defecada*</Text> 
                  <ButtonGroup
                    onPress={(index) => {
                      this.setState({index})
                    }}
                    selectedIndex={this.state.index}
                    buttons={['P', 'M', 'G', 'GG', 'XG']}
                    containerStyle={{height: 100}}
                  />
                </View>

                <View>
                    {
                      this.state.tipoCoco&&this.state.tipoCoco.id ? 
                      <View style={{margin:10, alignItems:"center"}}>
                        <Text style={{paddingTop: 10,paddingBottom:10, color:"#696969", fontWeight:"bold"}}>O Tipo de Cocô selecionado é {this.state.tipoCoco.title} </Text>
                        <Avatar
                          rounded
                          size="medium"
                          avatarStyle={
                            {
                              borderColor:"#41e037",
                              borderWidth: 1
                            }
                          }
                          source={this.state.tipoCoco.icon}  />
                        <Text style={{paddingTop: 10,paddingBottom:10, color:"#696969", fontWeight:"bold"}}>{this.state.tipoCoco.reacao} </Text>
                      </View> : <Text style={{paddingTop: 10, color:"#696969", fontWeight:"bold"}}>Selecionar o Tipo (Opcional)</Text>
                    }
                  <ScrollView 
                      horizontal
                      contentContainerStyle={{flexDirection:"row"}}>
                    {[
                        {
                          icon: require('../../../assets/titanic.png'),
                          title: "Titanic",
                          id: 1,
                          reacao: "👏🏼👏🏼👏🏼"
                        },
                        {
                          icon: require('../../../assets/cobradagua.png'),
                          title: "Cobra D'Agua",
                          id: 2,
                          reacao: "😨😨😨"
                        },
                        {
                          icon: require('../../../assets/cabrito.png'),
                          title: "Cabrito",
                          id: 3,
                          reacao: "😏😏😏"
                        },
                        {
                          icon: require('../../../assets/boiadagua.png'),
                          title: "Boia D'Agua",
                          id: 4,
                          reacao: "🤨🤨🤨"
                        },
                        {
                          icon: require('../../../assets/fantasma.png'),
                          title: "Fantasma",
                          id: 5,
                          reacao: "👻👻👻"
                        },
                        {
                          icon: require('../../../assets/tzarbomba.png'),
                          title: "Tzar Bomba",
                          id: 6,
                          reacao: "💥💥💥"
                        },
                        {
                          icon: require('../../../assets/submarino.png'),
                          title: "Submarino",
                          id: 7,
                          reacao: "⛵⛵⛵"
                        },
                        {
                          icon: require('../../../assets/poseidon.png'),
                          title: "Beijo D'Poseidon",
                          id: 8,
                          reacao: "😲😲😲"
                        },
                        {
                          icon: require('../../../assets/partonormal.png'),
                          title: "Parto Normal",
                          id: 9,
                          reacao: "😰😰😰"
                        }
                    ].map(single => {
                      return <View style={{margin:10, alignItems:"center"}}>
                                <Text style={{paddingTop: 10, color:"#696969", fontWeight:"bold"}}>{single.title}</Text> 
                                <Avatar
                                    rounded
                                    size="large"
                                    onPress={() => {
                                      this.setState({
                                        tipoCoco: (
                                          this.state.tipoCoco&&this.state.tipoCoco.id == single.id ? null:single
                                        )
                                      })
                                    }}
                                    avatarStyle={
                                      this.state.tipoCoco&&this.state.tipoCoco.id==single.id ? 
                                      {
                                        borderColor:"#41e037",
                                        borderWidth: 2
                                      } :
                                      {
                                        borderColor:"#cdcdcd",
                                        borderWidth: 2
                                      }
                                    }
                                    source={single.icon}  />
                                 {this.state.tipoCoco&&this.state.tipoCoco.id==single.id ?
                                 <LottieView source={require('../../../assets/sucesso.json')} loop autoPlay style={{width: 50}} />:<View/>}
                            </View>
                    })}
                  </ScrollView>
                </View>
    
                <View>
                  <Text style={{paddingTop: 10, color:"#696969", fontWeight:"bold"}}>DESCRIÇÃO (Opcional)</Text> 
                  <TextInput
                      placeholder="Escrever Descrição"  
                      placeholderTextColor="#cdcdcd"  
                      multiline={true}  
                      style={{
                        marginVertical: 8,
                        fontSize: 18,
                        borderWidth: 1,
                        borderColor: '#cdcdcd',
                        paddingHorizontal: 12,
                        color:"#696969"
                      }}
                      numberOfLines={5}  
                      value={this.state.descricao}
                      onChangeText={temp => {
                          this.setState({
                              descricao: temp
                          })
                      }}
                  />  
                </View>
                <View style={{paddingTop: 30}}>
                    <Button type="clear" 
                        titleStyle={{
                            color:"#2293f4",
                            fontWeight:"bold"
                        }}
                        onPress={() => {
                          this.setState({
                            loading: true
                          }, this.handle)
                        }}
                        loading={this.state.loading}
                        buttonStyle={{
                            borderWidth:1,
                            borderColor:"#2293f4",
                        }} title={this.state.id ? "ATUALIZAR" : "CADASTRAR"} />
                </View>
                {
                  this.state.id ? <View style={{paddingTop: 20}}>
                        <Button type="clear" 
                            titleStyle={{
                                color:"orange",
                                fontWeight:"bold"
                            }}
                            onPress={() => {
                              Alert.alert(
                                '',
                                'Deseja confirmar a exclusão desse momento?',
                                [
                                  {
                                    text:"Cancelar", onPress:()=>{}
                                  },
                                  {
                                    text: 'Excluir', onPress: () => {
                                            this.setState({
                                              loading: true
                                            }, () => {
                                              firebase.firestore()
                                                  .collection('momentos')
                                                  .doc(this.state.id)
                                                  .delete()
                                                  .then(() => {
                                                    this.setState({
                                                      loading: false
                                                    })
                                                    this.props.navigation.goBack()
                                                    this.props.route.params.callback(new Date())
                                                  }).catch(e => {
                                                    console.log(e)
                                                    this.setState({
                                                      loading: false
                                                    })
                                                    Alert.alert(
                                                      '',
                                                      'Ocorreu algum erro, tente novamente',
                                                      [
                                                        {
                                                          text: 'Ok', onPress: () => {
                                                            this.setState({dt: null,loading: false})
                                                          }
                                                        }
                                                      ],
                                                      {cancelable: false},
                                                    );
                                                  })
                                            })
                                    }
                                  }
                                ],
                                {cancelable: false},
                              );
                              
                            }}
                            loading={this.state.loading}
                            buttonStyle={{
                                borderWidth:1,
                                borderColor:"orange",
                            }} title={"EXCLUIR"} />
                    </View> : <View/>
                }
          </View>
          <AdMobScreen />
        </ScrollView>
      </>
    );
  }

  handle = () => {

    let dt = moment(this.state.dt, 'DD/MM/YYYY HH:mm')
    if(!dt.isValid()){
      Alert.alert(
        '',
        'Informe uma Horário válido',
        [
          {
            text: 'Ok', onPress: () => {
              this.setState({dt: null,loading: false})
            }
          }
        ],
        {cancelable: false},
      );
      return;
    }

    if(this.state.id){
      firebase.firestore()
      .collection('momentos')
      .doc(this.state.id)
      .update({
        userId: this.props.route.params.currentUser.id,
        descricao: this.state.descricao,
        size: this.state.index,
        tipoCoco: this.state.tipoCoco,
      })
      .then(() => {
        this.setState({
          loading: false
        })
        this.props.navigation.goBack()
        this.props.route.params.callback(dt.toDate())
      }).catch(e => {
        this.setState({
          loading: false
        })
        Alert.alert(
          'Ocorreu algum erro, tente novamente',
          e.message,
          [
            {
              text: 'Ok', onPress: () => {
                this.setState({dt: null,loading: false})
              }
            }
          ],
          {cancelable: false},
        );
      })
      return
    }

    firebase.firestore()
      .collection('momentos')
      .add({
        userId: this.props.route.params.currentUser.id,
        dt: dt.toDate(),
        descricao: this.state.descricao,
        size: this.state.index,
        tipoCoco: this.state.tipoCoco,
      })
      .then(() => {
        this.setState({
          loading: false
        })
        this.props.navigation.goBack()
        this.props.route.params.callback(dt.toDate())
      }).catch(e => {
        this.setState({
          loading: false
        })
        Alert.alert(
          '',
          'Ocorreu algum erro, tente novamente',
          [
            {
              text: 'Ok', onPress: () => {
                this.setState({dt: null,loading: false})
              }
            }
          ],
          {cancelable: false},
        );
      })
  }
}

