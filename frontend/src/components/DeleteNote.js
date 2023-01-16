import React, {useState, useLayoutEffect, useEffect} from 'react'
import '../stylesheets/notes.css'
import { Row, Col, Container, Card, CardGroup, ProgressBar, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';



const DeleteNote = ({noteData}) => {

    const [showAlert, setShowAlert] = useState(false);
    const handleAlertClose = () =>{setShowAlert(false);}
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [noteId, setNoteId] = useState("");

    const setNoteForm = () =>{
        if(noteData){
            setAlertTitle(noteData.currentNote.noteTitle);
            setAlertMessage('Click on "Delete" button will permanently delete the selected note.');
            setNoteId(noteData.currentNote._id);
        }
    }

    useEffect(()=>{
        setNoteForm();
    },[]);


    const handleDeleteBtn = async () =>{

        if(alertTitle && noteId){
            try {
                const response = await fetch('/deleteCurrentNote', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({noteId}),
                })
    
                const data = await response.json();
    
                if(response.status === 201 && data){
                    setShowAlert(false);
                    noteData.setFecthTasks(data);
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

    {/* Alert Modal */}
        <ListGroup.Item className='selectedListBtn' onClick={() => setShowAlert(true)}>
          <i className='fa fa-trash'></i>         
          <br></br>
          Delete Note
        </ListGroup.Item>

        <Modal size="sm" show={showAlert} onHide={handleAlertClose} backdrop="static" keyboard={false} aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="example-modal-sizes-title-sm">{alertTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBodyStatic'>
                <p>{alertMessage}</p>
            </Modal.Body>
            <Modal.Footer className='modalFooter'>
                {noteId ?
                    <Button className='saveBtn' onClick={handleDeleteBtn}>Delete</Button> 
                :
                    <Button className='saveBtn' onClick={handleAlertClose}>Ok</Button> 
                }
            </Modal.Footer>
        </Modal>
    
    </>
  )
}

export default DeleteNote