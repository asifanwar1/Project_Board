import React, {useState, useLayoutEffect, useEffect} from 'react'
import '../stylesheets/displayProjects.css'
import { Row, Col, Container, Card, CardGroup, ProgressBar, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';
import CreateNotes from './CreateNotes';
import UpdateNotes from './UpdateNotes';
import DeleteNote from './DeleteNote';


const MyNotes = () => {

    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const handleShow = () => {setFullscreen(true); setShow(true);}
    const handleHideModal = () =>{setShow(false);}
    const [smShow, setSmShow] = useState(false);
    const [myNotes, setMyNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState();
    const handleHideSelectionModal = () =>{setCurrentNote(""); setSmShow(false);}
    const [fecthTasks, setFecthTasks] = useState();



    const getNotes = async () =>{
      try {
          const response = await fetch('/getallNotes', {
              method: 'GET',
          })

          const data = await response.json();
          console.log(data)
          setMyNotes(data);

      } catch (error) {
          console.log(error)
      }

  }

  useEffect(() => {
    getNotes();
  },[fecthTasks])


  const clickedNote = (e) =>{
      let noteId = e.target.id;
      let getnote = myNotes.find(element => element._id === noteId);
      setCurrentNote(getnote);
      setSmShow(true);
  }


  return (
    <>
        <ListGroup.Item className='navList' onClick={handleShow}>
          <i className='fa fa-sticky-note'>&nbsp;</i>         
          {' '}
          My Notes
        </ListGroup.Item>

        <Modal show={show} fullscreen={fullscreen} onHide={handleHideModal}>
            <Modal.Header closeButton className='modalHeader'>
              <Container>
                <Row className="justify-content-md-center">
                  <Col sm lg="5">
                    <Modal.Title>My Notes</Modal.Title>
                    <br></br>
                  </Col>
                  <Col sm lg="6">
                    <Container ><CreateNotes props={{setFecthTasks}}/></Container>
                    <br></br>
                  </Col>
                </Row>
              </Container>  
            </Modal.Header>
            <Modal.Body className='modalBody'>
              
              <br></br>
              <Container>
                <Row className="justify-content-md-center">
                  {myNotes.map((element, index)=>
                    <Col sm lg="4" key={index}>
                      <ListGroup.Item className='notesCont' id={element._id} onClick={clickedNote}>
                        <h5>Title: {element.noteTitle}</h5>
                        <br></br>
                        <p><b>Note:</b> {element.noteText}</p>
                        <br></br>
                        <p>Date: {element.noteDate.substring(0,10)}</p>
                      </ListGroup.Item>
                      <br></br>
                    </Col>
                  )}
                </Row>
              </Container>
            </Modal.Body>
        </Modal>




        <Modal size="sm" show={smShow} onHide={handleHideSelectionModal} aria-labelledby="example-modal-sizes-title-sm" >
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="example-modal-sizes-title-sm" className='titleSelection'>
                    Choose For Selected Note
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBody'>
              <UpdateNotes noteData={{currentNote, setFecthTasks}}/>              
              <br></br>
              <DeleteNote noteData={{currentNote, setFecthTasks}}/>
              <br></br>
            </Modal.Body>
        </Modal>
    </>
  )
}

export default MyNotes