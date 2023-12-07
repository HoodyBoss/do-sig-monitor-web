/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect}  from 'react'

type Props = {
  className: string,
  strategyId: string
}


const SubscribeStrategyDetail_Risk: React.FC<Props> = ({className, strategyId}) => {

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
        เลือกระดับความเสี่ยง
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          <input type = "number" className="form-control" min="1000" placeholder='เงินลงทุน'/>
          <br/>
          <br/>
          <input type = "radio" className="form-check-input" />
          <label className="form-check-label" >
            &nbsp;&nbsp;&nbsp;&nbsp;Low Risk
          </label>
          <br/>
          <br/>
          <input type = "radio" className="form-check-input" />
          <label className="form-check-label" >
            &nbsp;&nbsp;&nbsp;&nbsp;Middle Risk
          </label>
          <br/>
          <br/>
          <input type = "radio" className="form-check-input" />
          <label className="form-check-label" >
            &nbsp;&nbsp;&nbsp;&nbsp;High Risk
          </label>
        </div>
        {/* end::Table container */}
      </div>
    </div>
    <hr/>
    </>
  )
}

export {SubscribeStrategyDetail_Risk}
