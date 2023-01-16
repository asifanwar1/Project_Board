import React, {useState, useEffect} from 'react'
import "../stylesheets/projects.css"
import {Container, Ratio, Button, Row, Col, Badge, FloatingLabel, Popover, Dropdown, ButtonGroup, DropdownButton, OverlayTrigger, FormControl, Modal, ListGroup, InputGroup } from 'react-bootstrap';


const WatchVideo = () => {

    const [lgShow, setLgShow] = useState(false);


  return (
    <>
        <i className='signUpTxt' onClick={()=>setLgShow(true)}>Click here</i>

        <Modal size="lg" show={lgShow} onHide={() => setLgShow(false)} aria-labelledby="example-modal-sizes-title-lg">
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="example-modal-sizes-title-lg">Project Board Video</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBody'>
                <Container className='videoCont'>
                    <Row className="justify-content-md-center">
                        <Col lg={9}>
                            <Ratio aspectRatio="16x9">
                                <iframe 
                                    width="560" 
                                    height="315" 
                                    src="https://www.youtube.com/embed/a5UKTs4ePe4" 
                                    title="YouTube video player" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    allowfullscreen>
                                </iframe>
                            </Ratio>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    
    </>
  )
}

export default WatchVideo