
import {NextRequest, NextResponse } from "next/server";

import { getTranslations } from "next-intl/server";


export async function GET(request: NextRequest){

    const t = await getTranslations("Gallery.Errors")
    
    const res = await fetch(`https://graph.instagram.com/me/media?fields=media_type,media_url,id,caption,thumbnail_url&access_token=${process.env.INSTAGRAMACCESSTOKEN}`, { next: { tags: ['instagramdata']}})
  
 
    console.log(res.status)
    if(res.status == 400 || res.status == 500){
        return NextResponse.json({igResponse: [], error: t('insta1') })
    }

    if(!res.ok){
        return NextResponse.json({igResponse: [], error: 'Technical issue. If the problem persists please contact us' })
    }


    const igData = await res.json()

    const newArray = []

    for(let i = 0; i < 12; i++ ){
        newArray.push(igData.data[i])
    }



    return NextResponse.json({igResponse: newArray})
}

