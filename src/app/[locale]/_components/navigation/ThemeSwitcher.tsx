'use client'

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

import { CiLight, CiCloudMoon, CiDark } from "react-icons/ci";

import { Button } from "@radix-ui/themes";

export default function ThemeSwitcher(){
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme();

    const toggleMode = () => setTheme(theme == 'dark' ? 'light' : 'dark')

    useEffect(() => {
        setMounted(true)
      }, [])
    
      if (!mounted) {
        return null
      }

      return (
        <button onClick={toggleMode} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>{theme === 'light' ? <CiDark color="green" size={30} />: <CiLight color='green' size={30} />}</button>
      )
}

