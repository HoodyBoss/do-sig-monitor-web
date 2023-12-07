/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {colorDarken, getCSS, getCSSVariableValue} from '../../../_metronic/assets/ts/_utils'

type Props = {
  className: string
}

const StrategyDetail_Chart: React.FC<Props> = ({className}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)

  const monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const subtractMonths=(numOfMonths:number, date = new Date()) =>{
    const dateCopy = new Date(date.getTime());

    dateCopy.setMonth(dateCopy.getMonth() - numOfMonths);
    dateCopy.setDate(0);

    return monthsName[Number(dateCopy.getMonth())]+"-"+(dateCopy.getFullYear()+"").substring(2, 4); 
  }
  
  const calculateMonth=()=>{
    let dateObj = new Date();
    
    let months = []
    
    //from current month to prev. 6 months = 4, -1
    //from 1 previous month to prev. 6 months = 5, 0
    for(let ii=4;ii>=-1;ii--){
      months.push(subtractMonths(ii, dateObj))
    }
    return months
  }

  useEffect(() => {
    if (!chartRef.current) {
      return
    }

    const months = calculateMonth()
    //console.log("Months>>>", months)
    const height = parseInt(getCSS(chartRef.current, 'height'))
    const colors = ['success', 'danger']
    const chart = new ApexCharts(chartRef.current, getChartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], height, months))//getChartOptions(height))
    //const chart = new ApexCharts(chartRef.current, getChartOptions(colors[0], height, months))//getChartOptions(height))
    //const chart = new ApexCharts(chartRef.current, chartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], height))
    if (chart) {
      chart.render()
    }

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef])

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Equity</span>

          <span className='text-muted fw-bold fs-7'></span>
        </h3>

        {/* begin::Toolbar */}
        <div className='card-toolbar' data-kt-buttons='true'>
          <a
            className='btn btn-sm btn-color-muted btn-active btn-active-primary active px-4 me-1'
            id='kt_charts_widget_3_year_btn'
          >
            Month
          </a>

          {/* <a
            className='btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1 active'
            id='kt_charts_widget_3_month_btn'
          >
            Month
          </a>

          <a
            className='btn btn-sm btn-color-muted btn-active btn-active-primary px-4'
            id='kt_charts_widget_3_week_btn'
          >
            Week
          </a> */}
          
        </div>
        {/* end::Toolbar */}
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body'>
        {/* begin::Chart */}
        <div ref={chartRef} id='kt_charts_widget_3_chart' style={{height: '300px'}}></div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {StrategyDetail_Chart}

function getChartOptions(chartColor: string, height: number, months: any[]): ApexOptions {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const baseColor = getCSSVariableValue('--bs-'+ chartColor)
  const lightColor = getCSSVariableValue('--bs-light-'+ chartColor)
  const fontColor = getCSSVariableValue('--bs-gray-500')
  const data = [
                Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10
                  , Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10
              ]
  // const data = [20, 50, 40, 75, 12, 54]
  
  const categories = months
  
  

  return {
    series: [
      {
        name: 'Equity',
        data: data
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [baseColor],
    },
    xaxis: {
      categories: categories,//['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        position: 'front',
        stroke: {
          color: baseColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: function (val) {
          return '$' + val + ' thousands'
        },
      },
    },
    colors: [lightColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      strokeColors: baseColor,
      strokeWidth: 3,
    },
  }
}

