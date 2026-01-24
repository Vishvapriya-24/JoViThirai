import {useState,useEffect} from 'react'
import axios from 'axios';
import { Navigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

function ProtectedRoute({children}){
    const [authChecked,setAuthChecked] = useState(false);
    const [isAuthenticated,setIsAuthenticated] = useState(false);

    useEffect(()=>{
        const checkAuth = async()=>{
            try{
                const res = await axios.get(`${API}/check-auth`,{
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