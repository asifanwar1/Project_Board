import React, {useState, useContext, useEffect} from 'react'
import '../stylesheets/displayProjects.css'
import { Row, Col, Container, Card, CardGroup, ProgressBar, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';


const ProjectChat = ({projectData}) => {
    const [show, setShow] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const handleAlertClose = () =>{setShowAlert(false);}
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");

    const handleCreateChat = async (e) =>{
        let selectedProjectId = e.target.id;

        try {
            const response = await fetch('/createProjectChat', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' 
                },
                body: JSON.stringify({selectedProjectId}),
            })

            const data = await response.json();

            if(response.status === 201 && data){
                setAlertTitle("Alert")
                setAlertMessage(data.message);
                setShowAlert(true);
            }
            
        } catch (error) {
            console.log(error)
        }
        setShow(false);
    }
  
  return (
    <>
        <ListGroup.Item className='selectedListItem' onClick={() => setShow(true)}>
            <i className='far fa-comments'></i>         
            <br></br>
            Create Group Chat
        </ListGroup.Item>

        <Modal show={show} onHide={() => setShow(false)} >
            <Modal.Header closeButton className='modalHeader'>
                {projectData ?
                    <Modal.Title>{projectData.projectTitle}</Modal.Title>
                :
                    <Modal.Title>Selected Project</Modal.Title>
                }   
            </Modal.Header>
            <Modal.Body className='modalBodyStatic'>
                <p>Click on <b>Create Chat</b> button will create a group chat for this project which will 
                include all project members.</p>
                <p>For adding or removing members please update project members in <b>Update project</b> section.</p>
            </Modal.Body>
            <Modal.Footer className='modalFooter'>
                {projectData ?
                    <Button className='saveBtn' id={projectData._id} onClick={handleCreateChat}>Create Chat</Button>
                    :
                    <Button className='saveBtn'>Ok</Button>
                }
            </Modal.Footer>
        </Modal> 



                {/* Alert Modal */}

        <Modal size="sm" show={showAlert} onHide={handleAlertClose} backdrop="static" keyboard={false} aria-labelledby="example-modal-sizes-title-sm">
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

export default ProjectChat