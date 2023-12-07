/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useHistory } from "react-router-dom";

type Props = {
  className?: string
}


const DashboardDetail_Right: React.FC<Props> = ({className}) => {

  let history = useHistory();
  const redirectTo=()=>{
    history.push("/strategy/my-strategy");
  }

  return (
    <>
    <div key=""
      className={`card bgi-no-repeat ${className}`}
      style={{
        backgroundPosition: 'right top',
        backgroundSize: '30% auto',
        backgroundImage: `url('/media/svg/shapes/' + image)`,
      }}
    >
      {/* begin::Body */}
      <div className='card-body'>
        <a href='#' className='card-title fw-bolder text-muted text-hover-primary fs-4'>
          
        </a>

        <p
          className='text-dark-75 fw-bold fs-5 m-0'
        >
          <h2>Browse Strategies</h2>
          
        </p>
          <span style={{color: "#858585"}}>View out list of trading bots by deep ocean team. No nonsense reporting
          </span>
        
      </div>
      <div className='card-body' style={{
          backgroundPosition: 'left bottom',
        }}>
         <a href="#" className="btn btn-sm btn-primary" onClick={event=>redirectTo()}>View Strategies</a>
      </div>
      {/* end::Body */}
    </div>
    
    </>
  )
}

export {DashboardDetail_Right}
