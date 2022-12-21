import React, { useState,useContext,useEffect } from 'react';

import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom'

import LandingPage from './pages/landing';
import DetailProduct from './pages/product';
import NavBerr from './pages/navBerr';
import Basket from './pages/basket';
import PrivateRoute from './components/privateroute';
import Addproduct from './pages/addproduct';
import Addtopping from './pages/Addtopping';
import AdminLand from './pages/adminland';
import AdminListTop from './pages/adminlisttop';
import ProfilUser from './pages/profile';
import IncomeTrans from './pages/incometrans';
import { dataCart, loginStatus, totalTrans, UserContext, roleStatus } from './components/globalvar';
import { API, setAuthToken} from './config/api';

function App() {
  //let navigate = useNavigate();
  const [StatusCart, setStatusCart] = useState([]);
  const [StatusOn, setStatusOn] = useState(false);
  const [StatusTotal, setStatusTotal] = useState(0);

  const [state, dispatch] = useContext(UserContext);
  const [rolling, setRolling] = useState(null)

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      //console.log("ini data state", state)
      setStatusOn(true)
      //console.log(rolling)
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get('/checkauth');
      //console.log(response)
      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }

      //console.log("response check auth", response)

      let payload = response.data.data;
      payload.token = localStorage.token;
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
      //console.log(payload)
      setRolling(payload.role)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <dataCart.Provider value={[StatusCart,setStatusCart]}>
      <loginStatus.Provider value={[StatusOn, setStatusOn]}>
        <roleStatus.Provider value={[rolling, setRolling]}>
          <totalTrans.Provider value={[StatusTotal, setStatusTotal]}>
            <Router>

            <NavBerr></NavBerr>
          
            <Routes>
              <Route exact path='/' element={<LandingPage/>} ></Route>
              <Route exact path='/' element={<PrivateRoute/>}>
                <Route exact path='/basket' element={<Basket/>}></Route>
                <Route exact path='/:product/:id' element={<DetailProduct/>}></Route>
                <Route exact path='/profile' element={<ProfilUser/>} ></Route>
                <Route exact path='/addproduct' element={<Addproduct/>} ></Route>
                <Route exact path='/addtopping' element={<Addtopping/>} ></Route>
                <Route exact path='/income' element={<IncomeTrans/>} ></Route>
              </Route>
              <Route exact path='/adminland' element={<AdminLand/>} ></Route>
              <Route exact path='/admintopping' element={<AdminListTop/>} ></Route>
            </Routes>
            
            </Router>
          </totalTrans.Provider>
        </roleStatus.Provider>
      </loginStatus.Provider>
    </dataCart.Provider>
  );
}

export default App;