import { useState } from "react"
import { supabase } from '../utils/supabaseClient'
import Head from 'next/head'
import { siteTitle } from "../components/layout";

const handleClick = (queryString, setResponse) => {
  fetch(`/api/createReport?${new URLSearchParams(queryString).toString()}`)
    .then(r => r.json())
    .then(d => setResponse(d))
}


export default function SubmitPage() {

  const [photoUrl, setPhotoUrl] = useState('')
  const [response, setResponse] = useState(null)

  async function handleUpload(e) {
    const avatarFile = e.target.files[0]
    const { data, error } = await supabase
      .storage
      .from('report-photos')
      .upload(avatarFile.name, avatarFile, {
        cacheControl: '3600',
        upsert: false
      })
    setPhotoUrl(`https://zikieyzmibovmrmmdxso.supabase.in/storage/v1/object/public/${data.Key}`)
  }

  const [address, setAddress] = useState('')
  const [report, setReport] = useState('')
  const [email, setEmail] = useState('')

  let record = {
    Address: address,
    Report: report,
    Email: email
  }

  if (photoUrl !== '') {
    record.Attachments = JSON.stringify([{ url: photoUrl }])
  }


  return (
    <>
          <Head>
      <link rel="icon" href="/favicon.ico" />
      <title>{`Detroit Development Tracker: Submit a tip`}</title>
      <meta
        name="description"
        content="Tracking development in Detroit, Michigan."
        key="description"
      />
      <meta property="og:title" content={siteTitle} key="title"/>
      <meta property="og:description" content="Use the Detroit Development Tracker to look up information about real estate development in the city."/>
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
    <div className="max-w-xl mx-auto submit-form">
      <h2 className="pb-6">Let us know what you&apos;re seeing.</h2>
      <p className="pb-5 md:pb-11 leading-6">Do you see a project in your neighborhood or development activity? We&apos;ll check it out and get back to you.</p>
      <div>
        <label htmlFor="textarea">Where are you?</label>
        <input type="text" value={address} placeholder="Type an address or intersection." onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div>
        <label htmlFor="textarea">What do you see?</label>
        <textarea cols={80} rows={5} value={report} onChange={(e) => setReport(e.target.value)} />
      </div>
      <div>
        <label htmlFor="photoupload">Upload a photo</label>
        <input type="file" id="photoupload" onChange={handleUpload} className="p-4 py-12" />
      </div>
      <div>
        <label htmlFor="textarea">What&apos;s your email? (optional)</label>
        <input type="text" value={email} placeholder="" onChange={(e) => setEmail(e.target.value)} />
      </div>
      <article className="flex items-end">

      {!response ? 
        <button
        onClick={() => handleClick(record, setResponse)} 
        disabled={response !== null} >
            {"Submit"}
        </button>
      : 
      <span 
      className="w-full flex justify-around items-center py-8 text-lg leading-6" 
      style={{background: `rgba(215, 226, 255, 0.4)`, fontFamily: "DM Sans"}}>
        Thanks! We received your tip.
      </span>
    }
    </article>
    </div>
    </>
  )
}