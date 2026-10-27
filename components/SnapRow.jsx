'use client';
import {useRef,useState,useEffect} from 'react';
// Horizontal scroll-snap row with progress dots (dots are hidden when `dotsClass` says so).
export default function SnapRow({n,children,className='',dotsClass=''}){const r=useRef(null),[i,setI]=useState(0);
useEffect(()=>{const e=r.current,f=()=>{const m=e.scrollWidth-e.clientWidth;setI(m>0?Math.round(e.scrollLeft/m*(n-1)):0)};e.addEventListener('scroll',f,{passive:true});return()=>e.removeEventListener('scroll',f)},[n]);
const go=k=>{const e=r.current;e.scrollTo({left:(e.scrollWidth-e.clientWidth)*k/(n-1),behavior:'smooth'})};
return(<><ul ref={r} className={`-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] ${className}`}>{children}</ul>
{n>1&&<div className={`mt-4 flex justify-center gap-2 ${dotsClass}`}>{Array.from({length:n},(_,k)=><button key={k} type="button" aria-label={`Go to ${k+1}`} aria-current={k===i} onClick={()=>go(k)} className={`h-1.5 rounded-full transition-all duration-500 ${k===i?'w-8 bg-gold':'w-1.5 bg-line'}`}/>)}</div>}</>)}
