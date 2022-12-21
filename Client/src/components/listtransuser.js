import React from "react";
import { Alert, Card, CardImg, Col, Row, Stack } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import rupiahFormat from "rupiah-format";
import logoways from "../assets/logoways.png"

function OrderData(props) {
    let nameTopp = "-"

    props.topping.map((nameT) => {
        if(nameTopp !== "-"){
          nameTopp = nameTopp + ", " + nameT.title
        }else{
          nameTopp = nameT.title
        }
    })

    return (
        <>
            <Card style={{ background: '#F6DADA', border: '0' }}>
                <Stack direction="horizontal">
                    <CardImg variant="left" src={props.product.image} style={{ width: '100px' }} />
                    <Card.Body>
                        <Card.Title style={{ fontSize: '14pt', fontWeight: 'Bold', color: '#BD0707' }}>{props.product.title}</Card.Title>
                        <Card.Text style={{ fontSize: '9pt', color: '#BD0707', margin: '0px', marginTop: '20px' }}><b style={{ color: '#974A4A' }}>Toping</b>: {nameTopp}</Card.Text>
                        <Card.Subtitle style={{ color: '#974A4A', fontSize: '11pt', margin: '0px', lineHeight: '2' }}>Price : {rupiahFormat.convert(props.price)}</Card.Subtitle>
                    </Card.Body>
                </Stack>
            </Card>
        </>
    );
}
  
  
export default function ListTransUser(props) {
    return (
        <>
            <Card.Body className="mb-3" style={{ background: '#F6DADA', borderRadius: '5px' }}>
            <Row>
                <Col sm={9} gap={3} >
                    {props.order.map((data, index) => <OrderData key={index} id={data.id} price={data.orderprice} product={data.product} topping={data.topping}/>)}
                </Col>
                <Col sm={3}>
                    <Stack>
                        <Card style={{ background: 'none', border: 0 }}>
                            <CardHeader className="d-flex justify-content-center" style={{ background: 'none', border: '0' }}>
                                <CardImg src={logoways} style={{ width: '90%' }} />
                            </CardHeader>
                            <Card.Body style={{ padding: 0, marginTop: '20px' }}>
                                <CardImg src="https://www.pngmart.com/files/22/QR-Code-Transparent-Isolated-Background.png" />
                                <Alert key="info" variant="info" style={{ fontSize: '8pt', marginTop: '15px', textAlign: 'center', padding: 5 }}>{props.status}</Alert>
                                <Card.Title style={{ fontSize: '9pt', textAlign: 'center', fontWeight: '900', color: '#974A4A' }}>Sub Total : {rupiahFormat.convert(props.total)}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Stack>
                </Col>
            </Row>
            </Card.Body>
        </>
    )
 
 }
