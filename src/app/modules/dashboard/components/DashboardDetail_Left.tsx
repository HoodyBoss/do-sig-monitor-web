/* eslint-disable jsx-a11y/anchor-is-valid */
import React  from 'react'
import { useHistory } from "react-router-dom";

type Props = {
  className?: string
  image?: string
  title?: string
}

const DashboardDetail_Left: React.FC<Props> = ({className, image, title}) => {
  
  let history = useHistory();
  const redirectTo=()=>{
    history.push("/setup/exchange_setup");
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
          {title}
        </a>

        <p
          className='text-dark-75 fw-bold fs-5 m-0'
        >
          <h2>Manage your API Keys</h2>
        </p>
        <span style={{color: "#858585"}}>Connect your exchange account useing trade authorized API keys or manage on
              already established connection
          </span>
        
      </div>
      <div className='card-body' style={{
          backgroundPosition: 'left bottom',
        }}>
         <a href="#" className="btn btn-sm btn-primary" onClick={event=>redirectTo()} >API Keys</a>
      </div>
      {/* end::Body */}
    </div>
    
    </>
  )
}

export {DashboardDetail_Left}
