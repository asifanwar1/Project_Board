import React, {useState, useLayoutEffect, useEffect} from 'react'
import '../stylesheets/displayProjects.css'
import { Row, Col, Container, Card, CardGroup, ProgressBar, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';

const ProjectNotification = ({projectData}) => {

    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const handleShow = () => {setFullscreen(true); setShow(true);}
    const handleHideModal = () =>{setShow(false);}
    const [smShow, setSmShow] = useState(false);
    const [projectNotifications, setProjectNotifications] = useState([]);



    const getNotifications = async () =>{
        if(projectData){
            let selectedProjectId = projectData._id;
            try {
                const response = await fetch('/getProjectNotifications', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({selectedProjectId}),
                })
    
                const data = await response.json();
                setProjectNotifications(data);
            } catch (error) {
                console.log(error)
            }
        }
    }
  

    useEffect(()=>{
        getNotifications();
    },[])


    const deleteAllNotifications = async () =>{
        if(projectData){
            let selectedProjectId = projectData._id;
            try {
                const response = await fetch('/deleteProjectNotifications', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({selectedProjectId}),
                })
    
                const data = await response.json();

                if(response.status === 201 && data){
                    setSmShow(false);
                    setShow(false);
                }
               
            } catch (error) {
                console.log(error)
            }
        }

    }


    return (
        <>
            <ListGroup.Item className='selectedListItem' onClick={handleShow}>
                <i className='fa fa-bell chat-icon'></i>         
                <br></br>
                Project Notifications
            </ListGroup.Item>
            
            <Modal show={show} fullscreen={fullscreen} onHide={handleHideModal} backdrop="static" keyboard={false} >
                <Modal.Header closeButton className='modalHeader'>
                    {projectData ?
                        <Modal.Title>{projectData.projectTitle}</Modal.Title>
                    :
                        <Modal.Title>Selected Project</Modal.Title>
                    } 
                </Modal.Header>
                <Modal.Body className='modalBodyStatic'>
                {projectNotifications ?
                    <Container>
                        <Row className="justify-content-md-center">
                            {projectNotifications.map((element, index)=>
                                <Col sm lg="4" key={index}>
                                    <Toast className='toastMain'>
                                        <Toast.Header className='toastHeader' closeButton={false}>
                                            <img src={element.memberImage} className="rounded me-2 notificationImage" alt="" />
                                            <strong className="me-auto">{element.memberName}</strong>
                                            <small>{element.notificationDate.substring(0,10)}</small>
                                        </Toast.Header>
                                        <Toast.Body>
                                            "Phase Number {element.phaseNum} : {element.phaseTitle}" has been completed.
                                        </Toast.Body>
                                    </Toast>
                                </Col>
                            )}
                        </Row>
                    </Container>
                :
                    <Container></Container>
                }
                </Modal.Body>
                <Modal.Footer className='modalFooter'>
                    <Button className='saveBtn' onClick={() => setSmShow(true)}>Delete All Notification</Button>
                </Modal.Footer>
            </Modal>




            {/* Delete All Notifications Modal  */}


        <Modal size="sm" show={smShow} onHide={() => setSmShow(false)} aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header closeButton className='modalHeader'>
                {projectData ?
                    <Modal.Title id="example-modal-sizes-title-sm">{projectData.projectTitle}</Modal.Title>
                  :
                    <Modal.Title id="example-modal-sizes-title-sm">Selected Project</Modal.Title>
                }  
            </Modal.Header>
            <Modal.Body className='modalBodyStatic'>
                {projectNotifications.length > 0 ?
                    <p>Click on <b>Proceed</b> button will permanently delete all notifications for this project.</p>
                :
                    <p>No new notifications.</p>
                }
            </Modal.Body>
            <Modal.Footer className='modalFooter'>
                {projectNotifications.length > 0 ?
                    <Button className='saveBtn' onClick={deleteAllNotifications}>Proceed</Button>
                :
                    <Button className='saveBtn' onClick={() => setSmShow(false)}>Ok</Button>
                }
                
            </Modal.Footer>
        </Modal>
    
    </>
  )
}

export default ProjectNotification