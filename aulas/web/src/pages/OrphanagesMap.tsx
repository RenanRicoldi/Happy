import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiPlus } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'

import '../styles/pages/orphanages-map.css'
import mapMarkerImg from '../images/map-marker-dark.svg'
import api from '../services/api'

const mapIcon = Leaflet.icon({
    iconUrl: mapMarkerImg,
    iconSize: [58, 68],
    iconAnchor: [29, 68]
})

interface Orphanage {
    id: number
    latitude: number
    longitude: number
    name: string
}

function OrphanagesMap() {
    const [ orphanages, setOrphanages ] = useState<Orphanage[]>([])

    useEffect( () => {
        api.get('/orphanages').then( response => {
            setOrphanages(response.data)
        } )
    }, [])

    return(
        <div id="page-map">
            <aside>
                <header>
                    <Link to="/">
                        <img src={mapMarkerImg} alt=""/>
                    </Link>

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Londrina</strong>
                    <span>Paraná</span>
                </footer>
            </aside>

            <Map
                center={[-27.2092052,-49.6401092]}
                zoom={14}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />
                {/* <TileLayer url={`https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`} /> */}
                {/* <TileLayer url={`http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}`} maxZoom={20} subdomains={['mt0', 'mt1', 'mt2', 'mt3']}/> */}
                {
                    orphanages.map( orphanage => {
                        return(
                            <Marker 
                                position={[orphanage.latitude, orphanage.longitude]}
                                icon={mapIcon}
                            >
                                <Popup closeButton={false} maxWidth={240} minWidth={240} className='map-popup' >
                                    {orphanage.name}
                                    <Link to={`orphanage/${orphanage.id}`}>
                                        <FiArrowRight size={20} color='#fff' />
                                    </Link>
                                </Popup>
                            </Marker>
                        )
                    })
                }
            </Map>


            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color='#fff' />
            </Link>
        </div>
    )
}

export default OrphanagesMap