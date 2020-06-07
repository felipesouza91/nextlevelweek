import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import api from '../../services/api';
import './styles.css';
import logo from '../../assets/logo.svg';
import { LeafletMouseEvent } from 'leaflet';

interface Item {
  id: number;
  image: string;
  title: string;
  image_url: string;
}

interface Uf {
  sigla: string;
}

interface City {
  nome: string;
}

const CreatePoint: React.FC = () => {
  const history = useHistory();
  const [itens, setItens] = useState<Item[]>([]);
  const [citys, setCitys] = useState<City[]>([]);
  const [uf, setUf] = useState<Uf[]>([]);

  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectUf, setSelectUf] = useState('0');
  const [selectCity, setSelectCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((possition) => {
      const { latitude, longitude } = possition.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    async function loadItens() {
      const response = await api.get('items');
      setItens(response.data);
    }

    loadItens();
  }, []);

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
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUf}/municipios`
      );
      setCitys(response.data);
    }
    if (selectUf === '0') {
      return;
    }
    loadCity();
  }, [selectUf]);

  function handleMapClic(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const [latitude, longitude] = selectedPosition;
    const object = {
      name,
      email,
      whatsapp,
      uf: selectUf,
      city: selectCity,
      itens: selectedItems,
      latitude,
      longitude,
    };
    await api.post('points', object);
    alert('Local cadastrado com sucesso!');
    history.push('/');
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
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Company Logo" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br />
          ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={(event) => setWhatsapp(event.target.value)}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço do mapa</span>
          </legend>
          <Map center={initialPosition} zoom={15} onClick={handleMapClic}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectUf}
                onChange={(event) => setSelectUf(event.target.value)}
              >
                <option value="0">Selecione uma UF</option>
                {uf.map((uf) => (
                  <option key={uf.sigla} value={uf.sigla}>
                    {uf.sigla}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="uf">Cidade </label>
              <select
                name="city"
                id="city"
                value={selectCity}
                onChange={(event) => setSelectCity(event.target.value)}
              >
                <option value="0">Selecione uma UF</option>
                {citys.map((city) => (
                  <option key={city.nome} value={city.nome}>
                    {city.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {itens.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
