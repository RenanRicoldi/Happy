import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import L, { LeafletMouseEvent } from 'leaflet';

import { FiPlus } from "react-icons/fi";
import mapMarkerImg from '../images/map-marker.svg';
import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useHistory } from "react-router-dom";

const happyMapIcon = L.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})

export default function CreateOrphanage() {
  const history = useHistory( )
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 })
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [open_on_weekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng
    setPosition({ latitude: lat, longitude: lng })
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if(!event.target.files)
      return

    const selectedImages = Array.from(event.target.files)

    setImages(selectedImages)

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image)
    })

    setPreviewImages(selectedImagesPreview)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', name)
    data.append('about', about)
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    data.append('instructions', instructions)
    data.append('opening_hours', opening_hours)
    data.append('open_on_weekends', String(open_on_weekends))
    
    images.forEach(image => {
      data.append('images', image);
    })

    await api.post('orphanages', data);

    alert('Cadastro realizado com sucesso!')

    history.push('/app');
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar/>

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset aria-required={true}>
            <legend>Dados</legend>

            <Map 
              center={[-27.2092052,-49.6401092]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
              {/* <TileLayer url={`https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`} />  */}
              {
                position.latitude !== 0 ? <Marker interactive={false} icon={happyMapIcon} position={[position.latitude,position.longitude]} /> : null
              }
              
            </Map>

            <div className="input-block">
            <label htmlFor="name">Nome</label>
              <input required={true} id="name" value={name} onChange={ event => setName(event.target.value) }/>
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea required={true}  id="name" maxLength={300} value={about} onChange={ event => setAbout(event.target.value) } />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {
                  previewImages.map( image => {
                    return (
                      <img key={image} src={image} alt='' />
                    )
                  } )
                }
                <label htmlFor='image[]' className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>

                <input required={true} multiple onChange={ handleSelectImages } type="file" id='image[]'/>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea required={true} id="instructions" value={instructions} onChange={ event => setInstructions(event.target.value) } />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horas aberto</label>
              <input required={true} id="opening_hours" placeholder='Das 8h às 18h' value={opening_hours} onChange={ event => setOpeningHours(event.target.value) } />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button" className={ open_on_weekends ? 'active': '' } onClick={ event => setOpenOnWeekends(true) }>Sim</button>
                <button type="button" className={ !open_on_weekends ? 'active': '' } onClick={ event => setOpenOnWeekends(false) }>Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

