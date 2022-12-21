import React, {useContext} from "react";
import { Card, CardGroup, Col, Container, Row, Stack } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import userprof from "../assets/userprof.png"
import TransUser from "../components/transuser";
import { UserContext} from '../components/globalvar';

export default function ProfilUser() {
    const [state, dispatch] = useContext(UserContext);
    
    return (
        <>
            <Container >
                <Row>
                    <Col>
                        <Card className="border-0 p-2" style={{}}>
                            <CardGroup>
                                <Stack>
                                    <CardHeader className="bg-white border-0">
                                        <Card.Title >
                                            <h3 style={{ color: '#BD0707', fontWeight: 'bold' }}>My Profil</h3>
                                        </Card.Title>
                                    </CardHeader>
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col sm={4} className="" >
                                                <Card.Img src={userprof} style={{ width: '150px', }} />
                                            </Col>
                                            <Col sm={8} >
                                                <Card.Text>
                                                    <h6 style={{ color: '#613D2B' }}>Full Name</h6>
                                                    <p>{state.user.name}</p>
                                                </Card.Text>
                                                <Card.Text>
                                                    <h6 style={{ color: '#613D2B' }}>Email</h6>
                                                    <p>{state.user.email}</p>
                                                </Card.Text>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Stack>
                            </CardGroup>
                        </Card>
                    </Col>
                    <Col>
                        <TransUser/>
                    </Col>
                </Row>
            </Container>

        </>
    )
}