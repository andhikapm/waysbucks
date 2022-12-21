import React from "react";
import { Card, CardGroup, Stack } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { useQuery } from 'react-query';
import { API } from '../config/api';
import ListTransUser from "./listtransuser";

export default function TransUser() {
    let { data: userTrans } = useQuery("mytransactionCache", async () => {
        const response = await API.get('/mytransaction')
        //console.log("berhasil ambil detail", response.data.data)
        return response.data.data
    })

    return (
        <>
            <Card className="border-0 p-2" style={{}}>
                <CardGroup>
                    <Stack>
                        <CardHeader className="bg-white border-0">
                            <Card.Title>
                                <h3 style={{ color: '#BD0707', fontWeight: 'bold' }}>My Transaction</h3>
                            </Card.Title>
                        </CardHeader>
                        {userTrans?.map((trans, index) => <ListTransUser key={index} id={trans.id} status ={trans.status} total={trans.totalprice}  order={trans.order}/>)}
                    </Stack>
                </CardGroup>
            </Card>
        </>
    )
}