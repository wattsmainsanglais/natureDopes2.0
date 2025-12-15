'use client'
import { DropdownMenu, Button, Text, Strong } from "@radix-ui/themes";
import { RxHamburgerMenu } from "react-icons/rx";
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import Link from "next/link";

import { useTranslations } from "next-intl";



export default function Nav(){
    const t = useTranslations('Navigation.NavMenu');

    return(
      <>

        <DropdownMenu.Root>
        <DropdownMenu.Trigger>
        <Button variant="surface" aria-label="Open navigation menu">

            <RxHamburgerMenu size={30} />
        </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
        <Link href='/' ><DropdownMenu.Item><Text size='3'><Strong>Home</Strong></Text></DropdownMenu.Item></Link>
        <Link href="/map"><DropdownMenu.Item><Text size='3'><Strong>{t('map')}</Strong></Text></DropdownMenu.Item></Link>
        <Link href='/gallery'><DropdownMenu.Item><Text size='3'><Strong>{t('gallery')}</Strong></Text></DropdownMenu.Item></Link>
        <Link href='/finder'><DropdownMenu.Item><Text size='3'><Strong>{t('play')}</Strong></Text></DropdownMenu.Item></Link>
        <Link href='/api-keys'><DropdownMenu.Item><Text size='3'><Strong>{t('apikeys')}</Strong></Text></DropdownMenu.Item></Link>
        </DropdownMenu.Content>
        </DropdownMenu.Root>

       </>
    )
}