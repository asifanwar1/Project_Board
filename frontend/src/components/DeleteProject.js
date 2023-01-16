import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import "../stylesheets/projects.css"
import {Container, Form, Button, Row, Col, Badge, FloatingLabel, Popover, Dropdown, ButtonGroup, DropdownButton, OverlayTrigger, FormControl, Modal, ListGroup, InputGroup } from 'react-bootstrap';
// import DisplayProjects from './DisplayProjects';

const DeleteProject = ({projectData}) => {

    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [showAlert, setShowAlert] = useState(false);
    const handleAlertClose = () =>{setShowAlert(false);}
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");

    const handleDeleteProject = async (e) =>{
        let selectedId = e.target.id;
        
        try {
            const response = await fetch('/deleteProject', { 
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' 
                },
                body: JSON.stringify({selectedId}),
            })

            let data = await response.json();
            if(response.status === 201 && data){
                setShowModal(false);
                setAlertTitle("Alert");
                setAlertMessage(data.message);
                setShowAlert(true);
                projectData.setFecthTasks(data);
            }
            console.log(data)
            

        } catch (error) {
            console.log(error);
        } 
        
    }


  return (
    <>
        <ListGroup.Item className='selectedListItem' onClick={handleShow}>
            <i className='fa fa-trash chat-icon'></i>         
            <br></br>
            Delete Project
        </ListGroup.Item>

        <Modal show={showModal} onHide={handleClose} >
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title>Delete Project</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBodyStatic'>
                {projectData ?
                <>
                <p className='warningTxt'>Selected project will be permanently deleted when click on <b>Delete Project</b> button.</p>
                <ListGroup>
                    <ListGroup.Item className='memberLists'><b>Title: </b> {projectData.currentProject.projectTitle} </ListGroup.Item>
                    <ListGroup.Item className='memberLists'><b>Discription: </b> {projectData.currentProject.projectDiscription}</ListGroup.Item>
                    <ListGroup.Item className='memberLists'><b>Type: </b> {projectData.currentProject.projectType}</ListGroup.Item>
                </ListGroup>
                </>
                :
                <>
                <p className='warningTxt'>Selected project will be permanently deleted when click on <b>Delete Project</b> button.</p>
                <ListGroup>
                    <ListGroup.Item className='memberLists'><b>Title: </b> </ListGroup.Item>
                    <ListGroup.Item className='memberLists'><b>Discription: </b> </ListGroup.Item>
                    <ListGroup.Item className='memberLists'><b>Start Date: </b> </ListGroup.Item>
                    <ListGroup.Item className='memberLists'><b>Due Date: </b> </ListGroup.Item>
                    <ListGroup.Item className='memberLists'><b>Due Date: </b> </ListGroup.Item>
                    <ListGroup.Item ><b>Type: </b> </ListGroup.Item>
                </ListGroup>
                </>
                }
            </Modal.Body>
            <Modal.Footer className='modalFooter'>
                {projectData ?
                    <Button variant="warning" className='saveBtn' id={projectData.currentProject._id} onClick={handleDeleteProject}>Delete Project</Button>
                :
                    <Button variant="warning" className='saveBtn' >Delete Project</Button>
                }
            </Modal.Footer>
        </Modal>
       
        {/* <Container className='contHidden'><DisplayProjects keyNum={keyNum}/></Container> */}
                


                
            {/* Alert Modal */}

            <Modal size="sm" show={showAlert} onHide={handleAlertClose}  aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="example-modal-sizes-title-sm">{alertTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBodyStatic'>
                <p>{alertMessage}</p>
            </Modal.Body>
            <Modal.Footer className='modalFooter'>
                <Button className='saveBtn' onClick={handleAlertClose}>Ok</Button> 
            </Modal.Footer>
            </Modal>
    </>
  )
}

export default DeleteProject