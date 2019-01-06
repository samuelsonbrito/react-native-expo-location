import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Constants, Location, Permissions } from 'expo';

export default class App extends React.Component {

  state = {
    locationInfo: null,
    coordenadas: null,
    mensagemErro: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        mensagemErro: 'Opa, isso não funcionará no Sketch em um emulador Android. Experimente no seu dispositivo!',
      });
    } else {
      this._obterLocalizacao();
    }
  }

  _obterLocalizacao = async () => {

    // dando permissão de location
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      this.setState({
        mensagemErro: 'A permissão para acessar o local foi negada',
      });
    }

    //pegando cordenadas 
    let location = await Location.getCurrentPositionAsync({});
    let coordenadas = location.coords;
    this.setState({ coordenadas });

    //pegando informações da rua, bairro com base nas coordenadas obtidas
    let locationInfo = await Location.reverseGeocodeAsync({
      latitude: coordenadas.latitude,
      longitude: coordenadas.longitude
    });

    locationInfo = locationInfo[0];

    this.setState({ locationInfo });

  };

  render() {

    let coordenadas = '';
    let localizacaoInfo = '';
    let statusLocalizacao = 'Aguarde...';

    if (this.state.mensagemErro) {

      statusLocalizacao = this.state.mensagemErro;

    } else if (this.state.coordenadas && this.state.locationInfo) {

      coordenadas = this.state.coordenadas;
      localizacaoInfo = this.state.locationInfo;

      statusLocalizacao = 'OK';
      
    }

    const deviceId = Constants.deviceId;

    return (
      <View style={styles.container}>
        <Text> Status: { statusLocalizacao } </Text>
        <Text> DeviceID: { deviceId } </Text>
        <Text> Long: { coordenadas.longitude } - Lat: { coordenadas.latitude }  </Text>
        <Text> Cidade: { localizacaoInfo.city } - Estado: { localizacaoInfo.region } - Rua: { localizacaoInfo.street } </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
