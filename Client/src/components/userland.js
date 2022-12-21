import React from 'react';
import { Card, Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom"
import waysmain from '../assets/waysmain.png'

import rupiahFormat from "rupiah-format";
import { useQuery } from 'react-query';
import { API } from '../config/api';

function ProductData(props) {
    const navigate = useNavigate();
    return (
        <>
            
            <div className='col-3 p-3'>
                <Card 
                    className='rounded-4 border-0 overflow-hidden shadow-sm' 
                    style={{ width: '100%', backgroundColor : '#f6dada', cursor: 'pointer' }}
                    onClick={() => {navigate(`/${props.title}/${props.id}`)}}>

                    <Card.Img variant="top" src={props.image} />
                    <Card.Body className='pb-0'>
                            <h1 className='fs-6 text-danger fw-bolder'>{props.title}</h1>
                            <p className='align-self-start text-danger'>{rupiahFormat.convert(props.price)}</p>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}
 
export default function UserLand() {

    let { data : products } = useQuery("productCaches", async () => {
        const response = await API.get('/products')
        //console.log("berhasil ambil data", response.data.data)
        return response.data.data
    })

    return (
        <>

            <Container className="position-relative" style={{ Container: { padding : "0 90px",  marginTop : "40px"}}}>
                <div className="mb-4">
                    <Image src={waysmain} width="100%"></Image>
                </div>
                <div className="position-absolute" style={{ fontSize: "1.15rem", color: "white", top: "60px", left: "160px", width: "36%" }}>
                    <h1 className="fs-1 fw-bolder mb-4">WAYSBUCKS</h1>
                    <p style={{ fontSize: "1.3rem" }}>Things are changing, but we're still here for you</p>
                    <p>We have temporarily closed our in-store cafes, but select grocery and drive-thru locations remaining open. Waysbucks Drivers is also available</p>
                    <p>Let's Order...</p>
                </div>
            </Container>

            <Container className='row m-auto pb-5' style={{ padding : "0 76px" }}>
            <h1 className='text-danger fw-bolder'>Let's Order</h1>
                {products?.map((product1, index) => <ProductData key={index} id={product1.id} title ={product1.title} image={product1.image} price={product1.price}/>)}
            </Container>
        </>
      );
}