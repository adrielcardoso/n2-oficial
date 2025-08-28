import React, { useState, useEffect } from 'react';
import { YellowBox, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import SplashScreen from 'react-native-splash-screen';
import { MenuProvider } from 'react-native-popup-menu';
import configureStore from './redux/store';
import AppContainer from './screens/AppContainer';
import { setI18nConfig } from './Core/localization/IMLocalization';
import SocialNetworkConfig from './SocialNetworkConfig';
import { enableScreens } from 'react-native-screens';
import moment from "moment";

moment.locale('pt-br');

const MainNavigator = AppContainer;

const store = configureStore();
const handleLocalizationChange = () => {
  setI18nConfig();
};

const App = (props) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  enableScreens();

  useEffect(() => {
    SplashScreen.hide();
    YellowBox.ignoreWarnings(['Remote Debugger']);
    console.disableYellowBox = true;
    setI18nConfig();
    Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });
  }, []);

  return (
        <Provider store={store}>
          <AppearanceProvider>
            <MenuProvider>
              <StatusBar />
              <MainNavigator screenProps={{ theme: colorScheme }} />
            </MenuProvider>
          </AppearanceProvider>
        </Provider>
  );
};

export default App;


export const CALC_DAYS = (dto) => {
  let dfrom = new Date()
  let date = moment(dfrom.getFullYear()+"-"+(dto.format('MM-DD')), 'YYYY-MM-DD')
  console.log(date)
  let days = (date.diff(moment(dfrom), 'days'))
  if(days < 0){
      let daysTotal = (moment(dfrom).diff(date, 'days'))
      return "Foi em " + dto.format("DD/MM/YYYY") + (" faz " + daysTotal+ (daysTotal>1?" dias":" dia"))
  }
  if(days == 0){
      return "HOJEEEEEE! "+dto.format("DD/MM/YYYY")+" Envie os Parabéns para Ele "
  }
  return " Faltam apenas "+days+" dias para "+dto.format("DD/MM/YYYY")
}
