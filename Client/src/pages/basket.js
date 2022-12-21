import { useState, useContext, useEffect} from 'react';
import { useNavigate} from "react-router-dom"
import { totalTrans, dataCart} from '../components/globalvar';
import { Alert, Button, Card, CardGroup, CardImg, Col, Container, Form, FormControl, NavLink, Row, Stack } from "react-bootstrap";
import { useQuery, useMutation } from 'react-query';
import { API } from '../config/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CardHeader from "react-bootstrap/esm/CardHeader";
import { faTrash} from '@fortawesome/free-solid-svg-icons'
import rupiahFormat from 'rupiah-format';

function BasketData(props) {
  const modBootProps = Object.assign({}, props);
  delete modBootProps.terDelete;
  let str = props.tanda.toString();
  let listCache = str + "Cache"
  let strArr = modBootProps.topping.toString();
  let targetCache = "taget" + strArr + "Cache"
  let nameTopp = "-"

  let { data: product } = useQuery(listCache, async () => {
    const response = await API.get('/product/' + props.tanda)
    //console.log("berhasil ambil detail", response.data.data)
    return response.data.data
  })

  let { data: targetTopp } = useQuery(targetCache, async () => {
    const response = await API.post('/targettopping', {id: modBootProps.topping})
    //console.log("berhasil ambil detail", response.data.data)
    return response.data.data
  })

  targetTopp?.map((nameT) => {
    if(nameTopp !== "-"){
      nameTopp = nameTopp + ", " + nameT.title
    }else{
      nameTopp = nameT.title
    }
  })
                                      
  const poof = () => {
    props.terDelete(modBootProps.id)
  }

  //console.log(strArr)
  return (
      <>
          <Card className="border-0">
            <Stack direction="horizontal">
                <CardImg src={product?.image} className="thumbnail" style={{ width: '70px', height: '70px' }} />
                <Card.Body>
                    <Card.Title style={{ fontWeight: 'bold', marginBottom: '20px', fontSize: '12pt' }}>{product?.title} </Card.Title>
                    <Card.Subtitle style={{ fontWeight: '400', fontSize: '10pt' }}><b style={{ color: '#974A4A' }}>Toping: </b>{nameTopp}</Card.Subtitle>
                </Card.Body>
                <Card.Footer className="bg-white text-end" style={{ border: 'none' }}>
                    <p>{rupiahFormat.convert(modBootProps.price)}</p>
                    <NavLink  onClick={poof}><FontAwesomeIcon icon={faTrash} /></NavLink>
                </Card.Footer>
            </Stack>
          </Card>
      </>
  );
}


export default function Basket() {
  const navigate = useNavigate();
  const [cart, setCart] = useContext(dataCart);
  const [transaction, setTransaction] = useState(null)
  //const [order, setOrder] = useState(null)
  const [total, setTotal] = useContext(totalTrans)

  useEffect(() => {
    setTransaction({
      totalprice : total,
      order : cart
    })
  }, [])

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;
  
    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
  
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const deleto = (checking) =>{
    //console.log(cart[checking].price)
    setCart(cart.filter(cartF => cartF !== cart[checking]))
    setTotal(total - cart[checking].price)
  }

  const HandleOnSubmit = useMutation( async(e) => {

    try {
      e.preventDefault()

      const response = await API.post('/transaction', transaction)

      setCart([])
      setTotal(0)

      const token = response.data.data.token;

      console.log("response post transaction", response)
      console.log("ini tokennya", token)

      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate(`/profile`)
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate(`/profile`)
        },
        onError: function (result) {
          /* You may add your own implementation here */
          console.log(result);
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert("you closed the popup without finishing the payment");
        },
      });

      //navigate(`/`)

    } catch (err) {
     
      console.log(err)

    }
    
  })
  
  useEffect(() => {

    setTransaction({
      totalprice : total,
      order : cart
    })
    //console.log (transaction)

  }, [cart])
  //console.log (transaction)

    return (

      <Container>
        <Form onSubmit={(e) => HandleOnSubmit.mutate(e)}>
          <Card className="border-0">
              <CardGroup>
                  <Card.Body style={{ color: '#BD0707' }}>
                      <Row >
                          <Card.Title className="mb-4">My Cart</Card.Title>
                          <Col sm={7}>
                              <Card className="border-0">
                                  <CardHeader className="bg-white" style={{ borderColor: '#974A4A' }}>
                                      <Card.Subtitle style={{ fontWeight: '400' }}>Review Your Order</Card.Subtitle>
                                  </CardHeader>
                                  <Card.Body>
                                      <Stack gap={2}>
                                        {cart.map((shopping, index) => <BasketData key={index} id={index} tanda={shopping.product} price={shopping.price} topping={shopping.toppings} terDelete={deleto}/>)}
                                      </Stack>
                                  </Card.Body>
                                  <Card.Footer className="bg-white" style={{ borderColor: '#974A4A', paddingLeft: '0' }}>
                                      <Stack direction="horizontal" gap={5}>
                                          <Card className="border-0 col-7">
                                              <CardHeader className="bg-white" style={{ borderColor: '#974A4A' }}>
                                                  <Col>  </Col>
                                              </CardHeader>
                                              <Card.Footer className="bg-white" style={{ borderColor: '#974A4A' }}>
                                                  <Row>
                                                      <Col>
                                                          <Card.Title>Total</Card.Title>
                                                      </Col>
                                                      <Col className="text-end">
                                                          <Card.Title>{rupiahFormat.convert(total)}</Card.Title>
                                                      </Col>
                                                  </Row>
                                              </Card.Footer>
                                          </Card>
                                      </Stack>
                                  </Card.Footer>
                              </Card>
                          </Col>
                          <Col sm={4} className="ms-5">
                              <Card className="border-0">
                                  <Card.Body>
                                          <Stack gap={3}>
                                              <FormControl placeholder="Name" style={{ border: '1px solid #BD0707', background: '#E0C8C840', lineHeight: '2.5' }} />
                                              <FormControl placeholder="Email" style={{ border: '1px solid #BD0707', background: '#E0C8C840', lineHeight: '2.5' }} />
                                              <FormControl placeholder="Phone" style={{ border: '1px solid #BD0707', background: '#E0C8C840', lineHeight: '2.5' }} />
                                              <FormControl placeholder="Pos Code" style={{ border: '1px solid #BD0707', background: '#E0C8C840', lineHeight: '2.5' }} />
                                              <Form.Control
                                                  as="textarea"
                                                  placeholder="Leave a comment here"
                                                  style={{ height: '150px', border: '1px solid #BD0707', background: '#E0C8C840', lineHeight: '2.5' }}
                                              />
                                              <Button className="btn btn-danger" type="submit" >Pay</Button>
                                          </Stack>
                                  </Card.Body>
                              </Card>
                          </Col>
                      </Row>
                  </Card.Body>
              </CardGroup>
          </Card>
        </Form>
      </Container>

      );
}

