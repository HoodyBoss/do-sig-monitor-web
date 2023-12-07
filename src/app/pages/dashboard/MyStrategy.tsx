import React, {FC, useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import {
     MyStrategyTable
  } from '../../../_metronic/partials/widgets'

                  
export function MyStrategy() {
    const {action} = useParams<{ action?: string}>();
    
    useEffect(()=>{
        
    },[action])

    return  (
        <div>
            <div className='row g-5 g-xl-8'>
                <MyStrategyTable className='card-xl-stretch mb-xl-8' actions={action!} />
            </div>
        </div>
    )
}