/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {KTSVG} from '../../../_metronic/helpers'
import {getCSSVariableValue} from '../../../_metronic/assets/ts/_utils'
import {Dropdown1} from '../../../_metronic/partials/content/dropdown/Dropdown1'
import clsx from 'clsx'
import {collection, query, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore'
import {db} from '../../../firebase'
import NumberFormat from 'react-number-format';
import ccxt from "ccxt";

type Props = {
  className: string
  chartColor: string
  chartHeight: string
  userId: string
  strategyId: string
  strategyObj: any
  getStrategyData?:() => void
}

const MyStrategyWidget: React.FC<Props> = ({className, chartColor, chartHeight, userId, strategyId, strategyObj, getStrategyData=()=>{} }) => {
  const chartRef = useRef<HTMLDivElement | null>(null)

  /***** Declare useState var here */
  const [strategy, setStrategy] = useState([] as any[])
  const [systemStatus, setSystemStatus] = useState("")
  const [updateStatusFlag, setUpdateStatusFlag] = useState(0)
  /******************************* */

  // const apiSec = async() => {

  // }

  // const exchangeId = strategyObj!.data!.exchange
  //       , exchangeClass = ccxt[exchangeId]
  //       , exchange = new exchangeClass ({
  //           'apiKey': strategyObj!.data!.apiKey,
  //           'secret': 'YOUR_SECRET',
  //       })

  useEffect(() => {
    //set state
    setSystemStatus(strategyObj!.data!.system_status)
    setUpdateStatusFlag(0)
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
      setStrategy([]); // This worked for me
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    
    
  }, [chartRef])

  const updateSystemStatus = async(status:any) => {
    let dataUpdate = {
      system_status: status,
      md: Timestamp.now()
    }
    
    ///users/auth06222db04f7aa7a006a90fd4f/accounts/Dhamk8oqMRz-XC2T9atBesO81jJQ5BdY0L43PgS7/strategys/1dSiBOXShJ8vCO0VMCO5
    await updateDoc(doc(db, `users/${strategyObj!.data!.user_id}/accounts/${strategyObj!.data!.apiKey}/strategys`, (strategyObj.id) ), 
            dataUpdate
    ).then( async()=>{
      await getStrategyData()
      await setUpdateStatusFlag(0)
    }).catch( error => {
      setUpdateStatusFlag(0)
    })
  
  }

  const handleSelectSystemStatus = async(el:any) => {
    setUpdateStatusFlag(1)
    if (el.checked) {
      setSystemStatus("Active")
      await updateSystemStatus('Active')
    } else {
      setSystemStatus("Pause")
      await updateSystemStatus('Pause')
    }
  }

  return (
    <>
    
    
    <div className={`card ${className}`}>
      {/* begin::Beader */}
      <div className='card-header border-0 py-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>{strategyObj!.data!.strategy_name}</span>

          <span className='text-muted fw-bold fs-7'>Strategy Name</span>
        </h3>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>{strategyObj!.data!.market} : {strategyObj!.data!.asset}
          </span>

          <span className='text-muted fw-bold fs-7'>Market: Product</span>
        </h3>
        {/* <div className='card-toolbar'>
            {/* <div className="form-check form-switch">
              <input
                    type="checkbox"
                    id = "systemStatus"
                    name = "systemStatus"
                    value = {systemStatus}
                    className="form-check-input"
                    defaultChecked={strategyObj!.data!.system_status == "Active" ? (true):(false)}
                    onChange={(event) =>  handleSelectSystemStatus(event.target) }
                  />&nbsp;&nbsp;
            </div> 
            <span  className={clsx(
                      'fw-bold fs-6 ',
                      {
                        'text-success': systemStatus == "Active",
                      },
                      {
                        'text-muted': systemStatus != "Active",
                      }
                    )}>
                      { updateStatusFlag == 1 ? (
                        <div className="spinner-border" style={{width: "1rem",height: "1rem"}} role="status">
                              <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <>
                        Status :&nbsp;&nbsp;{systemStatus}
                        </>
                      )}
                      </span>*/}
          {/* begin::Menu */}
          {/* <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
            data-toggle="tooltip"
            title="Active is bot running. Pause mean bot clear pending order then no run anymore"
          >
            <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
          </button>
          
          
          <Dropdown1 /> */}
          {/* end::Menu */}


          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1 text-success'>{systemStatus}
            </span>

            <span className='text-muted fw-bold fs-7'>Status</span>
          </h3>
          
        {/* </div> */}
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
                  <div className={clsx(
                      'fs-4 text-dark fw-bolder fw-bolder text-hover-primary mb-1 fs-6 ',
                      {
                        'text-success': strategyObj!.data!.capital > 0,
                      },
                      {
                        'text-success': strategyObj!.data!.capital <= 0,
                      }
                    )}>
                      {strategyObj!.data!.capital}
                      <NumberFormat
                          value={strategyObj!.data!.min_capital}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'$'}
                        />
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
        {/* <div ref={chartRef} className='mixed-widget-6-chart card-rounded-bottom'></div> */}
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

export {MyStrategyWidget}
