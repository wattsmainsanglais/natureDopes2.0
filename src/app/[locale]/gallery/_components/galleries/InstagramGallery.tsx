'use client'

import React from "react"
import { Box, Flex, Text, Link, Card } from "@radix-ui/themes"
import { InstagramLogoIcon } from "@radix-ui/react-icons"

//type imports
import { InstagramApiData } from "../../page";


export default function InstagramGallery({igResponse}: {igResponse: InstagramApiData}){

    return (
        <Flex justify='center' align='center' p='6' style={{ minHeight: '400px' }}>
            <Card size='3'>
                <Flex direction='column' align='center' gap='3' p='4'>
                    <InstagramLogoIcon width={48} height={48} />
                    <Text size='5' weight='bold' align='center'>
                        Nature Dopes Gallery
                    </Text>
                    <Text size='3' color='gray' align='center' style={{ maxWidth: '400px' }}>
                        Visit our Instagram to see the latest nature finds and discoveries from the community.
                    </Text>
                    <Link
                        href='https://www.instagram.com/naturedopes/'
                        target='_blank'
                        rel='noopener noreferrer'
                        size='4'
                        weight='bold'
                    >
                        @naturedopes
                    </Link>
                </Flex>
            </Card>
        </Flex>
   )
}