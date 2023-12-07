import React, {useState, useEffect} from 'react'
import {INotifications, notifications} from '../SettingsModel'
import {db} from '../../../../../../firebase'
import {collection, Timestamp, query, setDoc, doc, getDocs, where, collectionGroup} from 'firebase/firestore'
import {useAuth0} from "@auth0/auth0-react";
import MasterConfix from '../../../../../../setup/MasterConfix';
import axios from "axios"

const Notifications: React.FC = () => {
  const {user} = useAuth0();
  const userId = user!.sub!.replaceAll("|","")
  const [data, setData] = useState<INotifications>(notifications)
  const [saveStatus, setSaveStatus] = useState(0)

  const [notis, setNotis] = useState([] as any[])
  const [lineToken, setLineToken] = useState("")

  const updateData = (fieldsToUpdate: Partial<INotifications>) => {
    const updatedData = {...data, ...fieldsToUpdate}
    setData(updatedData)
  }

  const [loading, setLoading] = useState(false)

  const getNotification = async() => {
    let notiList = [] as any[]
    const rootColRef = query(collectionGroup(db, 'notifications'), where("user_id", "==", userId ))

    const data = await getDocs(rootColRef).then( async(docSnapshot) => {
    const result = await Promise.all(docSnapshot.docs.map( async(docObj:any) => {
        notiList.push({id: docObj.id, data: docObj.data()} )
        setLineToken( docObj.data().line_token )
        return docObj 
    })) 
    })
    return notiList
  }

  const click = async() => {
    setSaveStatus(1)
    setLoading(true)
      await setDoc(doc(db, `users/${userId}/notifications`, lineToken ),  {
        user_id: userId,
        noti_type: "Line",
        line_token: lineToken,
        status: "Active",
        cd: Timestamp.now()
      }).then( async()=>{
        await sendNoti(lineToken)
        setSaveStatus(3)
      })
      setTimeout(() => {
        setLoading(false)
        setSaveStatus(0)
      }, 3000)
  }

  const sendNoti = async(token:any) => {
       
    await fetch( MasterConfix.LINE_NOTI_URL+"/"+token ,{ 
        method: "GET" ,
        
    }).then( async response => { 
      // console.log("Fetch response:::", response)
    })

  }

  useEffect( ()=>{
    
    const prepareData = async()=>{
      setNotis(await getNotification())
    }
    
    prepareData()

    return ()=>{
      setNotis([])
    }

  },[])
  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_notifications'
        aria-expanded='true'
        aria-controls='kt_account_notifications'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Notifications</h3>
        </div>
      </div>

      <div id='kt_account_notifications' className='collapse show'>
          { saveStatus === 3 ? (
            <div className="alert alert-success" role="alert">
              Save notification successfully
            </div>
          ):(<></>)}
          <div className='card-body border-top px-9 pt-3 pb-4'>
            <div className='table-responsive'>
              <table className='table table-row-dashed border-gray-300 align-middle gy-6'>
                <tbody className='fs-6 fw-bold'>
                  <tr>
                    <td className='min-w-50px fs-4 fw-bolder'>
                      Line Token<br/><br/> 
                      <input
                          className="form-control"
                          type='text'
                          value={lineToken}
                          placeholder="Line Token"
                          readOnly={false}
                          onChange={(event) =>  setLineToken(event.target.value) }
                        /> 
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='button' onClick={click} className='btn btn-primary'>
              {!loading && 'Save Changes'}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        
      </div>
    </div>
  )
}

export {Notifications}
