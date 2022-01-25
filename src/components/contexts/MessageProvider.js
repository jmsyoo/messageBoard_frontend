import React, { useState, useEffect, useContext, useMemo } from 'react'
import axios from 'axios'

const MessageContext = React.createContext()

export function useMessage(){
    return useContext(MessageContext)
}


export function MessageProvider({URL, userId, setUserId ,children}){

    const [nameList, setNameList] = useState([])

    const getUesrId = useMemo(() => { // Check when a user id is changed. To reduce number of rendering.
        return userId.split('%%')
    },[userId])

    // Get all name list from db
    const fetchNameList = async () => {
        try{
            const response = await axios.get(`${URL.production}user`).then((result) => {
                // console.log(result)
                return setNameList(result.data)
            })
        }catch(error){
            console.error(error)
        }
    }
    
    const handleUserLogout = () => {
        setUserId(null)
    }
    

    useEffect(() => {
        if(getUesrId){
            fetchNameList()
        }
    },[getUesrId])

    const value ={
        nameList,
        myName: getUesrId[0],
        handleUserLogout
    }

    return(
        <MessageContext.Provider  value={value}>
            {children}
        </MessageContext.Provider>
    )
}