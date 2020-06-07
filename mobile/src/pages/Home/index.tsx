import React, { useEffect, useState } from 'react';
import { View, Image, Text, ImageBackground } from 'react-native';
import { styles, pickerSelectStyles } from './styles';
import { Feather } from '@expo/vector-icons';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface Uf {
  sigla: string;
}

interface City {
  nome: string;
}

const Home = () => {
  const navigitaion = useNavigation();
  const [selectedUf, setSelectedUf] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [citys, setCitys] = useState<City[]>([]);
  const [uf, setUf] = useState<Uf[]>([]);

  useEffect(() => {
    async function loadUf() {
      const response = await axios.get(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      );
      setUf(response.data);
    }
    loadUf();
  }, []);

  useEffect(() => {
    async function loadCity() {
      const response = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      );
      setCitys(response.data);
    }

    loadCity();
  }, [selectedUf]);

  function handleNavigateToPoints() {
    navigitaion.navigate('Points', { uf: selectedUf, city: selectedCity });
  }
  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/home-background.png')}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de residuos</Text>
        <Text style={styles.description}>
          Ajudaso pessoas a encontrarem pontos de coletas de forma eficiente
        </Text>
      </View>
      <View style={styles.footer}>
        <RNPickerSelect
          placeholder={{
            label: 'Selecione a UF',
            value: null,
            color: '#9EA0A4',
          }}
          style={pickerSelectStyles}
          onValueChange={(value) => setSelectedUf(value)}
          items={uf.map((uf) => {
            return {
              label: uf.sigla,
              value: uf.sigla,
            };
          })}
        />
        <RNPickerSelect
          placeholder={{
            label: 'Selecione a Cidade',
            value: null,
            color: '#9EA0A4',
          }}
          style={pickerSelectStyles}
          onValueChange={(value) => setSelectedCity(value)}
          items={citys.map((city) => {
            return {
              label: city.nome,
              value: city.nome,
            };
          })}
        />
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Feather name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;
