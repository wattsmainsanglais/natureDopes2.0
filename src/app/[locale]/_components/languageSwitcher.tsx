'use client'

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Select, DropdownMenu, Button } from "@radix-ui/themes";
import { ChevronDownIcon } from "@radix-ui/react-icons";

export default function LanguageSwitcher({locale}: {locale: string}){

    const pathname = usePathname()
    const currentRoute = pathname.slice(3)

    return (
        <>
        <DropdownMenu.Root >
            <DropdownMenu.Trigger>
                <Button variant="ghost" size='2' aria-label="Change language">
                    {locale}<ChevronDownIcon/>
                </Button>
            </DropdownMenu.Trigger>
            
                <DropdownMenu.Content size='2'>
                        
                        <Link href={'/en'+currentRoute}><DropdownMenu.Item >en</DropdownMenu.Item></Link>
                        <Link href={'/fr'+currentRoute}><DropdownMenu.Item >fr</DropdownMenu.Item></Link>
                        
                   
                </DropdownMenu.Content>
        </DropdownMenu.Root>
        
        </>


    )
}