import React, {FC, useEffect, useRef, useState} from 'react'

const Verify2MFA = () => {
    const [result, setResult] = useState("");
    const handleOnChange = (res: string) => {
      setResult(res);
    };
  
    return ( 
      <>
        <div className="container">
        <br/>
        <div className="row">
            <div className="col-lg-5 col-md-7 mx-auto my-auto">
                <div className="card">
                    <div className="card-body px-lg-5 py-lg-5 text-center">
                        <h2 className="text-info">2FA Security</h2>
                        <p className="mb-4">Enter 6-digits code from your athenticatior app.</p>
                        <form>
                            <div className="row mb-4">
                                <div className="col-lg-2 col-md-2 col-2 ps-0 ps-md-2">
                                    <input type="text" className="form-control text-lg text-center" placeholder="_" aria-label="2fa" maxLength={1}/>
                                </div>
                                <div className="col-lg-2 col-md-2 col-2 ps-0 ps-md-2">
                                    <input type="text" className="form-control text-lg text-center" placeholder="_" aria-label="2fa" maxLength={1}/>
                                </div>
                                <div className="col-lg-2 col-md-2 col-2 ps-0 ps-md-2">
                                    <input type="text" className="form-control text-lg text-center" placeholder="_" aria-label="2fa" maxLength={1}/>
                                </div>
                                <div className="col-lg-2 col-md-2 col-2 pe-0 pe-md-2">
                                    <input type="text" className="form-control text-lg text-center" placeholder="_" aria-label="2fa" maxLength={1}/>
                                </div>
                                <div className="col-lg-2 col-md-2 col-2 pe-0 pe-md-2">
                                    <input type="text" className="form-control text-lg text-center" placeholder="_" aria-label="2fa" maxLength={1}/>
                                </div>
                                <div className="col-lg-2 col-md-2 col-2 pe-0 pe-md-2">
                                    <input type="text" className="form-control text-lg text-center" placeholder="_" aria-label="2fa" maxLength={1}/>
                                </div>
                            </div>
                            <div className="text-center">
                                <button type="button" className="btn bg-info btn-lg my-4">Continue</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
      </>
      )
  };

  export {Verify2MFA}