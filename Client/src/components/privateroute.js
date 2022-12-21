import { useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import Login from '../pages/login';
import Register from '../pages/register';
import LandingPage from '../pages/landing';
import { loginStatus } from '../components/globalvar';

export default function PrivateRoute() {
    const datStat = JSON.parse(localStorage.getItem("statuslogin"));
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(!datStat);
    const [showRegister, setShowRegister] = useState(false);
    const [showStatus, setStatus] = useContext(loginStatus);

    const changeStatus = (change) =>{
        //localStorage.setItem("statuslogin", JSON.stringify(change));
        setStatus(change);
  
        navigate(`/`)
    }

    const changeHome = (change) =>{
        setShowRegister(change);
  
        navigate(`/`)
    }

    return(
        showStatus ? <Outlet /> :  
        <>
                <LandingPage/>
                <Login
                    show={showLogin}
                    statuscheck = {changeStatus}
                    onLogin = {setShowLogin}
                    onRegis={setShowRegister}
                    onHide={() => setShowLogin(false) & navigate(`/`)}
                  />
            
                  <Register
                    show={showRegister}
                    backHome = {changeHome}
                    onLogin = {setShowLogin}
                    onRegis={setShowRegister}
                    onHide={() => setShowRegister(false) & navigate(`/`)}
                  />
        </>
        
    )
}