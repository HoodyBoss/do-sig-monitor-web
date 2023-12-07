/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect}  from 'react'
type Props = {
  className: string,
  strategyId: string
}


const SubscribeStrategyDetail_Config: React.FC<Props> = ({className, strategyId}) => {

  const [strategys, setStrategys] = useState([] as any[])
  const url = 'https://asia-southeast1-deepocean-a246c.cloudfunctions.net/webApi/api/v1/strategy/';

  useEffect( () => {
    fetch( url+strategyId,
    { mode: "cors",
      headers: {
      "Content-Type": "application/json"
    }})
      .then(response => response.json() )
      .then(data => setStrategys(data))
  }, [])

  return (
    <>
      <div className={`card ${className}`} >
      {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          Configuration
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='card-body py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            <select className="form-control">
              <option value = ""></option>
              <option value = "BINANCE">BINANCE</option>
              <option value = "FTX">FTX</option>
              <option value = "BITKUB">BITKUB</option>
            </select>
            <br/>
            <input type = "text" className="form-control" placeholder='API Key'/>
            <br/>
            <input type = "text" className="form-control" placeholder='API Secret'/>
            <br/>
            <input type = "text" className="form-control" placeholder='Line API Key'/>
            <br/>
          </div>
          {/* end::Table container */}
        </div>
      </div>
      <hr/>
    </>
  )
}

export {SubscribeStrategyDetail_Config}
