"use client"
import React, { useState } from 'react'
import { gradients, baseRating } from '@/utils'
import { Fugaz_One } from 'next/font/google';

const fugaz = Fugaz_One({ subsets : ["latin"], weight : ['400']});
const months = { "January": "Jan", "February": "Feb", "March": "Mar", "April": "Apr", "May": "May", "June": "Jun", "July": "Jul", "August": "Aug", "September": "Sept", "October": "Oct", "November": "Nov", "December": "Dec" }
const dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const now = new Date()

export default function Calendar(props) { 

  const { demo, completeData } = props
  const [selectedMonth, setSelectedMonth] = useState(Object.keys(months)[now.getMonth()]) 
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const numericMonth = Object.keys(months).indexOf(selectedMonth)
  const data = completeData?.[selectedYear]?.[numericMonth] || {}

  function handleIncrementMonth(val) {
    if (numericMonth + val < 0) {
      setSelectedMonth(Object.keys(months)[Object.keys(months).length - 1])
      setSelectedYear(curr => curr - 1)
    } else if (numericMonth + val > 11) {
      setSelectedMonth(Object.keys(months)[0])
      setSelectedYear(curr => curr + 1)
    } else {
      setSelectedMonth(Object.keys(months)[numericMonth + val])
    }
  }

  const firstDayOfMonth = new Date(selectedYear, Object.keys(months).indexOf(selectedMonth), 1).getDay()
  const daysInMonth = new Date(selectedYear, Object.keys(months).indexOf(selectedMonth) + 1, 0).getDate()
  const daysToDisplay = firstDayOfMonth + daysInMonth
  const numRows = (Math.floor(daysToDisplay / 7)) + (daysToDisplay % 7 ? 1 : 0)

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-5 gap-4">
        <button onClick={() => {
          handleIncrementMonth(-1)
        }} className="mr-auto text-indigo-400 text-lg sm:text-xl duration-200 hover:opacity-60"><i className="fa-solid fa-circle-chevron-left"></i></button>
        <p className={"text-center capitalized textGradient whitespace-nowrap col-span-3 " + fugaz.className}>{selectedMonth} {selectedYear}</p>
        <button onClick={() => {
          handleIncrementMonth(1)
        }} className="ml-auto text-indigo-400 text-lg sm:text-xl duration-200 hover:opacity-60"><i className="fa-solid fa-circle-chevron-right"></i></button>
      </div>
      <div className="flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10">
        {[...Array(numRows).keys()].map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="grid grid-cols-7 gap-1">
              {dayList.map((dayofWeek, dayOfWeekIndex) => {

                let dayIndex = rowIndex * 7 + dayOfWeekIndex - firstDayOfMonth + 1
                let dayDisplay = dayIndex > daysInMonth ? false : (rowIndex == 0 && dayOfWeekIndex < firstDayOfMonth) ? false : true
                let isToday = dayIndex == now.getDate()

                if (!dayDisplay) {
                  return (
                    <div key={dayOfWeekIndex} className="bg-white"/>
                  )
                }

                let color = demo ? gradients.indigo[baseRating[dayIndex]] :
                  dayIndex in data ? gradients.indigo[data[dayIndex]] : "white" 

                return (
                  <div style={{background : color}} key={dayOfWeekIndex} className={
                    "text-xs sm:text-sm border border-solid p-2 flex items-center gap-2 justify-between rounded-lg "
                    + (isToday ? "border-indigo-400 " : "border-indigo-100 ")
                    + (color == "white" ? "text-indigo-400" : "text-white")}>
                    {dayIndex}
                  </div>
                )

              })}
            </div>
          )
        })}
      </div>
    </div>
  )

}
