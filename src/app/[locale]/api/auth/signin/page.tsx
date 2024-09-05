'use client'

import React from "react";
import Link from "next/link";
import { Flex , Text, Button, Card, Box, Heading, TextField, Avatar, AspectRatio} from "@radix-ui/themes";


import { signIn } from "next-auth/react";
import { Label } from "@radix-ui/themes/dist/esm/components/context-menu.js";

import logoMini from '../../../../public/images/logomini.png'



export default function SignIn() {

    const[email, setEmail] = React.useState("")
    const[password, setPassword] = React.useState("")

    const signInHandler = async (e : React.FormEvent) => {
        console.log(email, password)
        e.preventDefault()
       
        await signIn("credentials" , {email: email, password: password, callbackUrl: '/'})
    }

    return (
      

      <Flex justify='center' pt='8'>

        <Box width={{xs: '80vw', sm: '80vw', md: '50vw', lg: '50vw' , xl: '50vw'}}>
        <Card size='5' variant="classic" style={{boxShadow: 'var(--shadow-5)'}} >

          <Flex justify='end' align='center'>
              <Text mr='1'>Create an account?</Text><Link href='/register'><Button variant="surface" color="blue">Register</Button></Link>
          </Flex>
          
          <form method="post" action="/api/auth/callback/credentials" onSubmit={signInHandler}>
          <Flex gap='2' direction='column' justify='between' align='stretch'>

                  <Flex gap='3' align='center' justify='center' direction='column'>
                     <Avatar size='5'  src='../../../images/logoMini.png' fallback='N'/>
                    

                     <Heading>Sign In</Heading>
                    
                     
                     
                  </Flex>
                 
                  <Flex gap='2' direction='column'>
                    <Label >  Email </Label>
                   
                    <TextField.Root name="Email" type="text" color="grass"  onChange={e => setEmail(e.target.value)}/>
                  
                  </Flex>
                
                  <Flex gap='2' direction='column'>
                    <Label >  Password </Label>
                    <Flex direction='column'>
                      <TextField.Root name="Password" type="password" color="grass"  onChange={e => setPassword(e.target.value)}/>
                      <Text weight='bold' mt='1' color='grass' size='1'><Link href='/forgotPassword'>Forgot Password?</Link></Text>
                    </Flex>
                  </Flex>
                  <Button mt='3' >Sign in</Button>
                
              </Flex>
              </form>
        </Card>
        </Box>
      </Flex>
      
    )
  }

  
