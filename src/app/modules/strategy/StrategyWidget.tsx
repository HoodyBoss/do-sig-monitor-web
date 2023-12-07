/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {KTSVG} from '../../../_metronic/helpers'
import {getCSSVariableValue} from '../../../_metronic/assets/ts/_utils'
import {Dropdown1} from '../../../_metronic/partials/content/dropdown/Dropdown1'

import {StrategyDetail} from "../../pages/strategy/StrategyDetail"
import {SubscribeStrategyDetail} from "../../pages/subscribe_strategy/SubscribeStrategyDetail"
import {ConnectionModal} from "../../modules/modals/ConnectionModal"
import clsx from 'clsx'
import NumberFormat from 'react-number-format';

type Props = {
  className: string
  chartColor: string
  chartHeight: string
  chartWidth: string
  userId: string
  strategyId: string
  strategyObj: any
  apis: any
  getData?:() => void
}

const StrategyWidget: React.FC<Props> = ({className, chartColor, chartHeight, chartWidth, userId, strategyId, strategyObj, apis , getData=()=>{} }) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
 
  /***** Declare useState var here */
  const [hideModal ,setHideModal] = useState("")
  const buttonRef = useRef<HTMLDivElement>(null);

  const [exchange, setExchange] = useState("")
  const [connectionCreatedFlag, setConnectionCreatedFlag] = useState("failed")

  /******************************* */

  useEffect(() => {


    if (!chartRef.current) {
      return
    }
    const colors = ['success', 'danger']
    const chart = new ApexCharts(chartRef.current, chartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], chartHeight, chartWidth))
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

  const handleDetail = (obj:any) => {

  }

  const handdleHideModal = () => {
    buttonRef?.current?.click();
  }

  const displayModal = {
    display: hideModal
  }

  const updateExchange=(exchange:string)=>{
    setExchange(exchange)
  }

  const connectionCreated=(status:string)=>{
    setConnectionCreatedFlag(status)
    let timeout = setTimeout( setConnectionCreatedFlag , 3000, "failed")
  }

  const updateApis=(arg:any[])=>{
    apis = arg
  }

  const displayExchange =(exchangeArr:any)=> {
    if (exchangeArr===undefined){
      return ''
    } else if (exchangeArr!=undefined && exchangeArr.length===1){
      return exchangeArr![0]
    } else {
      return exchangeArr!.join(', ')
    }
    //return ''
  }

  return (
    <>
    <ConnectionModal strategyId={strategyId} exchanges={exchange} connectionCreated={connectionCreated} updateApis={updateApis} />
    <div className="modal fade" tabIndex={-1} id={"kt_modal_strategy_detail_"+strategyId} data-bs-backdrop="static" data-bs-keyboard="false">
      <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
          <div className="modal-header">
              <h5 className="modal-title">Strategy Detail</h5>
              <div
              className="btn btn-icon btn-sm btn-active-light-primary ms-2"
              data-bs-dismiss="modal"
              aria-label="Close"
              >
              <KTSVG
                  path="/media/icons/duotune/arrows/arr061.svg"
                  className="svg-icon svg-icon-2x"
              />
              </div>
          </div>
          <div className="modal-body">
                <StrategyDetail strategyId={strategyId} strategyObj={strategyObj} exchange={exchange} updateExchange={updateExchange} apis={apis}/>
          </div>
          <div className="modal-footer">
              <button
              type="button"
              className="btn btn-light"
              data-bs-dismiss="modal"
              >
              Close
              </button>
          </div>
          </div>
      </div>
    </div>
    <div className={"modal fade "+hideModal} tabIndex={-1} id={"kt_modal_copy_strategy_"+strategyId} data-bs-backdrop="static" data-bs-keyboard="false">
      <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
          <div className="modal-header">
              <h5 className="modal-title">Subscribe Strategy</h5>
              <div
              className="btn btn-icon btn-sm btn-active-light-primary ms-2"
              data-bs-dismiss="modal"
              aria-label="Close"
              >
              <KTSVG
                  path="/media/icons/duotune/arrows/arr061.svg"
                  className="svg-icon svg-icon-2x"
              />
              </div>
              
          </div>
            {connectionCreatedFlag === "success"? (
                <div className="alert alert-success" role="alert">
                  Successfully create connections
                  <br/>You're ready to subscribe
                </div>
              ):(
                <></>
              )}
          <div className="modal-body">
                <SubscribeStrategyDetail strategyId={strategyId} strategyObj={strategyObj} apis={apis} getData={getData} handdleHideModal={handdleHideModal}/>
          </div>
          <div className="modal-footer">
              <div
            
              id="close_subscribe_modal"
              className="btn btn-light"
              data-bs-dismiss="modal"
              style={{display: "hidden"}}
              ref={buttonRef}
              />
              
          </div>
        </div>
      </div>
    </div>
    <div className={`card ${className}`} key={Math.floor(Math.random() * 1000)}>
      {/* begin::Header */}
      <div className='card-header border-0 py-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>{strategyObj!.data!.strategy_name}
          </span>

          <span className='text-muted fw-bold fs-7'>Strategy Name</span>
        </h3>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>{strategyObj!.data!.market} : {strategyObj!.data!.asset}
          </span>

          <span className='text-muted fw-bold fs-7'>Market: Product</span>
        </h3>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>{displayExchange(strategyObj!.data!.exchange).toUpperCase()}
          </span>
 
          <span style={{color: "#858585", fontSize: "80%", textAlign:"left"}}>{strategyObj!.data!.description}</span>
        </h3>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Minimum investment : &nbsp;
              <NumberFormat
                  value={strategyObj!.data!.min_capital}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                />
          </span>

          <span className='text-muted fw-bold fs-7'></span>
        </h3>
        
        <div className='card-toolbar'>
          {/* begin::Menu */}
         
          <a href="#" className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target={"#kt_modal_strategy_detail_"+strategyId} id="strategy_detail" onClick={event => handleDetail(strategyObj)}>Detail</a>
          <Dropdown1 />
          {/* end::Menu */}
        </div>
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
                        'text-success': strategyObj!.data!.total_return > 0,
                      },
                      {
                        'text-danger': strategyObj!.data!.total_return < 0,
                      }
                    )}>
                      {strategyObj!.data!.total_return}%
                    </div>
                  <div className='fs-7 text-muted fw-bold'>Total Return</div>
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
                <div className={clsx(
                      'fs-4 text-dark fw-bolder fw-bolder text-hover-primary mb-1 fs-6 ',
                      {
                        'text-success': strategyObj!.data!.cagr > 0,
                      },
                      {
                        'text-danger': strategyObj!.data!.cagr < 0,
                      }
                    )}>
                      {strategyObj!.data!.cagr}%
                    </div>
                  <div className='fs-7 text-muted fw-bold'>CAGR</div>
                
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
                  <div className='symbol-label bg-light-danger'>
                    <KTSVG
                      path='/media/icons/duotune/abstract/abs027.svg'
                      className='svg-icon-1 svg-icon-danger'
                    />
                  </div>
                </div>
                {/* end::Symbol */}

                {/* begin::Title */}
                <div>
                  <div 
                  className={clsx(
                    'fs-4 text-dark fw-bolder fw-bolder text-hover-primary mb-1 fs-6 ',
                    {
                      'text-success': strategyObj!.data!.max_drawdown > 0,
                    },
                    {
                      'text-danger': strategyObj!.data!.max_drawdown < 0,
                    }
                  )}
                >
                  {strategyObj!.data!.max_drawdown}%</div>
                  <div className='fs-7 text-muted fw-bold'>Max DD</div>
                </div>
                {/* end::Title */}
              </div>
            </div>
            {/* end::Col */}
          </div>
          {/* end::Row */}

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
                  <div  className={clsx(
                      'fs-4 text-dark fw-bolder fw-bolder text-hover-primary mb-1 fs-6 ',
                      {
                        'text-success': strategyObj!.data!.calmar_ratio > 0,
                      },
                      {
                        'text-danger': strategyObj!.data!.calmar_ratio < 0,
                      }
                    )}>
                    {strategyObj!.data!.calmar_ratio}</div>
                  <div className='fs-7 text-muted fw-bold'>Calmar ratio</div>
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

export {StrategyWidget}
