import React  from 'react'
import {useAuth0} from "@auth0/auth0-react";

import {
  DashboardDetail_Right
} from './DashboardDetail_Right'
import {
  DashboardDetail_Left
} from './DashboardDetail_Left'
import {
  DashboardDetail_Top
} from './DashboardDetail_Top'

import { DashboardDetail_SignalDetail } from './DashboardDetail_SignalDetail';


const DashboardDetail : React.FC = () => {
 
  const { user } = useAuth0();

     
  return (
    <>
      {/* begin::Row */}
        <div className='row g-5 g-xxl-12'>
          <div className='col-xl-12'>
            <DashboardDetail_Top
              className='card-xl-stretch mb-5 mb-xl-12'
              image='abstract-1.svg'
              title={""}
        
            />
          </div>
          
        </div>
        {/* <div className='row g-5 g-xxl-12'>
          <div className='col-xl-6'>
            <DashboardDetail_Left
              className='card-xl-stretch mb-5 mb-xl-12'
              image='abstract-1.svg'
              title={""}
        
            />
          </div>
          <div className='col-xl-6'>
            <DashboardDetail_Right className='card-xl-stretch mb-xl-8' ></DashboardDetail_Right>
          </div>
        </div> */}
      {/* end::Row */}
      
      {/* begin::Row */}
        <div className='row g-5 g-xl-12'>
          <div className='col-xl-12'>
            <DashboardDetail_SignalDetail className='card-xl-stretch mb-xl-8' ></DashboardDetail_SignalDetail>
          </div>
        
        </div>
      {/* end::Row */}
    </>
  )
}


export {DashboardDetail}