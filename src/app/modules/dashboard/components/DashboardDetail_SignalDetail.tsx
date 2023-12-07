/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {useAuth0} from "@auth0/auth0-react";
import {useHistory} from 'react-router-dom'
import {collection, query, getDocs, where } from 'firebase/firestore'
import MasterConfix from '../../../../setup/MasterConfix';

type Props = {
  className: string
}

const DashboardDetail_SignalDetail: React.FC<Props> = ({className}) => {

  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const { user } = useAuth0();
  const userId = user!.sub!.replaceAll('|','')
  const [data, setData] = useState([] as any[])
  const [loading, setLoading] = useState(true)

  const [signalDetails, setSignalDetails] = useState([] as any[])

  //global variable here ------------------------------------------
  const apiUrl = MasterConfix.API_BASE_ENDPOINT_V2
  const customHeaders = {
   "Content-Type": "application/json",
   "x-api-key": MasterConfix.APP_API_BASE_KEY,
 }  
 
 useEffect( () => {
   const fetchData = async () => {

     const fetchData = await fetch(apiUrl+'/signal/detail', {method: 'GET', headers: customHeaders})
                     .then( response => response.json())
                     .then( async(data) => { 

                       setSignalDetails(data)
                     })
   }
   fetchData()
 }, [isAuthenticated])

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bolder text-dark'>Signal Detail</h3>
        <div className='card-toolbar'>
          {/* begin::Menu */}
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
          </button>
          
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className="table-responsive" key={Math.ceil(Math.random() * 10000)} >
        <table className="table table-hover table-rounded border table-row-bordered gy-1 gs-1 table-row-dashed table-striped" key={Math.ceil(Math.random() * 10000)}>
          <thead>
              <tr  key={Math.ceil(Math.random() * 10000)} className="fw-bold fs-7 border-bottom-2 border-gray-100 text-gray-900" style={{backgroundColor:"#2577cf"}}>
                  <th>CD</th>
                  <th>Cor.Id</th>
                  <th>Port Name</th>
                  <th>Bot</th>
                  <th>Symbol</th>
                  <th>Magic</th>
                  <th>Signal</th>
                  <th>Size</th>
                  <th>Order Status</th>
                  <th>P/L</th>
              </tr>
          </thead>
          <tbody>
          { signalDetails.map( (el, index) => el !=  undefined? (
              <tr key={Math.ceil(Math.random() * 10000)}>
                  <td className='text-start'>{el!.cd}</td>
                  <td className='text-start' >{el!.correlation_id}</td>
                  <td className='text-start' >{el!.portfolio_id}</td>
                  <td className='text-start' >{el!.signal.bot}</td>
                  <td className='text-start' >{el!.trade_open?.symbol}</td>
                  <td className='text-start' >{el!.trade_open?.label}</td>
                  <td className='text-start' >{el!.signal.signal == "2"?"BUY":"SELL"}</td>
                  <td className='text-start' >
                    {Intl.NumberFormat("en-US", {  maximumFractionDigits: 2   }  ).format(parseFloat(el!.trade_open?.lot))}
                  </td>
                  <td className='text-start' style={{color:el!.trade_closed?.close_time!=null? "orange": el!.trade_open?.lot != null?"green":"white"}}>
                      {el!.trade_closed?.close_time!=null? "Closed": el!.trade_open?.lot != null?"Opening":"No Order"}
                  </td>
                  <td className='text-start' style={{color:el!.trade_closed?.profit>0? "green": el!.trade_closed?.profit<0?"red":"white"}}>
                    {Intl.NumberFormat("en-US", {  maximumFractionDigits: 2   }  ).format(parseFloat(el!.trade_closed?.profit))}
                  </td>
              </tr>
          ):(<></>))}
          </tbody>
        </table>
      </div>
      {/* end::Body */}
    </div>
  )
}

export {DashboardDetail_SignalDetail}
