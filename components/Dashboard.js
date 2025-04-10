"use client"
import { Fugaz_One } from 'next/font/google';
import React, { useState, useEffect } from 'react'
import Calendar from './Calendar';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Loading from './Loading';
import Login from './Login';
import { useSearchParams } from 'next/navigation';

const fugaz = Fugaz_One({ subsets : ["latin"], weight : ['400']});

export default function Dashboard() {

  const { currentUser, userDataObj, setUserDataObj, loading } = useAuth()
  const [data, setData] = useState({})
  const now = new Date()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")

  function countValues() {
    let numDays = 0
    let sumMoods = 0
    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          const mood = data[year][month][day]
          sumMoods += mood
          numDays++
        }
      }
    }
    return {
      num_days : numDays,
      average_mood : sumMoods / numDays
    }
  }

  const statuses = {
    ...countValues(),
    time_remaining : `${23 - now.getHours()}H ${60 - now.getMinutes()}M`
  }

  async function handleSetMood(mood) {

    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()

    try {

      const newData = { ...userDataObj }
      if (!newData?.[year]) {
        newData[year] = {}
      }
      if (!newData?.[year]?.[month]) {
        newData[year][month] = {}
      }
      newData[year][month][day] = mood

      // Update current state
      setData(newData)

      // Update global state
      setUserDataObj(newData)

      // Update Firebase
      const docRef = doc(db, "users", currentUser.uid)
      const res = await setDoc(docRef, {
        [year] : {
          [month] : {
            [day] : mood
          }
        }
      }, { merge : true })

    } catch (err) {
      console.log(err.message)
    }

  }

  const moods = {
    "Terrible" : "😭",
    "Sad" : "🥲",
    "Existing" : "😑",
    "Good" : "😊", 
    "Elated" : "🤩"
  }

  useEffect(() => {
    if (!currentUser || !userDataObj) { return }
    setData(userDataObj)
  }, [currentUser, userDataObj])

  if (loading) {
    return <Loading/>
  }

  if (!currentUser) {
    if (!mode) {
      return (
        <Login defaultIsRegister={false}/>
      )
    }
    return (
      mode == "login" ? <Login defaultIsRegister={false}/> : <Login defaultIsRegister={true}/>
    )
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      <div className="grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg">
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className="flex flex-col gap-1 sm:gap-2">
              <p className="font-medium capitalize text-xs sm:text-sm truncate">{status.replaceAll("_", " ")}</p>
              <p className={"text-base sm:text-lg truncate " + fugaz.className}>{statuses[status]}{status == "num_days" ? " 🔥" : ""}</p>
            </div>
          )
        })}
      </div>
      <h4 className={"text-5xl sm:text-6xl md:text-7xl text-center " + fugaz.className}>
        How do you <span className="textGradient">feel</span> today?
      </h4>
      <div className="flex items-stretch flex-wrap gap-4"> 
        {Object.keys(moods).map((mood, moodIndex) => {
          return (
            <button key={moodIndex} onClick={() => {
              const moodValue = moodIndex + 1
              handleSetMood(moodValue)
            }} className="p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex flex-col items-center gap-2 flex-1">
              <p className="text-4xl sm:text-5xl md:text-6xl">{moods[mood]}</p>
              <p className={"text-indigo-500 text-xs sm:text-sm md:text-base " + fugaz.className}>{mood}</p>
            </button>
          )
        })}
      </div>
      <Calendar completeData={data}/>
    </div>
  )

}
