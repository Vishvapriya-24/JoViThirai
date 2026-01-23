import {useState,useEffect} from 'react'
import axios from 'axios';
import { Navigate } from "react-router-dom";


function ProtectedRoute({children}){
    const [authChecked,setAuthChecked] = useState(false);
    const [isAuthenticated,setIsAuthenticated] = useState(false);

    useEffect(()=>{
        const checkAuth = async()=>{
            try{
                const res = await axios.get('http://localhost:8000/check-auth',{
                    withCredentials:true,
                });
                if(res.data.loggedIn){
                    setIsAuthenticated(true);
                }   
            }
            catch(err){
                setIsAuthenticated(false);
            }
            finally{
                setAuthChecked(true);
            }
        };
        checkAuth();
    },[]);

    if (!authChecked) return <p>Loading...</p>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    
    return children;
}

export default ProtectedRoute;