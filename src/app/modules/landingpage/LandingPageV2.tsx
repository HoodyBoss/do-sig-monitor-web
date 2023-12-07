/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../_metronic/assets/ts/_utils'
import {Redirect, Route, Switch} from 'react-router-dom'
import {KTSVG} from '../../../_metronic/helpers'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {RedirectAuth0} from './components/RedirectAuth0'
import { useAuth0 } from "@auth0/auth0-react";

type Props = {
  className: string
  chartColor: string
  chartHeight: string
  userId: string
  strategyId: string
  strategyObj: any
  getStrategyData?:() => void
}

export function LandingPageV2() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const chartRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    document.body.classList.add('bg-black')

    if (!chartRef.current) {
      return
    }
    const colors = ['success', 'danger']
    const chartHeight = "150px"
    const chartWidth = '100%'
    const chart = new ApexCharts(chartRef.current, chartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], chartHeight, chartWidth ))
    if (chart) {
      chart.render()
    }

    return () => {
      document.body.classList.remove('bg-black')
      if (chart) {
        chart.destroy()
      }
    }
  }, [isAuthenticated, chartRef])
  
  const logoStyle = {
    filter: "brightness(0.5) sepia(1) hue-rotate(-70deg) saturate(5);"
  }

  
  const items = [1,2,3,4,5,6,7,8,9,10,11,12,13]
  return (
    <div
      
    >
      <div className='row g-5 g-xxl-12'>
        {/* <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'> */}
        <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* begin::Content */}
        { items.map( el=> el !=  undefined? (
          
          <div className={`card card-xxl-stretch mb-xxl-8`}>
            {/* begin::Beader */}
            <div className='card-header border-0 py-5'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder fs-3 mb-1'>Name</span>

                <span className='text-muted fw-bold fs-7'>Strategy Name</span>
              </h3>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder fs-3 mb-1'>Market - Asset
                </span>

                <span className='text-muted fw-bold fs-7'>Market: Product</span>
              </h3>
              
                <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bolder fs-3 mb-1 text-success'>Status
                  </span>

                  <span className='text-muted fw-bold fs-7'>Status</span>
                </h3>
                
            </div>
            {/* end::Header */}

            {/* begin::Body */}
            <div className='card-body p-0 d-flex flex-column'>
              {/* begin::Stats */}
              <div className='card-px pt-5 pb-10 flex-grow-1'>
                {/* begin::Row */}
                <div className='row g-0 mt-5 mb-10'>
                  {/* begin::Col */}
                  <div className='col'>
                    <div className='d-flex align-items-center me-2'>
                      {/* begin::Symbol */}
                      <div className='symbol symbol-50px me-3'>
                        <div className='symbol-label bg-light-info'>
                          <KTSVG
                            path='/media/icons/duotune/art/art007.svg'
                            className='svg-icon-1 svg-icon-info'
                          />
                        </div>
                      </div>
                      {/* end::Symbol */}

                      {/* begin::Title */}
                      <div>
                        <div className={'fs-4 text-dark fw-bolder fw-bolder text-hover-primary mb-1 fs-6 text-success'}>
                            100,000
                          </div>
                        <div className='fs-7 text-muted fw-bold'>Equity</div>
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
              <div className='w-lg-500px bg-black rounded shadow-sm p-10 p-lg-15 mx-auto'>
                <a href='#' className='text-muted text-hover-primary px-2'>
                  เลือก
                </a>
              </div> 
              {/* end::Chart */}
            </div>
            {/* end::Body */}
          </div>
        
          
          ) : (
            <></>
              ) 
          )}
          </div>
        </div>
        {/* end::Content */}

      <div className='w-lg-500px bg-black rounded shadow-sm p-10 p-lg-15 mx-auto'>
        <Switch>
          <Route path='/auth/login' component={RedirectAuth0} />
          <Route path='/auth/registration' component={Registration} />
          <Route path='/auth/forgot-password' component={ForgotPassword} />
          <Redirect from='/auth' exact={true} to='/auth/login' />
          <Redirect to='/auth/login' />
        </Switch>
      </div>
      
      {/* begin::Footer */}
      <div className='d-flex flex-center flex-column-auto p-10'>
        <div className='d-flex align-items-center fw-bold fs-6'>
          <a href='#' className='text-muted text-hover-primary px-2'>
            About : DeepOcean
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact : support@deepocean.fund
          </a>

        </div>
      </div>
      {/* end::Footer */}
    </div>
  )
}

const chartOptions = (chartColor: string, chartHeight: string, chartWidth: string): ApexOptions => {
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