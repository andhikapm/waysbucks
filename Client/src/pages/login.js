import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { API } from '../config/api';
import { UserContext, roleStatus } from '../components/globalvar';

export default function Login(props) {
  const modBootProps = Object.assign({}, props);
  delete modBootProps.statuscheck;
  delete modBootProps.onLogin;
  delete modBootProps.onRegis;
  
  const [state, dispatch] = useContext(UserContext);

  const [role, setRole] = useContext(roleStatus);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const HandleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()

      const response = await API.post('/login', form)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.data
      })

      //console.log("data berhasil ditambahkan", response.data.data)

      setRole(response.data.data.role)
    
      props.statuscheck(true)
      props.onLogin(false)
    
    } catch (err) {
      /*
      const alert = (<Alert variant='danger' className='py-1'>
        Failed
      </Alert>)
      setMessage(alert)*/
      console.log(err)
    
    }
  })

    return (    
        <Modal
            {...modBootProps}
            size="md"
            centered
          >
            <Modal.Body>
            <Modal.Title className="mb-3">Login</Modal.Title>
            <Form onSubmit={(e) => HandleOnSubmit.mutate(e)}>
              <Form.Control
                name="email"
                type="text"
                placeholder="Email"
                className="mb-3"
                onChange={handleChange}
              />
              
              <Form.Control
                name="password"
                type="password"
                placeholder="Password"
                className="mb-3"
                onChange={handleChange}
              />
              
              <div className="d-grid mb-2">
                  <Button type="submit" variant='danger'>
                      Login
                  </Button>
              </div>

              <Form.Label>Don't have an account ? Klik <b variant="link" onClick={() => props.onRegis(true) & props.onLogin(false)} style={{ cursor: 'pointer' }}>Here</b></Form.Label>
            
            </Form>
            </Modal.Body>
          </Modal>

      );
}