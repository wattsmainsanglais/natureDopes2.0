
import React from "react"


import loadingGif from '@/public/images/loadingplant.gif'

// css imports
import style from './map.module.css'

// import session data
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route'

//google map react build
import Gmap from './_components/GMap'



async function getData() {
    const res = await fetch('http://localhost:3000/map/api', { next: { revalidate: 1000 } })
    // The return value is *not* serialized

   
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }


    return res.json()
  }


export default async function Map(){

   
  const getImageData = await getData()

  const session: any = await getServerSession(authOptions)

 let userId = null

  if(session){
    userId = session.user.id
  }
    
    return (
        <>
     

              <Gmap getImageData={getImageData} loadingGif={loadingGif} session={userId} />
       
       
        
      
        </>
    )
}

