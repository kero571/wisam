import './globals.css';
import {Inter,Playfair_Display,Allura} from 'next/font/google';
import {metadata as m,viewport as v,jsonLd} from '@/lib/seo';
const inter=Inter({subsets:['latin'],display:'swap',variable:'--font-inter'});
const playfair=Playfair_Display({subsets:['latin'],style:['normal','italic'],display:'swap',variable:'--font-playfair'});
const allura=Allura({subsets:['latin'],weight:'400',display:'swap',variable:'--font-allura',preload:false});
export const metadata=m;export const viewport=v;
export default function RootLayout({children}){return(<html lang="en" className={`${inter.variable} ${playfair.variable} ${allura.variable}`}><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,'\\u003c')}}/></body></html>)}
