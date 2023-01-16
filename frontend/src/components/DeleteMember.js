import React, {useState, useEffect, useContext} from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import '../stylesheets/messages.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col,Container, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';
import image_S1 from '../images/abstract10.png'

const DeleteMember = () => {

    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
  return (
    <>
        <ListGroup.Item className='selectedListItem' onClick={() => setShowModal(true)}>
            <i className='fa fa-trash'></i>         
            <br></br>
            Remove Member
        </ListGroup.Item>

        <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false} >
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title>Delete Project</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBodyStatic'>
                <p className='warningTxt'>Selected member will be permanently deleted from all Projects / Tasks & Chat Box when click on <b>Remove Member</b> button.</p>
            </Modal.Body>
            <Modal.Footer className='modalFooter'>
                <Button variant="warning" className='saveBtn' >Remove Member</Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}

export default DeleteMember