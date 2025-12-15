'use client'


import { Spinner } from '@radix-ui/themes'
import { Button } from '@radix-ui/themes'
import { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'




export const RegisterSubmitButton = ({ children }: { children: ReactNode }) => {

    const { pending } = useFormStatus()
    return (

      <Button color='blue' type="submit" disabled={pending} aria-busy={pending}>
        {pending ? <Spinner /> : children}
      </Button>

    )
  }