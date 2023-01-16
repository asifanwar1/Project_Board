import React, {useState, useLayoutEffect, useEffect} from 'react'
import '../stylesheets/notes.css'
import { Row, Col, Container, Card, CardGroup, ProgressBar, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';


const CreateNotes = ({props}) => {

    const [showAlert, setShowAlert] = useState(false);
    const handleAlertClose = () =>{setShowAlert(false);}
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteText, setNoteText] = useState("");

    const handleNoteSubmit = async (e) =>{
        e.preventDefault();
        if(noteTitle && noteText){
            try {
                const response = await fetch('/addNewnote', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({noteTitle, noteText}),
                })
    
                const data = await response.json();
    
                if(response.status === 201 && data){
                    setAlertTitle("Alert");
                    setAlertMessage("Note Created");
                    setShowAlert(true);
                    setNoteTitle("");
                    setNoteText("");
                    props.setFecthTasks(data)
                }
            } catch (error) {
                console.log(error)
            }
        }else{
            setAlertTitle("Alert");
            setAlertMessage("Please fill the form correctly.");
            setShowAlert(true);
        }
        
        
    }
 
  return (
    <>
        <ListGroup.Item className='newProjectBtn' onClick={() => setModalShow(true)}>
            <i className='fa fa-plus'></i>
            {' '}
            Create Note         
        </ListGroup.Item> 
    
        <Modal size="lg" show={modalShow} onHide={() => setModalShow(false)} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title>New Note</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBodyStatic'>
                <Container>
                    <Form method='POST'>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" className='formInput' placeholder="Title" value={noteTitle} onChange={(e)=>setNoteTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Note</Form.Label>
                            <Form.Control as="textarea" className='formInput' rows={3} value={noteText} onChange={(e)=>setNoteText(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer className='modalFooter'>
                <Button className='saveBtn' variant="primary" type="submit" onClick={handleNoteSubmit}>Save</Button>
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

export default CreateNotes