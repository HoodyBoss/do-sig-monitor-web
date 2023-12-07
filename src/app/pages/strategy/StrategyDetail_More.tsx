/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {KTSVG} from '../../../_metronic/helpers'
import {getCSSVariableValue} from '../../../_metronic/assets/ts/_utils'

type Props = {
  className: string
  chartColor: string
  chartHeight: string
  userId: string
  strategyId: string
}

const StrategyDetail_More: React.FC<Props> = ({className, chartColor, chartHeight, userId, strategyId}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!chartRef.current) {
      return
    }
    const colors = ['success', 'danger']
    const chart = new ApexCharts(chartRef.current, chartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], chartHeight))
    if (chart) {
      chart.render()
    }

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef])

  return (
    <>
    
    <div className={`card ${className}`}>
      {/* begin::Beader */}
      
      <div className='card-header border-0 py-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Dreamcatcher</span>

          <span className='text-muted fw-bold fs-7'>Asset</span>
        </h3>

        <div className='card-toolbar'>
          &nbsp;
        </div>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body p-0 d-flex flex-column'>
        {/* begin::Stats */}
        <div className='card-px pt-5 pb-10 flex-grow-1'>
          

          {/* begin::Row */}
          <div className='row g-0'>
            {/* begin::Col */}
            <div className='col'>
              <div className='d-flex align-items-center me-2'>
                {/* begin::Symbol */}
                <div className='symbol symbol-50px me-3'>
                  <div className='symbol-label bg-light-success'>
                    <KTSVG
                      path='/media/icons/duotune/ecommerce/ecm002.svg'
                      className='svg-icon-1 svg-icon-success'
                    />
                  </div>
                </div>
                {/* end::Symbol */}

                {/* begin::Title */}
                <div>
                  <div className='fs-4 text-dark fw-bolder'>$49</div>
                  <div className='fs-7 text-muted fw-bold'>Average Bid</div>
                </div>
                {/* end::Title */}
              </div>
            </div>
            {/* end::Col */}

            {/* begin::Col */}
            <div className='col'>
              <div className='d-flex align-items-center me-2'>
                {/* begin::Symbol */}
                <div className='symbol symbol-50px me-3'>
                  <div className='symbol-label bg-light-primary'>
                    <KTSVG
                      path='/media/icons/duotune/ecommerce/ecm010.svg'
                      className='svg-icon-1 svg-icon-primary'
                    />
                  </div>
                </div>
                {/* end::Symbol */}

                {/* begin::Title */}
                <div>
                  <div className='fs-4 text-dark fw-bolder'>$5.8M</div>
                  <div className='fs-7 text-muted fw-bold'>All Time Sales</div>
                </div>
                {/* end::Title */}
              </div>
            </div>
            {/* end::Col */}
          </div>
          {/* end::Row */}
        </div>
        {/* end::Stats */}

        {/* begin::Chart */}
        <div ref={chartRef} className='mixed-widget-6-chart card-rounded-bottom'></div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  </>
  )
}

const chartOptions = (chartColor: string, chartHeight: string): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-800')
  const strokeColor = getCSSVariableValue('--bs-gray-300')
  const baseColor = getCSSVariableValue('--bs-' + chartColor)
  const lightColor = getCSSVariableValue('--bs-light-' + chartColor)

  return {
    series: [
      {
        name: 'Net Profit',
        data: [Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10
          , Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10],
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
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        show: false,
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
      min: 0,
      max: 60,
      labels: {
        show: false,
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
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return '$' + val + ' thousands'
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

export {StrategyDetail_More}
