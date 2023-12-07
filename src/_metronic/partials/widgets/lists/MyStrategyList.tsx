/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {Dropdown1} from '../../content/dropdown/Dropdown1'
import {useAuth0} from "@auth0/auth0-react";

type Props = {
  className: string
}

const MyStrategyList: React.FC<Props> = ({className}) => {

  //get user's profile from Auth0 token
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [data, setData] = useState([] as any[])

  const [test, setTest] = useState([] as number[])

  useEffect( () => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => setData(data))
  }, [])

  
  return (
    <div className='card card-xl-stretch mb-xl-8'>
      {/* begin::Header */}
      <div className='card-header align-items-center border-0 mt-4'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='fw-bolder text-dark'>My Strategy</span>
          <span className='text-muted mt-1 fw-bold fs-7'>Articles and publications</span>
        </h3>
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
          <Dropdown1 />
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body pt-3'>

        { data.map( el => 
            <div className='d-flex align-items-sm-center mb-7'>
              <div className='symbol symbol-60px symbol-2by3 me-4'>
                <div
                  className='symbol-label'
                  style={{backgroundImage: `url(${toAbsoluteUrl('/media/stock/600x400/img-20.jpg')})`}}
                ></div>
              </div>
              <div className='d-flex flex-row-fluid flex-wrap align-items-center'>
                <div className='flex-grow-1 me-2'>
                  <a href='#' className='text-gray-800 fw-bolder text-hover-primary fs-6'>
                    {el.name}
                  </a>
                  <span className='text-muted fw-bold d-block pt-1'>{el.email}</span>
                </div>
                <span className='badge badge-light-success fs-8 fw-bolder my-2'>Approved</span>
                <span className='badge badge-light-success fs-8 fw-bolder my-2'>Approved</span>
                <span className='badge badge-light-success fs-8 fw-bolder my-2'>Approved</span>
                <span className='badge badge-light-success fs-8 fw-bolder my-2'>Approved</span>
              </div>
            </div>
        )}
         
      </div>
      {/* end::Body */}
    </div>
  )
}

export {MyStrategyList}
