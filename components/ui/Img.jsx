'use client';
import {useState} from 'react';import Image from 'next/image';
// Skeleton while loading, soft fade-in, and no broken-image icon if a file is missing.
export default function Img({className='',priority,fill,...p}){const [st,setSt]=useState(0),shown=st===1||!!priority;
return(<>{fill&&!shown&&st!==3&&<span aria-hidden className="absolute inset-0 animate-pulse bg-black/10"/>}{st!==3&&<Image {...p} fill={fill} priority={priority} className={`${className} transition-opacity duration-700 ${shown?'opacity-100':'opacity-0'}`} onLoad={()=>setSt(1)} onError={()=>setSt(3)}/>}</>)}
