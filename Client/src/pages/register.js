import { useState, useEffect} from "react";
import { useMutation } from 'react-query';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { API } from "../config/api";

export default function Register(props) {
  const modBootProps = Object.assign({}, props);
  delete modBootProps.onLogin;
  delete modBootProps.onRegis;
  delete modBootProps.backHome;

  const [user, setUser] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const HandleOnSubmit = useMutation( async(e) => {
    try {
    e.preventDefault()
  
    const response = await API.post('/register', form)

    console.log("data berhasil ditambahkan", response.data.data)
    setUser(true)

    } catch (err) {
      /*
      const alert = (<Alert variant='danger' className='py-1'>
        Failed
      </Alert>)
      setMessage(alert)*/
      console.log(err)

    }
  })

  useEffect(() => {
    if (user){
      
      //console.log(datUser)

      //localStorage.setItem("user", JSON.stringify(datUser));
      props.backHome(false)
    }
  }, [user]);

    return (
      
        <Modal
          {...modBootProps}
          size="md"
          centered
        >
          <Modal.Body>
          <Modal.Title className="mb-3">Register</Modal.Title>
          <Form onSubmit={(e) => HandleOnSubmit.mutate(e)}>
            <Form.Control
              name="email"
              type="email"
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

            <Form.Control
              name="name"
              type="text"
              placeholder="Full Name"
              className="mb-3"
              onChange={handleChange}
            />

            <div className="d-grid mb-2">
                <Button type="submit" variant='danger'>
                    Register
                </Button>
            </div>

            <Form.Label>Already have an account ? Klik <b variant="link" onClick={() => props.onRegis(false) & props.onLogin(true)} style={{ cursor: 'pointer' }}>Here</b></Form.Label>

          </Form>
          </Modal.Body>
        </Modal>
      );
}
