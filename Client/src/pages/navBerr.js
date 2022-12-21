import { useState, useContext, useEffect } from 'react';
import { Button, Container, Nav, Navbar, Dropdown, Image, Badge } from 'react-bootstrap';

import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate} from 'react-router-dom'
import Login from './login'
import Register from './register'
import logoways from '../assets/logoways.png'
import basket from '../assets/shoppingbasket.png'
import { dataCart, loginStatus, totalTrans, UserContext, roleStatus } from '../components/globalvar';
import fotouser from '../assets/fotuser.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons'

export default function NavBerr() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showStatus, setStatus] = useContext(loginStatus);
    const navigate = useNavigate();

    const [role, setRole] = useContext(roleStatus);

    const [cart, setCart] = useContext(dataCart);
    const [total, setTotal] = useContext(totalTrans)
    const [popCart, setPopCart] = useState(false)
    const [state, dispatch] = useContext(UserContext);

    const Popout = () => {
        //localStorage.setItem("statuslogin", JSON.stringify(false));
        dispatch({
          type: 'LOGOUT',
        })
        setCart([])
        setTotal(0)
        setStatus(false);
        navigate(`/`)
    }
    
    const changeStatus = (change) =>{
      //localStorage.setItem("statuslogin", JSON.stringify(change));
      setStatus(change);
      navigate(`/`)
    }

    const changeHome = (change) =>{
      setShowRegister(change);

      navigate(`/`)
    }

    useEffect(() => {
      if(cart.length > 0){
        setPopCart(true)
      } else{
        setPopCart(false)
      }
    }, [cart]);

    return (
        <Navbar collapseOnSelect expand="lg" variant="light">
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">

            <Link to="/">
              <img src={logoways} width="70" alt=""></img>
            </Link>

            </Nav>
            <Nav>
            
            {state.isLogin ? 
              (
                <>
                {role !== "admin"?
                  (
                    <>
                        {popCart ? 
                        (
                          <Nav.Link onClick={() => {navigate('/basket')}} style={{ position: 'relative' }}>
                              <Badge pill bg="danger" className="rounded-circle d-flex justify-content-center align-items-center" style={{ width: '20px', height: '20px', fontSize: '10pt', position: 'absolute', right: 0, }}>{cart.length}</Badge>
                              <Image src={basket} width='30px' />
                          </Nav.Link>
                        )
                        : 
                        (
                          <Nav.Link style={{ position: 'relative' }}>
                             <Image src={basket} width='30px' />
                          </Nav.Link>
                        )
                        } 
                      <Nav.Link>
                      </Nav.Link>
                      <Dropdown>
                        <Dropdown.Toggle className="border-0 bg-white" id="dropdown-basic">
                          <Image src={fotouser} width='50' className="rounded-circle" style={{ border: '2px solid #BD0707' }} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => {navigate('/profile')}} style={{ fontWeight: '500' }} ><FontAwesomeIcon icon={faUser} style={{ marginRight: '15px', color: '#BD0707' }} />Profile</Dropdown.Item>
                          <Dropdown.Item onClick={Popout} style={{ fontWeight: '500' }}><FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '15px', color: '#BD0707' }} />Logout</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </>
                  )
                  :
                  (
                    <Dropdown>
                      <Dropdown.Toggle className="border-0 bg-white" id="dropdown-basic">
                        <Image src={fotouser} width='50' className="rounded-circle" style={{ border: '2px solid #BD0707' }} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item onClick={() => {navigate('/income')}} style={{ fontWeight: '500' }}>Income</Dropdown.Item>
                          <Dropdown.Item onClick={() => {navigate('/addproduct')}} style={{ fontWeight: '500' }}>Add Product</Dropdown.Item>
                          <Dropdown.Item onClick={() => {navigate('/addtopping')}} style={{ fontWeight: '500' }}>Add Topping</Dropdown.Item>
                          <Dropdown.Item onClick={Popout} style={{ fontWeight: '500' }}><FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '15px', color: '#BD0707' }} />Logout</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )
                }
                </>
              )
               : 
              (
                <div>
                  <Button className="px-5 me-4" size="sm" variant="outline-danger" onClick={() => setShowLogin(true)}>
                    Login
                  </Button>
            
                  <Button className="px-5 " size="sm" variant="danger" onClick={() => setShowRegister(true)}>
                    Register
                  </Button>
                  <Login
                    show={showLogin}
                    statuscheck = {changeStatus}
                    onLogin = {setShowLogin}
                    onRegis={setShowRegister}
                    onHide={() => setShowLogin(false)}
                  />
            
                  <Register
                    show={showRegister}
                    backHome = {changeHome}
                    onLogin = {setShowLogin}
                    onRegis={setShowRegister}
                    onHide={() => setShowRegister(false)}
                  />
                </div>
              )
            }

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
        
      );
}