/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import { useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import MasterConfix from '../../../../setup/MasterConfix';

type Props = {
  className?: string
  image?: string
  title?: string
}

type Portfolio = {
  id: number
  portfolio_name: string
  status: string
  cd: string
}

type SignalDetail = {
  id: string
  correlation_id: string
  portfolio_id: string
  signal: any
  trade_open: any
  trade_closed: any
  cd: string
  md: string
}

const DashboardDetail_Top: React.FC<Props> = ({className, image, title}) => {
  
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [portfolios, setPortfolios] = useState([] as any[])
  


  let history = useHistory();
  const redirectTo=()=>{
    history.push("/strategy/strategy_pool");
  }

   //global variable here ------------------------------------------
   const apiUrl = MasterConfix.API_BASE_ENDPOINT_V2
   const customHeaders = {
    "Content-Type": "application/json",
    "x-api-key": MasterConfix.APP_API_BASE_KEY,
  }  
  
  useEffect( () => {
    const fetchData = async () => {

      const fetchData = await fetch(apiUrl+'/portfolios', {method: 'GET', headers: customHeaders})
                      .then( response => response.json())
                      .then( async(data) => { 
                        // console.log("POrtfolio:", data)
                        setPortfolios(data)
                      })
    }
    fetchData()
  }, [isAuthenticated])

  return (
    <>
    <div key=""
      className={`card bgi-no-repeat ${className}`}
      style={{
        backgroundPosition: 'right bottom',
        backgroundSize: '30% auto',
        // backgroundImage: `url('/media/svg/background/blockchain.svg')`,
      }}
    >
      {/* begin::Body */}
      <div className='card-body'>
        <a href='#' className='card-title fw-bolder text-muted text-hover-primary fs-4'>
          {title}
        </a>

        <p
          className='text-dark-75 fw-bold fs-5 m-0'
        >
          <h1>All Portfolios</h1>
          <div className="table-responsive" key={Math.ceil(Math.random() * 10000)} >
            <table className="table table-hover table-rounded border table-row-bordered gy-1 gs-1 table-row-dashed table-striped" key={Math.ceil(Math.random() * 10000)}>
              <thead>
                  <tr  key={Math.ceil(Math.random() * 10000)} className="fw-bold fs-7 border-bottom-2 border-gray-100 text-gray-900" style={{backgroundColor:"#2577cf"}}>
                      <th>Id</th>
                      <th>Name</th>
                      <th>FTP Connection</th>
                  </tr>
              </thead>
              <tbody>
              { portfolios.map( (el, index) => el !=  undefined? (
                  <tr key={Math.ceil(Math.random() * 10000)}>
                      <td className='text-start'>{el!.id}</td>
                      <td className='text-start' >{el!.portfolio_name}</td>
                      <td className='text-start' style={{color:el!.ftp_result?.result?"green":"red"}}>
                        <a href="#" title={el!.ftp_result?.message}>{el!.ftp_result?.result?"Yes":"No"}</a>
                      </td>
                  </tr>
              ):(<></>))}
              </tbody>
            </table>
          </div>
        </p>
        
      </div>
      
      
      {/* end::Body */}
    </div>
    
    </>
  )
}

export {DashboardDetail_Top}
