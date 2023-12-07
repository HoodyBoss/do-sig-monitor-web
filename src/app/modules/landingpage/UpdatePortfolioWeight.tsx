/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../_metronic/assets/ts/_utils'
import {Redirect, Route, Switch} from 'react-router-dom'
import {KTSVG} from '../../../_metronic/helpers'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {RedirectAuth0} from './components/RedirectAuth0'
import { useAuth0 } from "@auth0/auth0-react";
import MasterConfix from '../../../setup/MasterConfix'

type Props = {
  className: string
  chartColor: string
  chartHeight: string
  userId: string
  strategyId: string
  strategyObj: any
  getStrategyData?:() => void
}

export function UpdatePortfolioWeight() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const chartRef1 = useRef<HTMLDivElement | null>(null)
  const chartRef2 = useRef<HTMLDivElement | null>(null)
  const chartRef3 = useRef<HTMLDivElement | null>(null)
  const reportRef = useRef<HTMLDivElement | null>(null)
  const settingRef = useRef<HTMLDivElement | null>(null)

  const [selectValue, setValue] = useState("")
  const [presetId, setPresetId] = useState("")
  const [initInvestment, setInitInvestment] = useState("")
  const [report, setReport] = useState("")
  const [portfolioName, setPortfolioName] = useState("")
  const [strategies, setStrategies] = useState([] as any[])
  const [portfolios, setPortfolios] = useState([] as any[])
  const [strategyInfo, setStrategyInfo] = useState([] as any[])
  const [strategySelected, setStrategySelected] = useState([] as any[])
  const [optimizeResult, setOptimizeResult] = useState([] as any[])
  const [loading, setLoading] = useState(false)
  
  const handleInvestmentOnChange = (e:any) => {
    e.preventDefault();
    setInitInvestment(e.target.value);
  }

  const portfolio_id = 4
  useEffect(()=>{
    //initial set 
    const customHeaders = {
        "Content-Type": "application/json",
    }
    console.log("Loading")
    fetch(MasterConfix.APP_BASE_API_PORTFOLIO_SIM+'/presets?portfolio_id='+portfolio_id, {method: 'GET', headers: customHeaders})
        .then(response => response.json())
        .then(data => { 
          setStrategies(data); 
          if (data.length>0){
            setPortfolioName(data[0].portfolio_name)
          }
        })

    // fetch(api_url+'/strategies', {method: 'GET', headers: customHeaders})
    // .then(response => response.json())
    // .then(data => { setPortfolios(data); console.log("Strategies:::", data)})

  }, [])

  useEffect(() => {
    document.body.classList.add('bg-black')
    
    if (!chartRef1.current) {
      return
    }

    const colors = ['success', 'danger']
    const chartHeight = "150px"
    const chartWidth = '100%'

    const chart1Data = [Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10
        , Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10]

    const chart1 = new ApexCharts(chartRef1. current, chartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], chartHeight, chartWidth, chart1Data ))
    if (chart1) {
      chart1.render()
    }

    const chart2Data = [Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10
      , Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10]

    const chart2 = new ApexCharts(chartRef2. current, chartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], chartHeight, chartWidth, chart2Data ))
    if (chart2) {
      chart2.render()
    }

    const chart3Data = [Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10
      , Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10]

    const chart3 = new ApexCharts(chartRef3. current, chartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], chartHeight, chartWidth, chart3Data ))
    if (chart3) {
      chart3.render()
    }
    
    return () => {
      document.body.classList.remove('bg-black')
      if (chart1) {
        chart1.destroy()
      }
      if (chart2) {
        chart2.destroy()
      }
      if (chart3) {
        chart3.destroy()
      }
    }
  }, [isAuthenticated, chartRef1, chartRef2, chartRef3, settingRef, strategyInfo, report])
  
  const logoStyle = {
    filter: "brightness(0.5) sepia(1) hue-rotate(-70deg) saturate(5);"
  }

  const optimizePortfolio = async (e:any) => {
      setLoading(true)
      // setStrategyInfo(presets[presetId as keyof typeof presets]["detail"])

      const customHeaders = {
          "Content-Type": "application/json",
      }
      const data = {"id": strategySelected, "name": "Nemo", "description": "xxx", "init_investment": initInvestment+"" , 
                "assets": {"signal":"3","magic":"555","symbol":"EURUSD","size":"0.01","bot":"EUR_USD_H3_RL_L"},
                "strategy": strategyInfo
            }

      await fetch(MasterConfix.APP_BASE_API_PORTFOLIO_SIM+'/portfolio/optimize', {method: 'POST', headers: customHeaders, body: JSON.stringify(data),})
        .then(response => response.json())
        .then(data => { setReport(data["report"]); setLoading(false); })
      
  }

  const updateLotSize = async (e:any) => {
    setLoading(true)
    
    const customHeaders = {
        "Content-Type": "application/json",
    }
    const data = {"id": portfolio_id, "name": "Nemo", "description": "xxx", "init_investment": initInvestment+"" , 
                "assets": {"signal":"3","magic":"555","symbol":"EURUSD","size":"0.01","bot":"EUR_USD_H3_RL_L"},
                "strategy": strategies
            }
    await fetch(MasterConfix.APP_BASE_API_PORTFOLIO_SIM+'/portfolio/updatelot', {method: 'POST', headers: customHeaders, body: JSON.stringify(data),})
      .then(response => response.json())
      .then(data => {  setLoading(false); })
    
}

  const handleSelect = (e:any) => {
    // const {[name: string], [value: string]} = e.target
    setValue(e.target.value);
    setPresetId(e.target.value)
    setReport("")
    console.log("id::",  e.target.id, " type of::", typeof(e.target.id))

    setStrategySelected(
      strategySelected.map((item) => {
        console.log("no typeof::", (item.no == e.target.id))
        if ( item.no == e.target.id) {
          return { ...item, id: e.target.value };
        } else {
          return item;
        }
      })
    );

    console.log("setStrategySelected::",  strategySelected)
    
  }

  const addStrategy = async () => {
    let max = Math.max(...strategySelected.map(o => o.no))
    max = max == -Infinity ? 0 : max
    setStrategySelected(current => [...current, {no: max+1, id: null, weight: 0}])
  }

  const assignWeight = async(e:any) => {
    // setStrategySelected(
    //   strategySelected.map((item) => {
    //     if ("txt"+item.no == e.target.id) {
    //       return { ...item, weight: e.target.value };
    //     } else {
    //       return item;
    //     }
    //   })
    // );
    setStrategies(
      strategies.map((item) => {
        console.log("Compare::", ("strategy_id_"+item.id == e.target.id))
        if ("strategy_id_"+item.id == e.target.id) {
          return { ...item, lot_size: e.target.value };
        } else {
          return item;
        }
      })
    );

    console.log("Strategy:", strategies)
  }

  return (
    <div>

      {/* begin::Content */}
      <div className='row g-5 g-xxl-12'>
        {/* <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'> */}
        
        <div className='d-flex flex-center flex-column flex-column-fluid p-12 pb-lg-12'>
        <label className="form-check-label" key = {Math.random()}><h2>Portfolio Theme : {portfolioName}</h2></label>
        <br/>
          <table width = "30%" cellSpacing={3} cellPadding={3}>
            <thead>
              <tr>
                <th align="center">Strategy</th>
                <th align="center">Lot size</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map( ele => ele != undefined? (
              <tr key={Math.random()*1000}>
                <td key={Math.random()*1000}>
                <label className="form-check-label" key = {Math.random()}>{ele!.nickname}</label>
                </td>
                <td key={Math.random()*1000}>
                  <input
                      type="text"
                      className="form-control"
                      placeholder="lot size"
                      id = {"strategy_id_"+ele!.id}
                      defaultValue={ele!.lot_size}
                      onBlur={assignWeight}
                    />
                </td>
              </tr>
              ):(
                <></>
              ))}
            </tbody>
          </table>
          
        </div>
      </div>
      {/* end::Content */}
      
      <div className='d-flex flex-center flex-column-auto p-10'>
        <a href="#" className="btn btn-primary " id="optimize" onClick={event => updateLotSize(strategyInfo)}>Update Lot size</a>
      </div>
      { /* begin: optimize result */ }
      <>
          {loading ? (
              <div className="card-xl-stretch mb-xl-12 text-center" key={Math.floor(Math.random() * 1000)}>
                  <div className="spinner-border" style={{width: "6rem",height: "6rem"}} role="status" key={Math.floor(Math.random() * 1000)}>
                      <span className="sr-only">Loading...</span>
                  </div>
              </div> 
              ):(
              <>
                <div className='d-flex p-30' style={{width: "100%"}} key = "4" id = "4" dangerouslySetInnerHTML={{ __html: report }}></div> &nbsp;
              </>
             )}
      </>
      { /* end: optimize result */ }

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

const chartOptions = (chartColor: string, chartHeight: string, chartWidth: string, resultData: any): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-800')
  const strokeColor = getCSSVariableValue('--bs-gray-300')
  const baseColor = getCSSVariableValue('--bs-' + chartColor)
  const lightColor = getCSSVariableValue('--bs-light-' + chartColor)

  return {
    series: [
      {
        name: 'Net Profit',
        //data: [Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10
        //  , Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10, Math.round((0 + (Math.random() * (5-0))))*10],
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