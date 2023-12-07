/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState, useMemo} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../_metronic/assets/ts/_utils'
import { useAuth0 } from "@auth0/auth0-react";

type Props = {
  chartColor: string
  chartHeight: string
  chartDatas: any
  chartAxisY: any
  chartChange: boolean
  chartChanger?:(flag:boolean) => void
}

type portfolio = {
  id: number
  name: string
  preset_name: string
  market: string
  asset_class: string
  asset: string
  status: string
  risk: string
  character: string
  equity: string
  weight: number
}

const PortfolioChart: React.FC<Props> = ({ chartColor, chartHeight, chartDatas, chartAxisY, chartChange, chartChanger }) => {
  // const { loginWithRedirect, isAuthenticated } = useAuth0();
  const elRef  = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<ApexCharts>();
  const prevOptions = useRef<ApexCharts.ApexOptions>();
  const colors = ['success','success','success']
  const chartWidth = '100%'
  let chart:any = null
  
  const options = chartOptions(colors[Math.round((0 + (Math.random() * (2-0))))], chartHeight, chartWidth, chartDatas, chartAxisY )

  useEffect(() => {
    console.log("chartChange::", chartChange)
    const renderChart = async() => {
      chart = new ApexCharts(elRef.current!, options)
      await chart.render()
      
    }

    if (chartChange){
      renderChart()
    }

    return () => {
      chartRef.current?.destroy();
    }
  }, [])

  useEffect(() => {
    const { chart, ...opts } = options!;
    chartRef.current?.updateOptions(opts);
  }, [options]);


  return (
    <div> 
      <div ref={elRef} key={Math.floor(Math.random() * 1000)} className='mixed-widget-12-chart card-rounded-bottom'></div>    
    </div>
  )
}

const chartOptions = (chartColor: string, chartHeight: string, chartWidth: string, resultData: any, chartAxisY: any): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-800')
  const strokeColor = getCSSVariableValue('--bs-gray-300')
  const baseColor = getCSSVariableValue('--bs-' + chartColor)
  const lightColor = getCSSVariableValue('--bs-light-' + chartColor)

  return {
    series: [
      {
        name: 'Net Profit',
        data: resultData
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: chartHeight,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {},
    legend: {
      show: true,
    },
    dataLabels: {
      enabled: true,
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
      categories: chartAxisY,
      tickAmount: undefined,
      tickPlacement: 'between',
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        show: true,
        rotate: -45,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },formatter: function (value) {
          return value;
        }
      },
      crosshairs: {
        show: true,
        position: 'front',
        stroke: {
          color: strokeColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      show: true,
      showAlways: true,
      min: -20,
      max: 120,
      labels: {
        show: true,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },formatter: function (val) {
          return (val).toFixed(0);
        },
      },
      title: {
        text: 'Return'
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
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return '$' + val
        },
      },
    },
    colors: [lightColor],
    markers: {
      colors: [lightColor],
      strokeColors: [baseColor],
      strokeWidth: 3,
    },
  }
}

export {PortfolioChart}