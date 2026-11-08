import './globals.css';
import {Inter,Playfair_Display,Allura} from 'next/font/google';
import {buildMetadata,buildJsonLd,viewport as v} from '@/lib/seo';
import {getContent} from '@/lib/content';
const inter=Inter({subsets:['latin'],display:'swap',variable:'--font-inter'});
const playfair=Playfair_Display({subsets:['latin'],style:['normal','italic'],display:'swap',variable:'--font-playfair'});
const allura=Allura({subsets:['latin'],weight:'400',display:'swap',variable:'--font-allura',preload:false});
export async function generateMetadata(){return buildMetadata(await getContent())}
export const viewport=v;
export default async function RootLayout({children}){const c=await getContent();return(<html lang="en" className={`${inter.variable} ${playfair.variable} ${allura.variable}`}><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(buildJsonLd(c)).replace(/</g,'\\u003c')}}/></body></html>)}
