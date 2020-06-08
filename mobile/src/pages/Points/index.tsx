import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';

interface Params {
  city: string;
  uf: string;
}

interface Item {
  id: number;
  image: string;
  title: string;
  image_url: string;
}
interface Point {
  id: number;
  image: string;
  name: string;
  latitude: number;
  longitude: number;
  image_url: string;
}

const Points: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;
  const [items, setitems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPossition, setInitialPossition] = useState<[number, number]>([
    0,
    0,
  ]);
  useEffect(() => {
    api.get('items').then((response) => {
      setitems(response.data);
    });
  }, []);

  useEffect(() => {
    async function loadPossition() {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Oooops ... ',
          'Precisamos de sua permisão par obter sua localização'
        );
        return;
      }
      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;

      setInitialPossition([latitude, longitude]);
    }
    loadPossition();
  }, []);

  useEffect(() => {
    console.log(routeParams.city, routeParams.uf, selectedItems);
    api
      .get('points', {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems,
        },
      })
      .then((response) => {
        setPoints(response.data);
      });
  }, [selectedItems]);

  function handleGoback() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { id });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected > -1) {
      const filterdItens = selectedItems.filter((item) => item !== id);
      setSelectedItems(filterdItens);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleGoback}>
          <Feather name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        <Text style={styles.title}>Bem vindo</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta
        </Text>
        <View style={styles.mapContainer}>
          {initialPossition[0] !== 0 && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: initialPossition[0],
                longitude: initialPossition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map((point) => (
                <Marker
                  key={point.id}
                  onPress={() => handleNavigateToDetail(point.id)}
                  style={styles.mapMarker}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: point.image_url,
                      }}
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map((item) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              onPress={() => handleSelectItem(item.id)}
              key={String(item.id)}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Points;
