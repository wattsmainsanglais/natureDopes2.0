'use client'

import { Key, MouseEventHandler, Suspense, useState } from 'react';

import GoogleMapReact from 'google-map-react';
import MapMarker from './MapMarker'
import ImageUploadForm from './forms/ImageUploadForm';
import EditImageForm from './forms/EditImageForm';

import { MagnifyingGlassIcon, CheckCircledIcon, InfoCircledIcon, CrossCircledIcon, DotFilledIcon } from '@radix-ui/react-icons';

import Loading from '@/src/app/[locale]/loading'

import { StaticImageData } from 'next/image';

import { Button, Switch, Tooltip, TextField, Flex, Box, Spinner, Callout, Text } from '@radix-ui/themes';
import style from './mapMarker.module.css'

import { useTranslations } from 'next-intl';

import { images } from '@prisma/client';



export default function Gmap({getImageData, loadingGif, session}: {getImageData: images[], loadingGif: StaticImageData, session: string | null}) {

  const t = useTranslations('GMap');



  //image data from prisma client
  const [imageData, setImageData] = useState(getImageData)

  // state for search bar
  const [searchParams, setSearchParams] = useState<string>('')

  //toggles if user would like to see all markers or just there own
  const [allChecked, setAllChecked]  = useState<boolean>(true)

  //temporary gps coordinates for image upload
  const [clickedPosition, setClickedPosition] = useState<{ lat: number, lng: number } | null>(null);

  // state for long/ lat positons for onclickMap function
  const[gps_lat, setLat] = useState<number>()
  const[gps_long, setLong] = useState<number>()
  const[species_name, setSpecies] = useState<string>()
  const[imageId, setImageId] = useState<number>()


  // whether upload form is visible
  const[uploadForm, setUploadForm]= useState<boolean>(false)
  const[editForm, setEditForm] = useState<boolean>(false)

  // loading and success states for data refresh
  const[isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const[refreshSuccess, setRefreshSuccess] = useState<boolean>(false)

  async function getData() {
    setIsRefreshing(true)
    setRefreshSuccess(false)

    try {
      // Construct API path from current location to handle locale automatically
      const apiPath = `${window.location.pathname}/api`
      const res = await fetch(apiPath, {
        cache: 'no-store' // Always get fresh data
      })

      if (!res.ok) {
        throw new Error('Failed to fetch map data')
      }

      const newData = await res.json()

      // Validate that we got an array
      if (!Array.isArray(newData)) {
        console.error('API returned non-array data:', newData)
        throw new Error('Invalid data format from API')
      }

      setImageData(newData)

      // Show success message briefly
      setRefreshSuccess(true)
      setTimeout(() => setRefreshSuccess(false), 3000)

      return {
        success: 'Map updated'
      }
    } catch (error) {
      console.error('Error fetching map data:', error)
      return {
        error: 'Failed to update map. Please try again.'
      }
    } finally {
      setIsRefreshing(false)
    }
  }
  


  function toggleUploadForm(){
    setUploadForm(!uploadForm)
  }

  // whether Edit Form is Visible
  function toggleEditForm(species?: string, id?: number, lng?: number, lat?: number){
    if (species !== undefined && id !== undefined) {
      // Opening form with data
      setSpecies(species)
      setImageId(id)
      setLong(lng)
      setLat(lat)
      setEditForm(true)
    } else {
      // Closing form
      setEditForm(false)
      setImageId(undefined)
      setSpecies(undefined)
      setLong(undefined)
      setLat(undefined)
    }
  }




  const handleSubmit = (event: React.ChangeEvent<EventTarget>): void => {
    event.preventDefault();
 
}

// on click function for googleMap
function onClickMap({lat, lng}: {lat: number, lng: number}) {
  setLong(lng)
  setLat(lat)
  setClickedPosition({ lat, lng })
}

// clear location - removes temp marker and coordinates
function clearSelection() {
  setLat(undefined)
  setLong(undefined)
  setClickedPosition(null)
}


  // starting view of map
  const defaultProps = {
    center: {
      lat: 48,
      lng: -1.25
    },
    zoom: 6
  };

  return (
    // Important! Always set the container height explicitly
    <>
      <Flex p='1' direction='column' width={{initial:'60%', xs: '60%', sm: '60%', md: '40%', lg:'40%', xl: '40%'}} gap='2'>

        { !session ? null :

        <Flex p='1' justify='between'>
          <Flex align='center'>
            <label className={style.findLabel}>{t('allfinds')}</label>
            <Switch checked={!allChecked} onCheckedChange={() => setAllChecked(allChecked => !allChecked)} aria-label="Toggle between all finds and your finds" />
            <label className={style.findLabel}>{t('yourfinds')}</label>
          </Flex>

        </Flex>
        }

        {/* Loading and success indicators */}
        {isRefreshing && (
          <Callout.Root color="blue" size="1">
            <Callout.Icon><Spinner /></Callout.Icon>
            <Callout.Text>Updating map...</Callout.Text>
          </Callout.Root>
        )}

        {refreshSuccess && (
          <Callout.Root color="green" size="1">
            <Callout.Icon><CheckCircledIcon /></Callout.Icon>
            <Callout.Text>Map updated successfully!</Callout.Text>
          </Callout.Root>
        )}

        <Flex align='center'>
          <form onSubmit={handleSubmit}>

            <TextField.Root placeholder={t('searchbar')} onChange={event => setSearchParams(event.target.value)} aria-label="Search species by name">
              <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>



          </form>
          {!session? null :  uploadForm ? null : <Box p='1'><Button onClick={toggleUploadForm} disabled={isRefreshing}>{t('addbutton')}</Button> </Box>}
          {editForm ? <EditImageForm species={species_name} lng={gps_long} lat={gps_lat} imageId={imageId} toggleEditForm={toggleEditForm} getData={getData} />: null }
          {session? null:<Tooltip className={style.toolTip}  content='Sign in for more map features'>
            <Button ml='1%'  radius='medium' aria-label="Information about map features">i</Button>

          </Tooltip>
          }
        </Flex>

    </Flex>


      
      
      <div style={{ height: '90vh', width: '100%'  }}>

        {uploadForm && session? <ImageUploadForm lng={gps_long} lat={gps_lat} session={session} toggleUploadForm={toggleUploadForm} getData={getData} clearSelection={clearSelection} />: null}
        <Suspense fallback={<Loading/>}>
        <GoogleMapReact
          bootstrapURLKeys={{ key:  process.env.NEXT_PUBLIC_GOOGLEMAPAPI || '' }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          
          onClick={onClickMap}
        >
     
    
        {/* Temporary marker for clicked position */}
        {clickedPosition && (
          <DotFilledIcon
            lat={clickedPosition.lat}
            lng={clickedPosition.lng}
            width={32}
            height={32}
            color="#3b82f6"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              marginLeft: '-16px',
              marginTop: '-16px'
            }}
          />
        )}

        {Array.isArray(imageData) && imageData.filter((data) => {
          if(!allChecked){
            if(data.user_id.toString() == session){
              return data
            } else {
              return
            }
          } else {
            return data
          }
        })
        .filter((data) => {
          if(!data){
            return data
          } else if(data.species_name.toLowerCase().includes(searchParams.toLowerCase())) {
            return data
          }
        }).map(data  => (
          <MapMarker key={data.id} id={data.id} user_id={data.user_id} lat={data.gps_lat} lng={data.gps_long} text={data.species_name} ipath={data.image_path} session={session} loadingGif={loadingGif} toggleEditForm={toggleEditForm}  />
        ))}

        </GoogleMapReact>
      </Suspense>
      </div>
      
    </>
  );
 
}