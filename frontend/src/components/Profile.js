import React, {useState, useContext, useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import '../stylesheets/profile.css'
import { Row, Col, Container, Card, CardGroup, ProgressBar, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';
import image_S1 from '../images/abstract10.png'
import { UserContext } from '../App'

const Profile = () => {

    const {state, dispatch} = useContext(UserContext); 
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = async () =>{

        try{
            const response = await fetch("/userSignOut", {
                method: "GET",
            });
            let data = await response.json();

            if(response.status === 201 && data){
                localStorage.removeItem("User")      
                navigate("/login");
            }
        } catch(error){
            console.log(error)
        }

    }

  return (
    <>
        <ListGroup.Item className='navList' onClick={()=>setShowAlert(true)}>
            <i className='fa fa-user-circle'>&nbsp;</i>         
            {' '}
            Profile
        </ListGroup.Item>

        <Modal size="sm" show={showAlert} onHide={()=>setShowAlert(false)} aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="example-modal-sizes-title-sm">Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBodyStatic'>
                {state ?
                    <Container className='profileCont'>
                        <Row className="justify-content-md-center">
                            <Col>
                                <img 
                                    src={state.image}
                                    onError={(e)=>{e.target.onError = null; e.target.src = image_S1}}
                                    className="profileImages"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <p>{state.name}</p>
                        </Row>
                        <Row>
                            <p>{state.email}</p>
                        </Row>
                    </Container>
                :
                    <Container></Container>
                }                
            </Modal.Body>
            <Modal.Footer className='modalFooter'>
                <Button className='saveBtn' onClick={handleSignOut}>SignOut</Button> 
            </Modal.Footer>
        </Modal>
    
    </>
  )
}

export default Profile