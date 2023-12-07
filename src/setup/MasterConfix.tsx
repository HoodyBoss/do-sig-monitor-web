import dotenv from  'dotenv'

const MasterConfix = {
    "LINE_NOTI_URL": (process.env.REACT_APP_LINE_NOTI_URL as string)
    ,"LINE_NOTI_MSG": (process.env.REACT_APP_LINE_NOTI_MSG as string)
    ,"API_BASE_ENDPOINT": (process.env.REACT_APP_API_BASE_ENDPOINT_V1 as string)
    ,"API_BASE_ENDPOINT_V2": (process.env.REACT_APP_API_BASE_ENDPOINT_V2 as string)
    ,"API_SAVE_SECRET_ENDPOINT": (process.env.REACT_APP_API_SAVE_SECRET_ENDPOINT as string)
    ,"API_VALIDATE_APIKEY": (process.env.REACT_APP_API_VALIDATE_APIKEY as string)
    ,"AUTH0_CLIENT_ID": (process.env.REACT_APP_AUTH0_CLIENT_ID as string)
    ,"AUTH0_DOMAIN": (process.env.REACT_APP_AUTH0_DOMAIN as string)
    ,"API_GET_STRATEGY_DETAIL": (process.env.REACT_APP_API_GET_STRATEGY_DETAIL as string)
    ,"API_GRID_CREATE_ZONE": (process.env.REACT_APP_API_GRID_CREATE_ZONE as string)
    ,"API_GET_ACCOUNT_BALANCE": (process.env.REACT_APP_API_GET_ACCOUNT_BALANCE as string)
    ,"API_GET_STRATEGY_BY_RISK": (process.env.REACT_APP_API_GET_STRATEGY_BY_RISK as string)
    ,"API_VERIFY_AUTHY": (process.env.REACT_APP_API_API_VERIFY_AUTHY as string)
    ,"API_DELETE_SECRET_ENDPOINT": (process.env.REACT_APP_API_DELETE_SECRET_ENDPOINT as string)
    ,"SEND_NOTI_URL": (process.env.REACT_APP_SEND_NOTI_URL as string)
    ,"APP_API_BASE_KEY": (process.env.REACT_APP_API_BASE_KEY as string)
    ,"APP_BASE_API_PORTFOLIO_SIM": (process.env.REACT_APP_BASE_API_PORTFOLIO_SIM as string)
    ,"GA_MEASUREMENT_ID": (process.env.REACT_APP_GA_MEASUREMENT_ID as string)
    ,"GCP_AGIGATEWAY_KEY": (process.env.REACT_APP_GCP_AGIGATEWAY_KEY as string)
    ,"MYFXBOOK_URL": (process.env.REACT_APP_MYFXBOOK_URL as string)
    ,"MYFXBOOK_SESSION": (process.env.REACT_APP_MYFXBOOK_SESSION as string)
    
}   

export default MasterConfix