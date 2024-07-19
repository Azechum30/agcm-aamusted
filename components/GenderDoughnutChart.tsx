import React from 'react'
import {Chart, ArcElement, Legend, Tooltip} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'


Chart.register( ArcElement, Legend, Tooltip )
Chart.defaults.font.size = 12

type GenderType = {
  males: number,
  females: number
}

function GenderDoughnutChart ({males, females}:GenderType)
{
  const data = {
    labels: [ 'Males', 'Females' ],
    datasets :[
      {
        data: [ males, females ],
        backgroundColor: [ 'rgba(54, 162, 235, 0.8)', 'rgba(235, 99, 132, 0.8 )', 'rgba(75, 192, 192, 0.8)' ],
        borderColor: [ 'rgba(54, 162, 235, 1)', 'rgba(235, 99, 132, 1 )', 'rgba(75, 192, 192, 1)' ],
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as 'top',
      },
    }
  }
  return (
    <div className='w-32 h-32'>
      <Doughnut data={data} options={options} />
    </div>
  )
}

export default GenderDoughnutChart
