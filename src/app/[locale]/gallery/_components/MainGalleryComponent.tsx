'use client'


import React, { useState } from "react"
import Image from "next/image"


import { Theme, Card, Box, Flex, Section, Container, Button, Switch, Badge} from "@radix-ui/themes"

//import gallery components
import IagonGallery from "./galleries/IagonGallery";
import InstagramGallery from "./galleries/InstagramGallery";

// importing types

import { InstagramApiData } from "../page";
import { useTranslations } from "next-intl";
import { images } from "@prisma/client";

export default function MainGalleryComponent({session, igResponse, imageDataPrisma, LoadingGif, error, prismaError}: {session: string|null, igResponse: InstagramApiData, imageDataPrisma: images[] | null, LoadingGif: any, error: string, prismaError: string | null}){

    const t = useTranslations('Gallery');

    const [galleryInView, setGalleryinView] = React.useState<boolean>(true)

    function galleryToggle(){
        setGalleryinView(!galleryInView)
    }

    return (

        
        
         <Box width='95vw' ml='5' mr='5' mt={{initial: '3', xs: '3', sm: '3', md: '1', lg:'1'}}>
        
        {session?
            
                <>
                 <Flex gap='1'  ml={{initial: '2', xs:'2', sm:'3', md:'4', lg:'6', xl:'7'}}><Badge variant="surface" size='3'>{t('ndgallery')}</Badge><Switch size='3' onClick={galleryToggle} aria-label="Toggle between Nature Dopes gallery and your gallery" /><Badge variant="surface" size='3'>{t('usergallery')}</Badge></Flex>
                 <Box mt='3' ml='1' mr='1'>


                    {galleryInView? <InstagramGallery igResponse={igResponse}  />: prismaError? <p>{prismaError}</p> : <IagonGallery imageDataPrisma={imageDataPrisma} LoadingGif={LoadingGif} />}
                  </Box>
                </>
            : <InstagramGallery igResponse={igResponse} />
        
       
                
        
        }
        
        </Box>
       
       
    )

}