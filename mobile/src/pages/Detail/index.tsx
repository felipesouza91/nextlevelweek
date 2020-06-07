import React, { useEffect, useState } from 'react';
import { View, Image, Text, SafeAreaView, Linking } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

import { Feather, FontAwesome } from '@expo/vector-icons';
import { styles } from './styles';
import { TouchableOpacity, RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';

interface Params {
  id: number;
}

interface Data {
  id: number;
  image: string;
  name: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
  items: [
    {
      title: string;
    }
  ];
}

const Detail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;

  const [data, setData] = useState<Data>({} as Data);

  function handleGoback() {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interese na coleta de resitudos',
      recipients: [data.email],
    });
  }

  function handleWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=${data.whatsapp}&text=Tenho interesse sobre coleta`
    );
  }

  useEffect(() => {
    api.get(`points/${routeParams.id}`).then((response) => {
      setData(response.data);
    });
  }, []);

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleGoback}>
          <Feather name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        <Image
          style={styles.pointImage}
          source={{
            uri: data.image,
          }}
        />
        <Text style={styles.pointName}>{data.name}</Text>
        <Text style={styles.pointItems}>
          {data.items?.map((item) => item.title).join(', ')}
        </Text>
        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {data.city} / {data.uf}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Feather name="mail" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Email</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
};

export default Detail;
