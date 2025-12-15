'use client'

import { Spinner } from '@radix-ui/themes'
import { Button } from '@radix-ui/themes'
import { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'




export const SubmitButton = ({disabled,  children }: {disabled?: boolean, children: ReactNode }) => {

    const { pending } = useFormStatus()
    return (

      <Button type="submit" disabled={pending || disabled} aria-busy={pending}>
        {pending ? <Spinner /> : children}
      </Button>

    )
  }