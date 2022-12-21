import React, { useState, useEffect } from "react"
import { Container, Row, Table, Button, Image, Stack } from "react-bootstrap"
import { useQuery } from 'react-query';
import { API } from '../config/api';
import rupiahFormat from "rupiah-format";

function TransData(props) {
    const modBootProps = Object.assign({}, props);
    delete modBootProps.mengcancel;
    delete modBootProps.mengaprrove;

    const tercancel = async () => {
        props.mengcancel(modBootProps.id,'Cancelled')
    }
    
    const terapprove = async () => {
        props.mengcancel(modBootProps.id,'Approved')
    }
    return (
        <>
            <tr>
                <td>{modBootProps.tanda}</td>
                <td>{modBootProps.user.name}</td>
                <td>{rupiahFormat.convert(modBootProps.total)}</td>
                <td style={{ color: "#061E99" }}>{modBootProps.payment}</td>
                <td style={{ color: "#FF9900" }}>{modBootProps.status}</td>
                <td>
                  <Stack
                    direction="horizontal"
                    gap={2}
                    className="d-flex justify-content-center"
                  >
                    <Button variant="danger" className="w-50 py-0" onClick={tercancel}>
                      Cancel
                    </Button>
                    <Button variant="success" className="w-50 py-0" onClick={terapprove}>
                      Approve
                    </Button>
                  </Stack>
                </td>
            </tr>
        </>
    );
}

export default function IncomeTrans() {
    const [change, setChange] = useState(false)
    let { data: dataTransactions, refetch } = useQuery("transactionsCache", async () => {
        const response = await API.get('/transactions')
        //console.log("berhasil ambil detail", response.data.data)
        return response.data.data
    })

    const cancelo = async(id, status) =>{
        try {

            const response = await API.patch('/transaction/' + id, {status: status});
            //console.log(response.data)
            setChange(!change)

        } catch (error) {
        
            console.log(error);
        
        }
    }

    const approve = async(id, status) =>{
        try {

            const response = await API.patch('/transaction/' + id, {status: status});
            //console.log(response.data)
            setChange(!change)

        } catch (error) {
        
            console.log(error);
        
        }
    }

    useEffect(() => {
        refetch()
    }, [change])

    return (
        <>
            <Container className="mb-5 mt-5">
                <Row>
                <p className="fs-3 mb-4 fw-bold" style={{ color: "#bd0707" }}>
                    Income Transaction
                </p>
                </Row>
                <Row className="d-flex flex-row justify-content-center">
                <Table
                    bordered
                    hover
                    style={{
                    textAlign: "center",
                    width: "90%",
                    borderColor: "#828282",
                    }}
                >
                    <thead style={{ backgroundColor: "#E5E5E5" }}>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Payment Status</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dataTransactions?.map((trans, index) => 
                        <TransData key={index} 
                            id={trans.id} 
                            tanda={index + 1} 
                            status={trans.status} 
                            total={trans.totalprice} 
                            payment={trans.payment} 
                            mengcancel={cancelo}
                            mengaprrove={approve}
                            user={trans.user}/>)}
                    </tbody>
                </Table>
                </Row>
            </Container>
        </>
  )
}
