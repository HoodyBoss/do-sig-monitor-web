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
}

export function LandingPageV3() {

  ReactGA.initialize(MasterConfix.GA_MEASUREMENT_ID);
  //ReactGA.pageview(window.location.pathname + window.location.search);
  ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "DeepWealth portfolio optimization" });

  // ReactGA.event({
  //   category: 'Link',
  //   action: 'Click',
  //   label: 'Optimize Portfolio'
  // });

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
      portfolios.map((item) => {
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

              riskChartSeries.push( data["max_dd"] )
              let lineChart = null;
              await Promise.all(portfolios.map(item => {
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
              document.querySelector("#optimizeResultChart")!.scrollIntoView();
            });
            
          })
      } //end if sum weight == 0

  }

  const handleSelect = (e:any) => {
    setChartChange(false)
    setShowWarning(false)
    setReport("")

    let sumWeight = 0;
    portfolios.map((item) => {
      sumWeight += parseInt(item.weight.toString())
    })
    sumWeight += parseInt(e.target.value)

    if (sumWeight > 100) {
      setWarningMessage("Please select summary weight less than 100%.")
      divWeightWarningModalbeRef!.current!.click()
      setShowWarning(true)
    } else {

      setPortfolios(
        portfolios.map((item) => {
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
    // document.body.classList.add('bg-black')
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
      {/* className = "container container-fluid" */}
      
      <div className="row m-5" >
        <div className="row">
          <div className='col'>
            <p className="align-items-center justify-content-center">
              {/* <img
                                src="/media/logos/LOGO_DEEPOCEAN-02_125x125.png" width="50%"
                                className='svg-icon-1 svg-icon-info '
                              /> */}
              <h1 className="display-3 text-center ">Deep Wealth</h1>
              
            </p>
            <p className="align-items-center justify-content-center"><h3 className="text-center ">Build your wealth, Make your life.</h3></p>
          </div>
          <div className="col">
            
            <div className='w-75 align-items-center justify-content-center'>
              <p>&nbsp;</p>
              <p className="text-start">
                  <h4 className='text-break'>"Deep Wealth" typically refers to substantial and enduring forms of wealth beyond financial assets
                , encompassing knowledge, relationships, well-being, and a sense of purpose or fulfillment. It emphasizes holistic prosperity and 
                abundance in various aspects of life beyond material wealth.
                  </h4>
              </p>
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

        <div ref={divWeightWarningModalbeRef} id = "openConfirmDeleteModal" data-bs-toggle="modal" data-bs-target={"#kt_modal_confirm_delete"} />

        <div className="modal fade" tabIndex={-1} id="kt_modal_confirm_delete" data-bs-backdrop="static" data-bs-keyboard="false">

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
            <div className='col-sm-3'>
            <div className={`card m-2 justify-content-center`} key={Math.floor(Math.random() * 10000)} style={{width: "18rem;"}}>
              {/* begin::Beader */}
              <div className='card-header border-0 py-5 h-25 ' >
                <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bolder fs-3 mb-1'>{el!.name}</span>

                  <span className='text-muted fw-bold fs-7'>Name</span>
                </h3>
                <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bolder fs-3 mb-1'>
                    <img
                                src={el!.logo} width="100%"
                                className='svg-icon-1 svg-icon-info '
                              />
                  </span>
  
                </h3>
                {/* <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bolder fs-3 mb-1'>{el!.asset_class}
                  </span>
  
                  <span className='text-muted fw-bold fs-7'>Asset</span>
                </h3>
                 */}
                
              </div>
              {/* end::Header */}

              {/* begin::Body */}
              <div className='card-body p-0 d-flex flex-column' >
                {/* begin::Stats */}
                <div className='card-px flex-grow-1'>
                  {/* begin::Row */}
                  <div className='row h-25'>
                    {/* begin::Col */}
                    <div className='col-sm'>
                      <div className='d-flex align-items-center me-2'>
                        {/* begin::Symbol */}
                        {/* <div className='symbol symbol-50px me-3'>
                          <div className='symbol-label bg-light-info'>
                            <KTSVG
                              path='/media/icons/duotune/finance/fin008.svg'
                              className='svg-icon-1 svg-icon-info'
                            />
                          </div>
                        </div> */}
                        {/* end::Symbol */}

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

                    <div className='col-sm'>
                      <div className='d-flex align-items-center me-2'>
                        {/* begin::Symbol */}
                        {/* <div className='symbol symbol-50px me-3'>
                          <div className='symbol-label bg-light-info'>
                            <KTSVG
                              path='/media/icons/duotune/medicine/med001.svg'
                              className='svg-icon-1 svg-icon-info'
                            />
                          </div>
                        </div> */}
                        {/* end::Symbol */}

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
                    <div className='col-sm'>
                      <div className='d-flex align-items-center me-2'>
                        {/* begin::Symbol */}
                        {/* <div className='symbol symbol-50px me-3'>
                          <div className='symbol-label bg-light-info'>
                            <KTSVG
                              path='/media/icons/duotune/ecommerce/ecm003.svg'
                              className='svg-icon-1 svg-icon-info'
                            />
                          </div>
                        </div> */}
                        {/* end::Symbol */}

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

                    <div className='col-sm'>
                      <div className='d-flex align-items-center me-2'>
                        {/* begin::Symbol */}
                        {/* <div className='symbol symbol-50px me-3'>
                          <div className='symbol-label bg-light-info'>
                            <KTSVG
                              path='/media/icons/duotune/art/art007.svg'
                              className='svg-icon-1 svg-icon-info'
                            />
                          </div>
                        </div> */}
                        {/* end::Symbol */}

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
                  <div className='row h-25'>
                    {/* begin::Col */}
                    <div className='col'>
                      <div className='fs-7 text-muted fw-bold'>Portfolio Description</div>
                      <div className='d-flex align-items-center w-100'>
                        {el!.description}
                      </div>
                      
                    </div>

                  </div>
                  {/* end::Row */}
                  {/* begin::Chart */} 
                  <div className="row h-25" key={Math.floor(Math.random() * 10000)}>
                    <div className='col-sm'>
                      { el!.id == 1 ? (
                        <PortfolioChart chartColor={"green"} chartHeight={"100px"} chartDatas={chart1Data} chartAxisY={chart1Month} chartChange={chartChange}/>  
                        
                      ):( el!.id == 2 ? (
                        <PortfolioChart chartColor={"green"} chartHeight={"100px"} chartDatas={chart2Data}  chartAxisY={chart2Month} chartChange={chartChange}/>  
                        ) : ( el!.id == 4 ? (
                          <PortfolioChart chartColor={"green"} chartHeight={"100px"} chartDatas={chart3Data}  chartAxisY={chart3Month} chartChange={chartChange}/>  
                        ): ( el!.id == 5 ? (
                          <PortfolioChart chartColor={"green"} chartHeight={"100px"} chartDatas={chart4Data}  chartAxisY={chart4Month} chartChange={chartChange}/>  
                        ):(<></>))
                      ))}
                    </div>
                  </div>  
                  {/* end::Chart */} 
                  {/* begin::Row */}
                  <div className='row h-25'>
                    {/* begin::Col */}
                    <div className='col'>
                      
                      <div className='fs-7 text-muted fw-bold'>{el!.run_period}</div>
                      
                    </div>

                  </div>
                  {/* end::Row */}
                  {/* begin::Row */}
                  <div className='row h-25 w-100 '>
                    {/* begin::Col */}
                    <div className="col justify-content-start ">
                      <a href={el!.myfxbook_link} target="_blank">
                          <img src="/media/logos/myfxbook.png" className="w-75 p-1"/>
                      </a>
                    </div>
                    <div className="col d-flex align-items-center justify-content-center ">
                      <a className="text-warning" href={el!.portfolio_link} target="_blank">
                          Start Invest
                      </a>
                    </div>
                  </div>
                  <div className="mb-2 d-flex flex-center p-2" key={Math.ceil(Math.random() * 10000)}>
                    
                      <label className="form-check-label" key={Math.ceil(Math.random() * 10000)}>Weight&nbsp;&nbsp;:&nbsp;&nbsp;</label>
                      <br/>
                      <select className="form-select bg-light-info w-100px" value={el!.weight} aria-label="% Weight" id = {"weight_"+el!.id} onChange={e=>handleSelect(e)}  key = {Math.random()*1000}>
                          <option value="0">0</option>
                          <option value="10">10</option>
                          <option value="20">20</option> 
                          <option value="30">30</option>
                          <option value="40">40</option> 
                          <option value="50">50</option>
                          <option value="60">60</option>
                          <option value="70">70</option>
                          <option value="80">80</option>
                          <option value="90">90</option>
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
          <div className='d-flex flex-center flex-column flex-column-fluid p-3' key={Math.ceil(Math.random() * 10000)}>
            <div className="mb-10" key={Math.ceil(Math.random() * 10000)}>
              <input
                  type="number"
                  className="form-control"
                  placeholder="($) Initial investment"
                  id = "initial_investment"
                  onBlur={handleInvestmentOnChange}
                  defaultValue={initInvestment}
                  min = "0"
                />
                
            </div>
            <a href="#" className="btn btn-primary " id="optimize" onClick={event => optimizePortfolio(event, portfolios)}>Optimize Portfolio</a>
          </div>
        </div>
        {/* end::Content */}
        
        
        { /* begin: optimize result */ }
        <div className = "container-fluid" >
            {progressing == 1 ? (
                <div className="card-xl-stretch mb-xl-12 text-center" key={Math.ceil(Math.random() * 10000)}>
                    <div className="spinner-border" style={{width: "6rem",height: "6rem"}} role="status" key={Math.floor(Math.random() * 10000)}>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div> 
                ):(
                  progressing == 2 ? (
                <>
                  <div id = "optimizeResultChart" style={{width: "18rem;"}}>
                    <div className={`card m-2`} key={Math.floor(Math.random() * 10000)}>
                      {/* begin::Beader */}
                      <div className='card-header border-0 py-5'>
                        <h3 className='card-title align-items-start flex-column'>
                        <span className='card-label fw-bolder fs-3 mb-1'>Portfolio Optimization Result</span>

                        {/* <span className='text-muted fw-bold fs-7'>Name</span> */}
                        </h3>
                        
                        
                      </div>
                      {/* end::Header */}

                      {/* begin::Body */}
                      <div className='card-body p-0 d-flex flex-column'>
                        {/* begin::Stats */}
                        <div className='card-px pt-5 pb-10 flex-grow-1'>
                        {/* begin::Row */}
                        <div className='row pb-3'>
                          
                          <div className='col' >
                            <div className='d-flex flex-center p-5 pb-lg-5'>
                              <div className={`card `} key={Math.floor(Math.random() * 10000)}>
                                  {/* begin::Beader */}
                                  <div className='card-header border-0 py-5'>
                                    <h3 className='card-title align-items-start flex-column'>
                                      <span className='card-label fw-bolder fs-3 mb-1'>Return</span>

                                      {/* <span className='text-muted fw-bold fs-7'>Name</span> */}
                                    </h3>
                                    
                                      
                                  </div>
                                  {/* end::Header */}

                                  {/* begin::Body */}
                                  <div className='card-body p-0 d-flex flex-column'>
                                    {/* begin::Stats */}
                                    <div className='card-px pt-5 pb-5 flex-grow-1'>
                                      {/* begin::Row */}
                                      <div className='row g-0 mt-5 mb-5'>
                                        {/* begin::Col */}
                                        <div className='col'>
                                          <div className='d-flex align-items-center me-2'>
                                          {/* begin::Symbol */}
                                            {/* <div className='symbol symbol-50px me-3'>
                                              <div className='symbol-label bg-light-info'>
                                              <KTSVG
                                                path='/media/icons/duotune/finance/fin008.svg'
                                                className='svg-icon-1 svg-icon-info'
                                              />
                                              </div>
                                            </div> */}
                                          {/* end::Symbol */}

                                          {/* begin::Title */}
                                            <div>
                                              <div className={'fs-4 text-dark fw-bolder fw-bolder text-hover-primary mb-1 fs-6 text-success'}>
                                                {parseFloat(pctReturn).toFixed(2).toLocaleString()}%
                                              </div>
                                              <div className='fs-7 text-muted fw-bold'>Return</div>
                                            </div>
                                          {/* end::Title */}
                                          </div>
                                        </div>

                                        <div className='col'>
                                          <div className='d-flex align-items-center me-2'>
                                            {/* begin::Symbol */}
                                            {/* <div className='symbol symbol-50px me-3'>
                                              <div className='symbol-label bg-light-info'>
                                                <KTSVG
                                                  path='/media/icons/duotune/medicine/med001.svg'
                                                  className='svg-icon-1 svg-icon-info'
                                                />
                                              </div>
                                            </div> */}
                                          {/* end::Symbol */}

                                          {/* begin::Title */}
                                          <div>
                                            <div className={'fs-4 text-dark fw-bolder fw-bolder text-hover-primary mb-1 fs-6 text-success'}>
                                                ${parseFloat(pnlReturn).toFixed(2).toLocaleString()}
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
                                </div>
                              </div>


                              <div className={`card `} key={Math.floor(Math.random() * 10000)}>
                                  {/* begin::Beader */}
                                  <div className='card-header border-0 py-5'>
                                    <h3 className='card-title align-items-start flex-column'>
                                      <span className='card-label fw-bolder fs-3 mb-1'>Money allocate by portfolio</span>

                                      {/* <span className='text-muted fw-bold fs-7'>Name</span> */}
                                    </h3>
                                    
                                  </div>
                                  {/* end::Header */}

                                  {/* begin::Body */}
                                  <div className='card-body p-0 d-flex flex-column'>
                                    {/* begin::Stats */}
                                    <div className='card-px pt-5 pb-5 flex-grow-1'>
                                      {/* begin::Row */}
                                      <div className='row g-0 mt-5 mb-5'>
                                        
                                        <div className='col'>
                                          <div className='d-flex align-items-center me-2'>

                                            {/* begin::Title */}
                                            <div>
                                              <div className='d-flex flex-center p-10 pb-lg-20'>
                                    
                                                <div className='card-body p-0 d-flex flex-column'>
                                                  <div ref={pieChartRef} key={Math.floor(Math.random() * 1000)} className='mixed-widget-12-chart card-rounded-bottom'></div>    
                                                </div>
                            
                                              </div>
                                            </div>
                                          {/* end::Title */}
                                          </div>
                                        </div>
                
                                      </div>
                                  {/* end::Row */}
                                  </div>
                                </div>
                              </div>
                              
                              <div className={`card w-25 m-5 h-75`} key={Math.floor(Math.random() * 10000)}>
                                  {/* begin::Beader */}
                                  <div className='card-header border-0 py-5'>
                                    <h3 className='card-title align-items-start flex-column'>
                                      <span className='card-label fw-bolder fs-3 mb-1'>Risk</span>

                                    
                                    </h3>
                    
                                      
                                  </div>
                                  {/* end::Header */}

                                  {/* begin::Body */}
                                  <div className='card-body p-0 d-flex flex-column'>
                                    {/* begin::Stats */}
                                    <div className='card-px pt-5 pb-5 flex-grow-1'>
                                      {/* begin::Row */}
                                      <div className='row g-0 mt-5 mb-5'>
                                        {/* begin::Col */}
                                        <div className='col'>
                                          <div className='d-flex align-items-center me-2'>
                                              <div className='card-body p-0 d-flex flex-column'>
                                                <div ref={riskChartRef} key={Math.floor(Math.random() * 1000)} className='mixed-widget-12-chart card-rounded-bottom'></div>    
                                              </div>
                                          </div>
                                        </div>
                                    </div>
                                  {/* end::Row */}
                                  </div>
                                </div>
                              </div>
                            </div>


                        </div>
                        {/* end::Col */}
                        </div>

                        {/* end::Row */}
                        <div className='row h-75'>
                          <div className="d-flex flex-center row p-5 flex-column flex-column-fluid" key={Math.ceil(Math.random() * 10000)}>
                            <div className='card-body p-0 d-flex flex-column'>
                              <div ref={lineChartRef} key={Math.floor(Math.random() * 1000)} className='mixed-widget-12-chart card-rounded-bottom'></div>    
                            </div>
                          </div>
                        </div>

                      </div>
                      </div>
                    </div>
                  </div>
                  
                  <div id = "advanceBut" className="d-flex flex-center flex-column-fluid flex-row-fluid p-5" key={Math.ceil(Math.random() * 10000)}>
                    <a href="#" className="btn btn-primary" id="showAdvance" onClick={event => showAdvanceEvent()}>Show Advance Report (Quantstat)</a>
                  </div>
                  {showAdvance ? (
                    <div className='d-flex flex-center flex-column-fluid flex-row-fluid p-5' key={Math.floor(Math.random() * 10000)} style={{width: "100%"}} id = "advanceResult" dangerouslySetInnerHTML={{ __html: report }}>
                    </div>
                  ):(<></>)}
                </>
                ):(<></>)
              )}
        </div>
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