
'use client'

import React from "react";

import { Text, Flex, Box } from "@radix-ui/themes";

import ContactForm from "./contact/ContactForm";
import About from "./about/About";
import About2 from "./about/About2";

import style from './homecontent.module.css'

import { Fade } from 'react-awesome-reveal'

export default function HomeContent({session}: {session: null | undefined | number}){


     return (

        <Box width='100vw' className={style.homeContentWrapper}>
        <Fade direction="up">
          
            <Box width='100%' className={style.aboutWrapper}>
                <Flex justify='center' mt='8'>
                    <About/>
                </Flex>
            </Box>

            <Box width='100%' className={style.about2Wrapper}>
                <Flex justify='center' mt='8' pt='9' pb='9'>
                    <About2 />
                </Flex>

            </Box>

            <Box width='100%' className={style.contactWrapper}  >
                <Flex >
                    <ContactForm session={session}/>
                </Flex>
            </Box> 
            
        </Fade>
        </Box>
     )

}