/* eslint-disable jsx-a11y/anchor-is-valid */

import React, {useEffect, useRef, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '../../../_metronic/assets/ts/_utils'
import {KTSVG} from '../../../_metronic/helpers'
import { useAuth0 } from "@auth0/auth0-react";
import MasterConfix from '../../../setup/MasterConfix';
import ReactGA from 'react-ga4';
import {isMobile} from 'react-device-detect';
import jsonData from './data_exness.json'


type Props = {
  className: string
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
  asset_class: string
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
  myfxgraph: string
  account_no: string
}

type myFxBookAccInfo = {
  error: boolean
  message: string
  accounts: any[]
}

export function LandingPageV1() {
  ReactGA.initialize(MasterConfix.GA_MEASUREMENT_ID);
  //ReactGA.pageview(window.location.pathname + window.location.search);
  ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "DeepWealth portfolio optimization" });

  ReactGA.event({
    category: 'Link',
    action: 'Click',
    label: 'Optimize Portfolio'
  });

  ReactGA.event({
    category: 'Select',
    action: 'Select',
    label: 'Weight'
  });

  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [width, setWidth] = useState<number>(window.innerWidth);

  const pieChartRef = useRef<HTMLDivElement | null>(null)
  const lineChartRef = useRef<HTMLDivElement | null>(null)
  const riskChartRef = useRef<HTMLDivElement | null>(null)
  const divWeightWarningModalbeRef = useRef<HTMLDivElement | null>(null)
  const divModalbeRef = useRef<HTMLDivElement | null>(null)
  const closeDivModalbeRef = useRef<HTMLDivElement | null>(null)
  
  const [myFxBookAccInfo, setMyFxBookAccInfo] = useState<myFxBookAccInfo>()
  const [chartsData, setChartsData] = useState([] as any[])

  const [chart1Data, setChart1Data] = useState([] as any[])
  const [chart2Data, setChart2Data] = useState([] as any[])
  const [chart3Data, setChart3Data] = useState([] as any[])
  const [chart4Data, setChart4Data] = useState([] as any[])

  const [chart1Month, setChart1Month] = useState([] as any[])
  const [chart2Month, setChart2Month] = useState([] as any[])
  const [chart3Month, setChart3Month] = useState([] as any[])
  const [chart4Month, setChart4Month] = useState([] as any[])

  const [pieChartSeriesObj, setPieChartSeriesObj] = useState([] as any[])
  const [pieChartWeightArr, setPieChartWeightArr] = useState([] as any[])
  const [pieChartLabelsObj, setPieChartLabelsObj] = useState([] as any[])
  const [pieChartColors, setPieChartColors] = useState([] as any[])

  const [initInvestment, setInitInvestment] = useState("")
  const [report, setReport] = useState("")
  const [portfolios, setPortfolios] = useState([] as any[])
  const [tmpPortfolios, setTmpPortfolios] = useState([] as any[])
  const [loading, setLoading] = useState(false)
  const [progressing, setProgressing] = useState(0)
  const [showAdvance, setShowAdvance] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [chartChange, setChartChange] = useState(true)
  const [reRenderChart, setReRenderChart] = useState(0)
  const [warningMessage, setWarningMessage] = useState("")
  const [pnlReturn, setPnLReturn] = useState("")
  const [pctReturn, setPctReturn] = useState("")
  const [portfolioCardClass, setPortfolioCardClass] = useState("col-sm-3")
  const [isDataExpired, setIsDataExpired] = useState(true)
  const [optimizeError, setOptimizeError] = useState(true)
  const [offlineOptimize, setOfflineOptimize] = useState(false)
  const [showPieChart, setShowPieChart] = useState(false)
  const [tempWindowWidth, setTempWindowWidth] = useState(0)
  
  const api_url = MasterConfix.APP_BASE_API_PORTFOLIO_SIM

  //global variable here ------------------------------------------
  const customHeaders = {
    "Content-Type": "application/json",
    "x-api-key": MasterConfix.GCP_AGIGATEWAY_KEY,
  }  

  const colors = ['#c94f0e', '#e6d62e', '#65e62e', '#0accc2', '#cc0abf']
  let chartWidth = '90%'
  let chartHeight = "95%"

  let globalPortfolioObj:any[] = []

  //global variable here ------------------------------------------
  
  const handleInvestmentOnChange = (e:any) => {
    e.preventDefault();
    setInitInvestment(e.target.value);
    setShowPieChart(false);
  }

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  // const isMobile = width <= 768;
  console.log("Window width::::", width)
  console.log("Is mobile::::", isMobile)
  if (!isMobile){
    chartWidth = '90%'
    chartHeight = "300px"
  } else {
    if (width<360){
      chartHeight = "85%"
    } else if (width<400){
      chartHeight = "90%"
    } else if (width<600){
      chartHeight = "95%"
    } else if (width<700){
      chartHeight = "98%"
    } else if (width<800){
      chartHeight = "98%"
    } else if (width<1200){
      chartHeight = "98%"
    }
  }

  const logoStyle = {
    filter: "brightness(0.5) sepia(1) hue-rotate(-70deg) saturate(5);"
  }

  // const importAll = async(r:any[]) => {
  //     let images = {};
  //     r.keys()!.map(item => { images[item.replace('./', '')] = r(item); });
  //     return images;
  // }

  const optimizePortfolio = async (i:any, e:any) => {
      i!.stopPropagation();
      i!.preventDefault();
      await setShowPieChart(false);

      document.querySelector("#optimizeLoading")!.scrollIntoView();
      if (initInvestment == "") {
        await setWarningMessage("Please enter investment.")
        
        await setShowWarning(true)
        await setProgressing(0)
        await setShowAdvance(false)
        await divWeightWarningModalbeRef!.current!.click()
        await document.querySelector("#initial_investment")!.scrollIntoView(); 
        // document.getElementById("initial_investment")?.focus()
        return
      } 

      let sumWeight = 0;
      portfolios.map((item:any) => {
        sumWeight += parseInt(item.weight.toString())
      })
    
      if (sumWeight == 0) {
        await setWarningMessage("Please select weight.")
        
        await setShowWarning(true)
        await setProgressing(0)
        await setShowAdvance(false)
        await divWeightWarningModalbeRef!.current!.click()
        
      } else {
        // console.log("4")
        // divModalbeRef!.current!.click()
        document.querySelector("#optimizeLoading")!.scrollIntoView(); 

        let capital = 0, temp=0;
        portfolios.map((item:any) => {
          temp = parseFloat(item.initial_investment) * (parseInt(item.weight.toString())/100)
          console.log("temp:::", temp)
          capital += temp
        })
        console.log("Capital>>>>", capital)
        const data = {"id": 1, "device_width": width, "is_mobile": isMobile, "description": "xxx", "init_investment": capital+"" , 
                  "optimize_type":"portfolio",
                  "assets": {"signal":"3","magic":"555","symbol":"EURUSD","size":"0.01","bot":"EUR_USD_H3_RL_L"},
                  "portfolios": portfolios
              }
        
        // closeDivModalbeRef!.current!.click()
        // retry until no error from server

        let isSuccess = false
        while (!isSuccess) {
          setProgressing(1)
          setShowAdvance(false)
          setReport("")

          
            const fetchData = await fetch(api_url+'/portfolio/optimize', {method: 'POST', headers: customHeaders, body: JSON.stringify(data),})
              .then( async(response) => {
    
                if(response.ok) {
                  // if no error from server ex. error code 503, 504. no need to retry to optimize again
                  isSuccess = true;
                  return response.json();         
                }
                throw new Error('Something went wrong. Error:'+response.status);
              }).then( async(data) => { 

                await setProgressing(2); 
                await setReport(data["report"]);
                // document.querySelectorAll("kt_modal_loading")!
                await sleep(1000)
                // await closeDivModalbeRef!.current!.click()
                document.querySelector("#advanceResult")!.scrollIntoView(); 
                return data
              }).then( async(data) => {
                document.querySelector("#advanceResult")!.scrollIntoView(); 
                setProgressing(2); 
                
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
                  
                  let lineChart = null;
                  if ( Array.isArray(data["pnl"])){ 
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
                  }

                  setPnLReturn(maxReturn.toString())

                  setPctReturn( (((maxReturn*100)/parseFloat(initInvestment))-100).toString() );
                  
                  riskChartSeries.push( parseFloat(data["max_dd"]).toFixed(2).toLocaleString() )
                  
                  await Promise.all(portfolios.map((item:any) => {
                    pieChartSeries.push( parseFloat(initInvestment) * (parseInt(item.weight.toString())/100) )
                    pieChartLabels.push("$"+item.name)
                    

                  })).then(async()=>{
                    // const pieChart = new ApexCharts(pieChartRef.current, pieChartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], "120px", chartWidth, pieChartSeries, pieChartLabels ))
                    
                    // if (pieChart != null) {
                    //   await pieChart.render()
                    // }

                    // const riskChart = new ApexCharts(riskChartRef.current, riskChartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], "150px", chartWidth, riskChartSeries, ["Risk"] ))
                    
                    // if (riskChart) {
                    //   await riskChart.render()
                    // }

                    // lineChart = new ApexCharts(lineChartRef.current, lineChartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], chartHeight, chartWidth, lineChartDatas, lineChartLabel, minReturn-(minReturn*0.1), maxReturn+(maxReturn*0.1)))

                    // if (lineChart) {
                    //   await lineChart.render();
                    // }
                  })

                  return lineChart
                }
                
                

              }).catch( async(error) => {                        // catch
                sleep(2000) //wait 2 sec then try optimize again
                console.log("Optimization error::", error)
                
              });

          } // end while

          // render pie chart
          let investment = initInvestment
          //generate money allocate
          globalPortfolioObj = portfolios
          generatePieChart(investment, sumWeight)
      }

      
  }

  const handleSelect = async(e:any, name:any) => {
    // setChartChange(false)
    setShowWarning(false)
    setShowPieChart(false)
    setReport("")

    let sumWeight = 0;
    portfolios.map((item:any) => {
      if ( "weight_"+item.id != e.target.id) {
        sumWeight += parseInt(item.weight.toString())
      }
    })
    sumWeight += parseInt(e.target.value)

    if (sumWeight > 100) {
      await setWarningMessage("Please select summary weight less than 100%.")
      await setShowWarning(true)
      await divWeightWarningModalbeRef!.current!.click()
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

      globalPortfolioObj = portfolios
      globalPortfolioObj = globalPortfolioObj.map((item:any) => {
        if ( "weight_"+item.id == e.target.id) {
          return { ...item, weight: e.target.value };
        } else {
          return item;
        }
      })

      
      //generate money allocate
      // let investment = initInvestment
      // await generatePieChart(investment, sumWeight)


    }
  }

  const resetWeight = async(e:any) => {
    e!.stopPropagation();
    e!.preventDefault();
    setShowWarning(false)
    setShowPieChart(false)
    setReport("")

    setPortfolios(
      portfolios.map((item:any) => {
        return { ...item, weight: 0 };
      })
    );
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
  }


  useEffect( () => {

    document.body.style.background = "#08122e";
    document.body.style.backgroundImage = "url('/media/bg/invest_bg.jpg')";
    document.body.style.backgroundBlendMode = "overlay";
    setPieChartColors(colors)
    //initial set    
    setLoading(true)

    const fetchData = async () => {
      
      //initial by use json file
      if (!isDataExpired){

        await setPortfolios(jsonData); 
        await setTmpPortfolios(jsonData);
        await setLoading(false);
        await setReRenderChart(2);
        globalPortfolioObj = jsonData
        

      } else {

        const portfoliosData = await fetch(api_url+'/portfolios?name=EXNESS', {method: 'GET', headers: customHeaders})
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
            globalPortfolioObj = data
            return data;
          })).then(async(data)=>{
            
            await setLoading(false);
            await setReRenderChart(2);
            
            return data
          })
          return data
        })
        await Promise.all(portfoliosData)
      }
    }
    
    fetchData()

    if (width<=700){
      setPortfolioCardClass("col-sm-12")
    } else if (width<=1200){
      setPortfolioCardClass("col-sm-6")
    } else if (width<=1650){
      setPortfolioCardClass("col-sm-6")
    } else {
      setPortfolioCardClass("col-sm-3")
    }

    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
    
  }, [isAuthenticated, portfolioCardClass])

  const closeWeightWarning=async()=>{

    console.log("closeWeightWarning")
  }

  const [clickedButton, setClickedButton] = useState('');

  const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const button: HTMLButtonElement = event.currentTarget;
    setClickedButton(button.name);
  };

  const renderPieChart = async(e:any) => {
    // e!.stopPropagation();
    e!.preventDefault();
    let investment = e.target.value

    if (investment == "") {
      await setWarningMessage("Please enter investment.")
      
      await setShowWarning(true)
      await setProgressing(0)
      await setShowAdvance(false)
      await divWeightWarningModalbeRef!.current!.click()
      await document.querySelector("#initial_investment")!.scrollIntoView(); 
      await setShowPieChart(false)
      return
    } 
    
    let sumWeight = 0;
    portfolios.map((item:any) => {
      if ( "weight_"+item.id != e.target.id) {
        sumWeight += parseInt(item.weight.toString())
      }
    })
    
    if (sumWeight == 0) {
      await setWarningMessage("Please select weight.")
      
      await setShowWarning(true)
      await setProgressing(0)
      await setShowAdvance(false)
      await setShowPieChart(false)
      await divWeightWarningModalbeRef!.current!.click()
      
    } else {
      setInitInvestment(investment)
      globalPortfolioObj = portfolios
      globalPortfolioObj = globalPortfolioObj.map((item:any) => {
        if ( "weight_"+item.id == e.target.id) {
          return { ...item, weight: e.target.value };
        } else {
          return item;
        }
      })

      generatePieChart(investment, sumWeight)

    }

  }

  let globalRemain = 0
  let pieChartSeries:any[] = []
  let pieChartLabels:any[] = []
  let pieChartWeight:any[] = []
  const generatePieChart = async(investment:any, sumWeight:any) => {
    globalRemain = 0
    if (investment != "" && !isNaN(parseInt(investment))){
      pieChartSeries = []
      pieChartLabels = []
      pieChartWeight = []

      // globalPortfolioObj = portfolios
      
      let remain = 100 - sumWeight;
      globalRemain = remain
      let dataValue = 0;
      if (remain>0){
        let remainValue = parseFloat(investment) * (remain/100)
        await pieChartSeries.push( remainValue )
        // pieChartLabels.push("N/A: "+remainValue.toFixed(2).toLocaleString()+"$")
        await pieChartLabels.push("No Allocate")
        await pieChartWeight.push(remain)
      }

      await Promise.all(globalPortfolioObj.map(async(item:any) => {
          // pieChartSeriesObj.push( {""} )
          dataValue = parseFloat(investment) * (parseInt(item.weight.toString())/100)
          await pieChartSeries.push( dataValue )
          await pieChartLabels.push(item.name)
          await pieChartWeight.push(item.weight)

          await setPieChartSeriesObj(pieChartSeries)
          await setPieChartLabelsObj(pieChartLabels)
          await setPieChartWeightArr(pieChartWeight)
        })).then(async()=>{
          setShowPieChart(true)
          const pieChart = new ApexCharts(pieChartRef!.current!, pieChartOptions(colors[Math.round((0 + (Math.random() * (1-0))))], chartHeight, chartWidth, pieChartSeries, pieChartLabels ))
          
          if (pieChart != null) {
            await pieChart.render()
          }
        })
    }
  }

  if (width != tempWindowWidth) {
    setTempWindowWidth(width)
    // setShowPieChart(false)
    let sumWeight = 0;
    portfolios.map((item:any) => {
      sumWeight += parseInt(item.weight.toString())
    })

    let investment = initInvestment
    globalPortfolioObj = portfolios
    generatePieChart(investment, sumWeight)
  }

  return (
    <div className = "container-fluid">
      
      <div className="row m-5" >
        <div className="row">
          <div className='col-sm-6'>
            <h1 className="display-3 text-center align-items-center justify-content-center">Deep Wealth</h1>
            <h3 className="text-center align-items-center justify-content-center">Allocate Right, Elevate Wealth</h3>
          </div>
          <div className="col-sm-6">
            
            <div className='align-items-center justify-content-center'>
                <p>&nbsp;</p>
                <h5 className='text-start text-break text-gray-500'><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“Deep Wealth: Take control of your investments by allocating funds to our advanced trading robots. 
                  Empower your financial journey with data-driven insights, ensuring strategic positioning for optimal wealth growth.”
              </p>
                </h5>

            </div>
          </div>
        </div>
        
      </div>
      {loading ? (
        <div className="card-xl-stretch mb-xl-12 text-center" key={Math.ceil(Math.random() * 10000)}>
            <div className="spinner-border" style={{width: "6rem",height: "6rem"}} role="status" key={Math.floor(Math.random() * 10000)}>
                <span className="sr-only">Page Loading...</span>
            </div>
        </div> 
      ):(
      <div > 
        <div ref={divModalbeRef} id = "openLoadingModal" data-bs-toggle="modal" data-bs-target={"#kt_modal_loading"}  key={Math.ceil(Math.random() * 10000)}/>
        <div ref={closeDivModalbeRef} id = "closeLoadingModal" data-bs-dismiss="modal" data-bs-target={"#kt_modal_loading"}  key={Math.ceil(Math.random() * 10000)}/>

        <div className="modal fade" tabIndex={-1} id="kt_modal_loading" data-bs-backdrop="static" data-bs-keyboard="false" key={Math.ceil(Math.random() * 10000)}>

          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content ">
              <div className="modal-header">
                <h5 className="modal-title"><span className="text-info">Processing</span></h5>
                
                <div
                  className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref={closeDivModalbeRef}
                >
                  {/* <KTSVG
                    path="/media/icons/duotune/arrows/arr061.svg"
                    className="svg-icon svg-icon-2x"
                  /> */}
                </div>
              </div>
              <div className="modal-body">
                <div className="card-xl-stretch mb-xl-12 text-center" key={Math.ceil(Math.random() * 10000)}  id = "optimizeLoading">
                    <div className="spinner-border" style={{width: "6rem",height: "6rem"}} role="status" key={Math.floor(Math.random() * 10000)}>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div> 
              </div>
              {/* <div className="modal-footer modal-dialog-centered">
                  <div className="text-danger"  data-bs-dismiss="modal" ref={closeDivModalbeRef} >&nbsp;</div>
              </div> */}
            </div>
          </div>
        </div>
       

        <div ref={divWeightWarningModalbeRef} id = "openConfirmDeleteModal" data-bs-toggle="modal" data-bs-target={"#kt_modal_confirm_delete"}  key={Math.ceil(Math.random() * 10000)}/>

        <div className="modal fade" tabIndex={-1} id="kt_modal_confirm_delete" data-bs-backdrop="static" data-bs-keyboard="false" key={Math.ceil(Math.random() * 10000)}>

          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content ">
              <div className="modal-header">
                <h5 className="modal-title"><span className="text-warning">Warning!</span></h5>
                
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
                  {warningMessage}
              </div>
              <div className="modal-footer modal-dialog-centered">
                  <a href="" className="text-danger"  data-bs-dismiss="modal" onClick={event => closeWeightWarning()}>Close</a>
              </div>
            </div>
          </div>
        </div>

        <div className='row '>

          
          {/* begin::Content w-25 card mb-xxl-8 mx-auto  */}
          { portfolios.map( el=> el !=  undefined? (
            
            <div className={portfolioCardClass} key={Math.floor(Math.random() * 10000)} id = "portfolioCard">
            
            <div className={`card m-2 justify-content-center`} key={Math.floor(Math.random() * 10000)} >
              {/* begin::Beader */}
              <div className='card-header border-0 m-2' style={{backgroundColor:"#080c26"}} >
                <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bolder fs-5 mb-1'>{el!.name}</span>
                  <span className='text-muted fw-bold fs-5'>Name</span>
                </h3>
                <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bolder fs-5 mb-1'>
                    <img
                                src={el!.logo} width="90%"
                                className='svg-icon-1 svg-icon-info '
                              />
                  </span>
  
                </h3>
                
              </div>
              {/* end::Header */}

              {/* begin::Body */}
              <div className='card-body p-0 d-flex flex-column' >
                {/* begin::Stats */}
                <div className='card-px flex-grow-1'>

                  {/* begin::Row */}
                  <div className='row h-25'>
                    {/* begin::Col */}
                    <div className='col'>
                      <div className='d-flex align-items-center me-2'>
                        

                        {/* begin::Title */}
                        <div>
                          <div className={'fs-4 text-dark fw-bolder fw-bolder text-hover-primary mb-1 fs-6 text-success'}>
                              <h1>{el!.percent_return!.toFixed(2).toLocaleString()}%</h1>
                              
                          </div>
                          <div className='fs-7 text-muted fw-bold'>Return</div>
                        </div>
                        {/* end::Title */}
                      </div>
                    </div>

                    <div className='col'>
                      <div className='d-flex align-items-center me-2'>
                        

                        {/* begin::Title */}
                        <div>
                          <div className={'fs-4 text-dark fw-bolder fw-bolder text-hover-primary mb-1 fs-6 text-success'}>
                              {el!.current_equity!.toFixed(2).toLocaleString()}
                            </div>
                          <div className='fs-7 text-muted fw-bold'>Equity</div>
                        </div>
                        {/* end::Title */}
                      </div>
                    </div>
                    {/* end::Col */}
                  </div>
                  {/* end::Row */}


                  {/* begin::Row */}
                  <div className='row h-25'>
                    {/* begin::Col */}
                    <div className='col'>
                      <div className='d-flex align-items-center me-2'>
                        

                        {/* begin::Title */}
                        <div>
                          <div className={'fs-4 text-dark fw-bolder fw-bolder text-hover-primary mb-1 fs-6 text-success'}>
                              {el!.max_dd!.toLocaleString()}%
                            </div>
                          <div className='fs-7 text-muted fw-bold'>Max. Drawdown</div>
                        </div>
                        {/* end::Title */}
                      </div>
                    </div>

                    <div className='col'>
                      <div className='d-flex align-items-center me-2'>
                        

                        {/* begin::Title */}
                        <div>
                          <div className={'fs-4 text-dark fw-bolder fw-bolder text-hover-primary mb-1 fs-6 text-success'}>
                            {el!.risk}
                          </div>
                          <div className='fs-7 text-muted fw-bold'>Risk Level</div>
                        </div>
                        {/* end::Title */}
                      </div>
                    </div>
                    {/* end::Col */}
                  </div>
                  {/* end::Row */}
                  
                  {/* begin::Row */}
                  <div className='row'>
                    {/* begin::Col */}
                    <div className='col'>
                      {/* <div className='fs-7 text-muted fw-bold'>Portfolio Description</div> */}
                      <div className='w-100'>
                        <br/>
                        {el!.description}
                        
                      </div>
                      <br/>
                    </div>

                  </div>
                  {/* end::Row */}
                  {/* begin::Chart */} 
                  <div className="row h-25" key={Math.floor(Math.random() * 10000)}>
                    <div className='col-sm text-center' dangerouslySetInnerHTML={{ __html: el!.myfxgraph }}>
                    </div>
                    
                  </div>  
                  {/* end::Chart */} 
                  {/* begin::Row */}
                  <div className='row h-25'>
                    {/* begin::Col */}
                    <div className='col'>
                      <div className='fs-7 text-muted fw-bold'>{el!.run_period}</div>
                      <br/>
                    </div>

                  </div>
                  {/* end::Row */}
                  {/* begin::Row */}
                  <div className='row w-100 '>
                  <br/>
                  <div className="col align-items-center text-center">
                      <a href={el!.myfxbook_link} target="_blank" title="Click to see portfolio tracking on myfxbook.com" className='btn btn-light-primary '>
                        <span className="text-white">my</span><span className='font-italic text-warning'>fx</span><span className="text-white">book</span>
                      </a>
                    </div>
                    <div className="col align-items-center text-center">
                      <a href={el!.portfolio_link} target="_blank" title="Click to start investment"  className='btn btn-light-primary '>
                        <span className="text-white">Start Copy</span>
                      </a>
                    </div>
                  </div>
                  <div className="mb-2 d-flex flex-center p-6" key={Math.ceil(Math.random() * 10000)}>
                    
                      <label className="form-check-label" key={Math.ceil(Math.random() * 10000)}>Weight&nbsp;&nbsp;:&nbsp;&nbsp;</label>
                      <br/>
                      <select className="form-select bg-light-info w-100px" value={el!.weight} aria-label="% Weight" id = {"weight_"+el!.id} onChange={e=>handleSelect(e, el!.name)}  key = {Math.random()*1000}>
                          <option value="0">0</option>
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="15">15</option>
                          <option value="20">20</option> 
                          <option value="25">25</option> 
                          <option value="30">30</option>
                          <option value="35">35</option>
                          <option value="40">40</option> 
                          <option value="45">45</option> 
                          <option value="50">50</option>
                          <option value="55">55</option>
                          <option value="60">60</option>
                          <option value="65">65</option>
                          <option value="70">70</option>
                          <option value="75">75</option>
                          <option value="80">80</option>
                          <option value="85">85</option>
                          <option value="90">90</option>
                          <option value="95">95</option>
                          <option value="100">100</option>
                      </select>
                      
                  </div>
                  {/* end::Row */}
                </div>
                {/* end::Stats */}
  
                
              </div>
              {/* end::Body */}
              

              </div>
            </div>

            ) : (
              <></>
                ) 
            )}
            
          </div>
          {/* end::Content */}

        {/* begin::Content */}
        <div className='row mb-2' key={Math.ceil(Math.random() * 10000)} >
          <div className='d-flex flex-center flex-column flex-column-fluid p-1' key={Math.ceil(Math.random() * 10000)}>
            <div className="mb-2" key={Math.ceil(Math.random() * 10000)}>
              <input
                  type="number"
                  className="form-control"
                  placeholder="($) Initial investment"
                  id = "initial_investment"
                  onBlur={handleInvestmentOnChange}
                  defaultValue={initInvestment}
                  min = "0"
                  // onBlurCapture={e=>renderPieChart(e)}
                />
                
            </div>
            
          </div>
        </div>
        { showPieChart ? (
        <div className='row align-items-center justify-content-center' key={Math.ceil(Math.random() * 10000)}>
          <div className='col text-center' key={Math.ceil(Math.random() * 10000)} >
              
              <div ref={pieChartRef} key={Math.floor(Math.random() * 1000)} className='mixed-widget-12-chart card-rounded-bottom'></div>    

          </div>
          <div className='col text-center p-5' key={Math.ceil(Math.random() * 10000)}>
            <div className="table-responsive" key={Math.ceil(Math.random() * 10000)} >
              <table className="table table-hover table-rounded border table-row-bordered gy-1 gs-1 " key={Math.ceil(Math.random() * 10000)}>
                <thead>
                    <tr  key={Math.ceil(Math.random() * 10000)} className="fw-bold fs-6 border-bottom-2 border-gray-100 text-gray-900" style={{backgroundColor:"#2577cf"}}>
                        <th></th>
                        <th>Name</th>
                        <th>Allocate</th>
                        
                    </tr>
                </thead>
                <tbody>
                { pieChartSeriesObj.map( (el, index) => el !=  undefined? (
                    <tr key={Math.ceil(Math.random() * 10000)}>
                        <td className='text-start' style={{backgroundColor:pieChartColors[index]}}></td>
                        <td className='text-start fs-7' style={ (index%2) == 1? ({backgroundColor:"#383636"}):({}) }>{pieChartLabelsObj[index]}</td>
                        <td className='text-end' style={ (index%2) == 1? ({backgroundColor:"#383636"}):({}) }>
                          <div className='me-2'>
                            {/* begin::Title */}
                            <div>
                              <div className={'text-dark fw-bolder fw-bolder text-hover-primary mb-1 fs-6 text-success'}>
                                {pieChartWeightArr[index]}%
                              </div>
                              <div className='fs-8 text-gray-800 fw-bold'>{pieChartSeriesObj[index].toFixed(2).toLocaleString()}$</div>
                            </div>
                            {/* end::Title */}
                          </div>
                        </td>
                    </tr>
                ):(<></>))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
        ):(<></>)}
        <div className='row p-5' key={Math.ceil(Math.random() * 10000)} >
          <div className='col text-end' key={Math.ceil(Math.random() * 10000)}>

             
            <a href="#" className="btn btn-secondary " id="resetWeight" onClick={el => resetWeight(el)} key={Math.ceil(Math.random() * 10000)}>Reset Weight</a>
           
          </div>
          <div className='col' key={Math.ceil(Math.random() * 10000)}>

           
            <a href="#" className="btn btn-primary " id="optimizePortfolio" onClick={event => optimizePortfolio(event, portfolios)} key={Math.ceil(Math.random() * 10000)}>Optimize Portfolio</a>


          </div>
        </div>
        {/* end::Content */}
        
        
        { /* begin: optimize result */ }
        <div className = "row mb-2" >
            {progressing == 1 ? (
                <div className="card-xl-stretch mb-xl-12 text-center" key={Math.ceil(Math.random() * 10000)}  id = "optimizeLoading">
                    <div className="spinner-border" style={{width: "6rem",height: "6rem"}} role="status" key={Math.floor(Math.random() * 10000)}>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div> 
                ):(
                  progressing == 2 ? (
                <>
                  
                  <div key={Math.floor(Math.random() * 10000)} style={{width: "100%"}} id = "advanceResult" dangerouslySetInnerHTML={{ __html: report }}>
                  </div>

                </>
                ):(<></>)
              )}
        </div>
        { /* end: optimize result */ }
        {/* begin::Footer */}
        {progressing == 2 ? (
          <div className='d-flex flex-center flex-column-auto p-10'>
            <div className='text-start text-break text-gray-500'>
              Remark: The results of this report are only a simulation based on investor allocation. Investors must understand that past performance cannot be used to predict or guarantee future returns. Each person's performance and investment ratio will vary according to different investment ratios and periods.
            </div>
          </div>
        ):(<></>)}
        {/* end::Footer */}
        {/* begin::Footer */}
        <div className='d-flex flex-center flex-column-auto p-10'>
          <div className='d-flex align-items-center fw-bold fs-6'>
            <a href='#' className='text-muted text-hover-primary px-2'>
              About : DeepOcean
            </a>

            <a href='#' className='text-muted text-hover-primary px-2'>
              Line : @deepocean
            </a>

          </div>
        </div>
        {/* end::Footer */}
      </div>
    )}
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
      type: 'donut',
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
        // return chartLabels[opts["seriesIndex"]]+": "+chartSeries[opts["seriesIndex"]].toFixed(2).toLocaleString()+"$"

        return val.toLocaleString() + "%"
      },
    },
    fill: {
      type: 'gradient',
      colors: ['#c94f0e', '#e6d62e', '#65e62e', '#0accc2', '#cc0abf'],
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: true,
        offsetX: 0,
        offsetY: 0,
        customScale: 0.9,
        dataLabels: {
            offset: 0,
            minAngleToShowLabel: 0
        },
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true
            }
          }
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
            show: true
          },
          value: {
            offsetY: -200,
            fontSize: '22px'
          }
        }
      }
    },
    grid: {
      padding: {
        top: -5
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