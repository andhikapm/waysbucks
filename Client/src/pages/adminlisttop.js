import React from 'react';
import { Card, Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom"
import { useQuery } from 'react-query';
import { API } from '../config/api';
import Button from 'react-bootstrap/Button';

function ToppData(props) {
    const navigate = useNavigate();
    return (
        <>
            
            <div className='col-3 p-3'>
                <Card 
                    className='rounded-4 border-0 overflow-hidden shadow-sm' 
                    style={{ width: '100%', backgroundColor : '#f6dada', cursor: 'pointer' }}>

                    <Card.Img variant="top" src={props.image} />
                    <Card.Body className='pb-0'>
                            <h1 className='fs-6 text-danger fw-bolder'>{props.title}</h1>
                            <p className='align-self-start text-danger'>Rp. {props.price}</p>
                            <div className="mb-3">
                                <Button className="px-4 ms-2 me-4" size="sm" >edit</Button>
                                <Button className="px-3 " size="sm" >delete</Button>
                            </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}
 
export default function AdminListTop() {

    let { data: dataTopping } = useQuery("toppsCache", async () => {
        const response = await API.get('/toppings')
        return response.data.data
      })

    return (
        <>
            <Container className='row justify-content-between m-auto pb-5' style={{ padding : "0 76px" }}>
            <h1 className='text-danger fw-bolder'>List Topping</h1>
                {dataTopping?.map((topps, index) => <ToppData key={index} id={topps.id} title ={topps.title} image={topps.image} price={topps.price}/>)}
            </Container>
        </>
      );
}