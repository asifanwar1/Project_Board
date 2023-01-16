import React, {useState, useContext, useEffect} from 'react'
import '../stylesheets/notes.css'
import { Row, Col, Container, Card, CardGroup, ProgressBar, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';


const UpdateNotes = ({noteData}) => {

    const [showAlert, setShowAlert] = useState(false);
    const handleAlertClose = () =>{setShowAlert(false);}
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteText, setNoteText] = useState("");
    const [noteId, setNoteId] = useState("");


    const setNoteForm = () =>{
        if(noteData){
            setNoteTitle(noteData.currentNote.noteTitle);
            setNoteText(noteData.currentNote.noteText);
            setNoteId(noteData.currentNote._id);
        }
    }

    useEffect(()=>{
        setNoteForm();
    },[])



    const handleNoteSubmit = async (e) =>{
        e.preventDefault();
        if(noteTitle && noteText){
            try {
                const response = await fetch('/updateCurrentNote', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({noteTitle, noteText, noteId}),
                })
    
                const data = await response.json();
    
                if(response.status === 201 && data){
                    setAlertTitle("Alert");
                    setAlertMessage("Note Created");
                    setShowAlert(true);
                    setNoteTitle("");
                    setNoteText("");
                    setModalShow(false);
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
        <ListGroup.Item className='selectedListBtn' onClick={() => setModalShow(true)}>
          <i className='fa fa-edit'></i>         
          <br></br>
          Edit Note
        </ListGroup.Item>

        <Modal size="lg" show={modalShow} onHide={() => setModalShow(false)} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="contained-modal-title-vcenter">Modal heading </Modal.Title>
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

export default UpdateNotes