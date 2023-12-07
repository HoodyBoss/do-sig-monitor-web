/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState, useCallback} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../_metronic/assets/ts/_utils'
import {Redirect, Route, Switch} from 'react-router-dom'
import {KTSVG} from '../../../_metronic/helpers'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {RedirectAuth0} from './components/RedirectAuth0'
import {PortfolioChart} from './charts'
import { useAuth0 } from "@auth0/auth0-react";
import MasterConfix from '../../../setup/MasterConfix';
import ReactGA from 'react-ga4';
import Collapse from 'react-bootstrap-v5'
import 'bootstrap/dist/js/bootstrap.min.js';

type Props = {
  classNameName: string
  chartColor: string
  chartHeight: string
  userId: string
  strategyId: string
  strategyObj: any
  getStrategyData?:() => void
}

type portfolio = {
  id: number
  name: string
  preset_name: string
  market: string
  asset_className: string
  asset: string
  status: string
  risk: string
  character: string
  equity: string
  weight: number
  pnl: any
  max_dd: string
  winrate: string
  cagr: string
  rsquare: string
  description: string
  min_invest: number
  current_equity: number
  percent_return: number
  sharp_ratio: number
  run_period: string
  myfxbook_link: string
  logo: string
  portfolio_link: string
}

export function LandingPageWhite() {
  ReactGA.initialize(MasterConfix.GA_MEASUREMENT_ID);
  //ReactGA.pageview(window.location.pathname + window.location.search);
  ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "DeepWealth portfolio optimization" });

  ReactGA.event({
    category: 'Link',
    action: 'Click',
    label: 'Optimize Portfolio'
  });

  const { loginWithRedirect, isAuthenticated } = useAuth0();

  const pieChartRef = useRef<HTMLDivElement | null>(null)
  const lineChartRef = useRef<HTMLDivElement | null>(null)
  const riskChartRef = useRef<HTMLDivElement | null>(null)
  const divWeightWarningModalbeRef = useRef<HTMLDivElement | null>(null)

  const [chartsData, setChartsData] = useState([] as any[])

  const [chart1Data, setChart1Data] = useState([] as any[])
  const [chart2Data, setChart2Data] = useState([] as any[])
  const [chart3Data, setChart3Data] = useState([] as any[])
  const [chart4Data, setChart4Data] = useState([] as any[])

  const [chart1Month, setChart1Month] = useState([] as any[])
  const [chart2Month, setChart2Month] = useState([] as any[])
  const [chart3Month, setChart3Month] = useState([] as any[])
  const [chart4Month, setChart4Month] = useState([] as any[])

  const [initInvestment, setInitInvestment] = useState("")
  const [report, setReport] = useState("")
  const [portfolios, setPortfolios] = useState([] as portfolio[])
  const [tmpPortfolios, setTmpPortfolios] = useState([] as portfolio[])
  const [loading, setLoading] = useState(false)
  const [progressing, setProgressing] = useState(0)
  const [showAdvance, setShowAdvance] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [chartChange, setChartChange] = useState(false)
  const [reRenderChart, setReRenderChart] = useState(0)
  const [warningMessage, setWarningMessage] = useState("")
  const [pnlReturn, setPnLReturn] = useState("")
  const [pctReturn, setPctReturn] = useState("")
  
  
  const api_url = MasterConfix.APP_BASE_API_PORTFOLIO_SIM

  const customHeaders = {
    "Content-Type": "application/json",
    "x-api-key": MasterConfix.GCP_AGIGATEWAY_KEY,
  }  
  
  const handleInvestmentOnChange = (e:any) => {
    e.preventDefault();
    setInitInvestment(e.target.value);
  }

  

  const logoStyle = {
    filter: "brightness(0.5) sepia(1) hue-rotate(-70deg) saturate(5);"
  }

  const optimizePortfolio = async (i:any, e:any) => {
      //i!.preventDefault();
      setProgressing(1)
      setShowAdvance(false)
      setChartChange(false)
      setReport("")

      if (initInvestment == "") {
        setWarningMessage("Please enter investment.")
        divWeightWarningModalbeRef!.current!.click()
        setShowWarning(true)
        setProgressing(0)
        setShowAdvance(false)
        return
      } 

      let sumWeight = 0;
      portfolios.map((item:any) => {
        sumWeight += parseInt(item.weight.toString())
      })

      if (sumWeight == 0) {
        setWarningMessage("Please select weight.")
        divWeightWarningModalbeRef!.current!.click()
        setShowWarning(true)
        setProgressing(0)
        setShowAdvance(false)
        
      } else {

        const data = {"id": 1, "name": "Nemo", "description": "xxx", "init_investment": initInvestment+"" , 
                  "optimize_type":"portfolio",
                  "assets": {"signal":"3","magic":"555","symbol":"EURUSD","size":"0.01","bot":"EUR_USD_H3_RL_L"},
                  "portfolios": portfolios
              }

        const fetchData = await fetch(api_url+'/portfolio/optimize', {method: 'POST', headers: customHeaders, body: JSON.stringify(data),})
          .then(response => response.json())
          .then( async(data) => { 
            setProgressing(2); 
            setReport(data["report"]);
            
            return data
          }).then( async(data) => {

            if (!pieChartRef.current) {
              return
            } else if (!lineChartRef.current) {
              return
            }
          
            const renderChart = async() => {

              const colors = ['success', 'success']
              const chartHeight = "250px"
              const chartWidth = '90%'

              const riskChartSeries:any[] = []
              const riskChartLabels:any[] = []

              const pieChartSeries:any[] = []
              const pieChartLabels:any[] = []

              // const lineChartSeries:any[] = []
              const lineChartDatas:any[] = []
              const lineChartLabel:any[] = []
              
              let label = 1
              let maxReturn = 0
              let minReturn = 0
             
              await Promise.all(data["pnl"].map( (item:any) => {
                lineChartDatas.push(parseInt(item))
                lineChartLabel.push(label)
                if (parseInt(item)>=maxReturn){
                  maxReturn = item
                }
                if (parseInt(item)<minReturn){
                  minReturn = item
                }
                label++;
              }))
              setPnLReturn(maxReturn.toString())

              setPctReturn( (((maxReturn*100)/parseFloat(initInvestment))-100).toString() );

              riskChartSeries.push( parseFloat(data["max_dd"]).toFixed(2).toLocaleString() )
              let lineChart = null;
              await Promise.all(portfolios.map((item:any) => {
                pieChartSeries.push( parseFloat(initInvestment) * (parseInt(item.weight.toString())/100) )
                pieChartLabels.push("$"+item.name)
                

              })).then(async()=>{
                const pieChart = new ApexCharts(pieChartRef.current, pieChartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], "120px", chartWidth, pieChartSeries, pieChartLabels ))
                
                if (pieChart) {
                  await pieChart.render()
                }

                const riskChart = new ApexCharts(riskChartRef.current, riskChartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], "150px", chartWidth, riskChartSeries, ["Risk"] ))
                
                if (riskChart) {
                  await riskChart.render()
                }

                lineChart = new ApexCharts(lineChartRef.current, lineChartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], chartHeight, chartWidth, lineChartDatas, lineChartLabel, minReturn-(minReturn*0.1), maxReturn+(maxReturn*0.1)))

                if (lineChart) {
                  await lineChart.render();
                }
              })
              
              return lineChart
            }

            await renderChart().then( (data) => {
              document.querySelector("#advanceResult")!.scrollIntoView();
            });
            
          })
      } //end if sum weight == 0

  }

  const handleSelect = (e:any) => {
    setChartChange(false)
    setShowWarning(false)
    setReport("")

    let sumWeight = 0;
    portfolios.map((item:any) => {
      if ( "weight_"+item.id != e.target.id) {
        sumWeight += parseInt(item.weight.toString())
      }
    })
    sumWeight += parseInt(e.target.value)

    if (sumWeight > 100) {
      setWarningMessage("Please select summary weight less than 100%.")
      divWeightWarningModalbeRef!.current!.click()
      setShowWarning(true)
    } else {

      setPortfolios(
        portfolios.map((item:any) => {
          if ( "weight_"+item.id == e.target.id) {
            return { ...item, weight: e.target.value };
          } else {
            return item;
          }
        })
      );

    }
  }

  const sleep = (ms:any) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

  const showAdvanceEvent = async() => {
    document.querySelector("#advanceBut")!.scrollIntoView(); 
    setProgressing(2)
    setShowAdvance(true)
    sleep(1000).then( () => {
      document.querySelector("#advanceResult")!.scrollIntoView(); //advanceBut
    })
    
  }

  const bodyStyle = {
    backgroundImage : "url('/media/bg/invest_bg.jpg')"
    // , opacity : "0.8"
  }


  useEffect( () => {
    // document.body.classNameList.add('bg-black')
    document.body.style.background = "#08122e";
    document.body.style.backgroundImage = "url('/media/bg/invest_bg.jpg')";
    document.body.style.backgroundBlendMode = "overlay";
    //document.body.style.backgroundImage.opacity = "0.3";
    //initial set    
    setLoading(true)

    const fetchData = async () => {
      
      const process = await fetch(api_url+'/portfolios?name=EXNESS', {method: 'GET', headers: customHeaders})
      .then( response => response.json())
      .then( async(data) => { 

        await Promise.all(data.map( async(item:any) => {

          let datas:any[] = []
          let months:any[] = []
          const equity_rows = await JSON.parse(item.equity).rows
          const min = equity_rows.length > 6 ? equity_rows.length - 6 : 0
          const max = equity_rows.length

          for (let ii=min;ii<max;ii++){
            
            await datas.push( parseInt((equity_rows[ii]["pnl"])) )
            await months.push( equity_rows[ii]["exit_month"] )
          } 

          if (item.id==1){
            await setChart1Data(datas)
            await setChart1Month(months) 

          } else if (item.id==2){
            await setChart2Data(datas) 
            await setChart2Month(months)

          } else if (item.id==4){
            await setChart3Data(datas)
            await setChart3Month(months)

          } else if (item.id==5){
            await setChart4Data(datas)
            await setChart4Month(months)
            
          }
          await setPortfolios(data); 
          await setTmpPortfolios(data);
          return data;
        })).then(async(data)=>{
          
          await setLoading(false);
          await setReRenderChart(2);
          await setChartChange(true);
          return data
        })

        return data
      })

      await Promise.all(process)
    }
    
    fetchData()

    // return ()=>{
    //   setChartChange(false);
    //   console.log("1. chart change::", chartChange)
    // }
    
    
  }, [isAuthenticated])

  const closeWeightWarning=async()=>{

    console.log("closeWeightWarning")
  }


  return (
    <div className = "container-fluid">
      
      <div className='accordion' id='kt_accordion_2'  key={Math.ceil(Math.random() * 10000)}>
        { portfolios.map( el=> el !=  undefined? (
          <div className='accordion-item' key={Math.ceil(Math.random() * 10000)}>
            <h2 className='accordion-header' id={'kt_accordion_'+el!.id+'_header_'+el!.id} key={Math.ceil(Math.random() * 10000)}>
              <button key={Math.ceil(Math.random() * 10000)}
                className='col-sm-3 accordion-button fs-4 fw-bold collapsed'
                type='button'
                data-bs-toggle='collapse'
                data-bs-target={'#kt_accordion_'+el!.id+'_body_'+el!.id}
                aria-expanded='false'
                aria-controls={'kt_accordion_'+el!.id+'_body_'+el!.id}
              >
                {el!.name}
              </button>
              <input
                  type="number" width={'10'}
                  className="col-sm-3 form-control"
                  placeholder="$"
                  id = {"initial_investment"+el!.id}
                  onBlur={e => handleInvestmentOnChange(e)}
                  defaultValue={initInvestment}
                  min = "0"
                />
            </h2>
            <div key={Math.ceil(Math.random() * 10000)}
              id={'kt_accordion_'+el!.id+'_body_'+el!.id}
              className='accordion-collapse collapse'
              aria-labelledby={'kt_accordion_'+el!.id+'_header_'+el!.id}
              data-bs-parent='#kt_accordion_2'
            >
              <div className='accordion-body' key={Math.ceil(Math.random() * 10000)}>
                <strong key={Math.ceil(Math.random() * 10000)}>{el!.name}</strong>&nbsp;&nbsp;
                {el!.description}
                <code key={Math.ceil(Math.random() * 10000)}>.accordion-body</code>, though the transition does limit overflow.
              </div>
            </div>
          </div>
        ):(<></>))}
      </div>
      
    </div>)
}

const pieChartOptions = (chartColor: string, chartHeight: string, chartWidth: string, chartSeries: any, chartLabels: any): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-800')
  const strokeColor = getCSSVariableValue('--bs-gray-300')
  const baseColor = getCSSVariableValue('--bs-' + chartColor)
  const lightColor = getCSSVariableValue('--bs-light-' + chartColor)
  
  return {
    series: chartSeries,
    labels: chartLabels,
    chart: {
      fontFamily: 'inherit',
      type: 'pie',
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
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        console.log("Opts::", opts)
        return val.toLocaleString() + "%"
      },
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: true,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
            offset: 0,
            minAngleToShowLabel: 10
        }
      },
    }
  }
}

const riskChartOptions = (chartColor: string, chartHeight: string, chartWidth: string, chartSeries: any, chartLabels: any): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-800')
  const strokeColor = getCSSVariableValue('--bs-gray-300')
  const baseColor = getCSSVariableValue('--bs-' + chartColor)
  const lightColor = getCSSVariableValue('--bs-light-' + chartColor)
  
  return {
    series: chartSeries,
    labels: chartLabels,
    chart: {
      fontFamily: 'inherit',
      type: 'radialBar',
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
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        console.log("Opts::", opts)
        return val.toLocaleString() + "%"
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: -2,
            fontSize: '22px'
          }
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91]
      },
    },
    
  }
}

const lineChartOptions = (chartColor: string, chartHeight: string, chartWidth: string, chartDatas:any, lineChartLabel:any, min:number, max:number): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-800')
  const strokeColor = getCSSVariableValue('--bs-gray-300')
  const baseColor = getCSSVariableValue('--bs-' + chartColor)
  const lightColor = getCSSVariableValue('--bs-light-' + chartColor)

  return {
    series: [
      {
        name: 'Return',
        data: chartDatas
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
      categories: lineChartLabel,//['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
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
      min: min,
      max: max,
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