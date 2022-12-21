import { useState, useEffect} from "react";
import { useMutation } from 'react-query';
import {useNavigate} from "react-router-dom"
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap"
import { API } from "../config/api";

const style = {
    textTitle: {
      fontWeight: "600",
      fontSize: "32px",
      lineHeight: "49px",
  
      color: "#BD0707",
    },
  
    textRed: {
      color: "#BD0707",
    },
  
    bgColor: {
      backgroundColor: "#BD0707",
    },
  
    textCenter: {
      textAlign: "center",
    },
  
    link: {
      fontWeight: "bold",
      textDecoration: "none",
      color: "black",
    },
  
    ImgProduct: {
      position: "relative",
      width: "350px",
    },
  
    // Image Product 1
    ImgLogo: {
      position: "absolute",
      width: "130px",
      height: "auto",
      top: "35%",
      left: "77%",
    },
}

export default function Addtopping() {
    const navigate = useNavigate();
    const [back, setBack] = useState(false);
    const [form, setForm] = useState({
        title: '',
        price: '',
        image: '',
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
            e.target.type === 'file' ? e.target.files : e.target.value,
        });
    /*
        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }*/
    };

    const HandleOnSubmit = useMutation( async(e) => {
        try {
            e.preventDefault()

            const formData = new FormData();
            formData.set('title', form.title);
            formData.set('price', form.price);
            formData.set('image', form.image[0], form.image[0].name);
    
            const response = await API.post('/topping', formData)
            console.log(response.data.data)
            setBack(true)
        } catch (err) {
    
        console.log(err)

        }
    })

    useEffect(() => {
        if (back){
            navigate(`/`)
        }
    }, [back])

    return (
        <Container className="my-5">
        <Card className="mt-5" style={{ border: "white" }}>
            <Row>
            <Col sm={8}>
                <Card.Body className="m-auto" style={{ width: "80%" }}>
                <Card.Title className="mb-5" style={style.textTitle}>
                    Topping
                </Card.Title>
                <Form
                    onSubmit={(e) => HandleOnSubmit.mutate(e)}
                    className="m-auto mt-3 d-grid gap-2 w-100"
                >
                    <Form.Group className="mb-3 " controlId="title">
                    <Form.Control
                        onChange={handleChange}
                        name="title"
                        style={{
                        border: "2px solid #BD0707",
                        backgroundColor: "#E0C8C840",
                        }}
                        type="text"
                        placeholder="Name Topping"
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="price">
                    <Form.Control
                        onChange={handleChange}
                        name="price"
                        style={{ border: "2px solid #BD0707" }}
                        type="text"
                        placeholder="Price"
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="image">
                    <Form.Control
                        onChange={handleChange}
                        name="image"
                        style={{ border: "2px solid #BD0707" }}
                        type="file"
                        placeholder="Photo Topping"
                    />
                    </Form.Group>
                    <Button
                    variant="outline-light"
                    style={style.bgColor}
                    type="submit"
                    >
                    Add Topping
                    </Button>
                </Form>
                </Card.Body>
            </Col>
            </Row>
        </Card>
    </Container>
    );
}
