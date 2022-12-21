import { useState, useContext, useEffect} from 'react';
import Badge from 'react-bootstrap/Badge';
import { useParams, useNavigate} from "react-router-dom"
import {dataCart, totalTrans} from '../components/globalvar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import { useQuery } from 'react-query';
import { API } from '../config/api';
import rupiahFormat from "rupiah-format";

function ToppData(props) {
  const modBootProps = Object.assign({}, props);
  delete modBootProps.sumTop;
  const [marking, setMark] = useState(false)
  
  
  const checkMark = () => {

    setMark(!marking)
    props.sumTop(modBootProps.price, marking, modBootProps.id)
  }

  return (
    <div 
      className='col-3 text-center position-relative p-0 mb-2 mt-3'
      onClick={checkMark}>

      <img src={modBootProps.image} className="w-50 mb-2"/>

      {marking ? 
      (
        <Badge className= "notifCheck position-absolute p-2 border border-light rounded-circle visible" bg="success" >
           <span className="visually-hidden">New alerts</span>
        </Badge>
      )
      : 
      (
        <Badge className= "notifCheck position-absolute p-2 border border-light rounded-circle invisible" bg="success" >
          <span className="visually-hidden">New alerts</span>
        </Badge>
      )
              
      }
      <p className="fs-6 fw-semibold text-danger">{modBootProps.title}</p>
    </div> 
  );
}

export default function DetailProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  let { data: productD } = useQuery("detailCache", async () => {
    const response = await API.get('/product/' + id)
    //console.log("berhasil ambil detail", response.data.data)
    return response.data.data
  })

  let { data: dataTopping } = useQuery("toppsCache", async () => {
    const response = await API.get('/toppings')
    //console.log("berhasil ambil detail", response.data.data)
    return response.data.data
  })

  const [initialPric, setInitialPric] = useState();

  const [addCart, setAddCart]= useState(null)
  
  const [addTop,setAddTop] = useState([]);

  const [cart, setCart] = useContext(dataCart);

  const [total, setTotal] = useContext(totalTrans);
  //const userItem = JSON.parse(localStorage.getItem("userName"));

  useEffect(() => {
    setInitialPric(productD?.price)
  }, [productD?.price])

  const calcuTop = (toppGet, chekTop, adding) =>{
    
    if(chekTop === true){
      setInitialPric(initialPric - toppGet)
      setAddTop(addTop.filter(addTopF => addTopF !== adding))
      
    } else if (chekTop === false){
      setInitialPric(initialPric + toppGet)
      setAddTop(addTop => [...addTop,adding] );
    }

  }

  const HandleOnSubmit = (e) =>{
    e.preventDefault()
    let listTop = []

    if (addTop.length !== 0){
      listTop = addTop;
    } else{
      listTop = [0]
    }

    setTotal(total + initialPric)

    setAddCart({
      product : parseInt(id),
      price: initialPric,
      toppings : listTop,
    })
    
  }


  useEffect(() => {
    
    if(addCart !== null){
      setCart([
        ...cart,
        addCart,]
      )
    }
  }, [addCart])

    return (
        <Form className="row m-auto" style={{padding : "30px 90px"}} onSubmit={HandleOnSubmit}>

            <div className="mb-4 col-5 pe-5">
                <Image src={productD?.image} width="80%"/>
            </div>
            <div className="col-6" style={{ fontSize: "1.15rem" }}>
              <h3 className="fs-1 fw-bolder mb-3 text-danger">{productD?.title}</h3>
              <p className="fs-4 fw-semibold mb-5" style={{color : "#984c4c"}}>{rupiahFormat.convert(productD?.price)}</p>
              <p className="fs-2 fw-bold" style={{color : "#984c4c"}}>Toping</p>
              <div className="row">
                {dataTopping?.map((topps, index) => <ToppData key={index} id={topps.id} title ={topps.title} image={topps.image}  price={topps.price} sumTop ={calcuTop}/>)}
              </div>
              <div className='row justify-content-between mt-5 mb-3' style={{color : "#984c4c"}}>
                  <p className="col-3 fs-4 fw-bolder">Total</p>
                  <p className="col-3 fs-4 fw-bolder text-end">{rupiahFormat.convert(initialPric)}</p>
              </div>
              <Button type="submit" variant='danger' className="w-100 fw-bold">Add Cart</Button>
            </div>

        </Form>
      );
}