import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom'
import { Row, Col,Container, Fade, Button, ListGroup, Badge } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import '../stylesheets/todos.css'
import TodoForm from './TodoForm';
import { UserContext } from '../App'

const SideNavbar = () => {

    const {state, dispatch} = useContext(UserContext);  
    const [fecthTasks, setFecthTasks] = useState();
    const [tasks, setTasks] = useState([]);
    const [taskUpdate, setTaskUpdate] = useState();
    const [show, setShow] = useState(false);
    const handleClose = () => {
      setShow(false);
      setTaskUpdate(null);
    }
    const handleShow = () => setShow(true);
    


    
    const showTasks = async () =>{
        try {
          const response = await fetch('/showTasks', { 
            method: 'GET', 
        });
  
        const data = await response.json();
        console.log(data) 
        setTasks(data);
        } catch (error) {
          console.log(error)
        }
      
    }

  useEffect(() =>{
      showTasks();
  },[fecthTasks])


  const handleClick = (e) =>{
    
    const taskId = e.target.id;

    const findTask = tasks.find(clickedTask => clickedTask._id === taskId);

    let oldDate = new Date(findTask.date)
    let day = oldDate.getDate();
    let month = oldDate.getMonth() + 1;
    let year = oldDate.getFullYear();
        
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    let fullDate = year+"-"+month+"-"+day;

    findTask.date = fullDate;

    setTaskUpdate(findTask)
      // taskUpdate = findTask;
    // taskUpdate.current = findTask;
    // navigate("/updateForm", {state : {findTask}})
    
  }

    return ( 
        <>
        <ListGroup.Item className='navList' onClick={handleShow}>
          <i className='fas fa-tasks'>&nbsp;</i>         
          {' '}
          To-Do List
        </ListGroup.Item> 

      <Offcanvas show={show} onHide={handleClose} >
        <Offcanvas.Header closeButton className='todoOffCanvas'>
          <Offcanvas.Title>To-Do-List</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='todoOffCanvas'>
        <TodoForm clickedTask={{taskUpdate, setFecthTasks}}/>
          <Container className='todosContainer'>
              <Row>
                <Col>
                  <ListGroup as="ol" variant="flush" numbered className='todosList'>
                    {tasks.map( (tasks, index) =>
                      <ListGroup.Item as="li" key={index}  className="d-flex justify-content-between align-items-start todosList">
                      <div id='category' className="ms-2 me-auto">
                        <div id={tasks._id} onClick={handleClick} className="fw-bold">{tasks.task}</div>
                        {tasks.category}
                      </div>
                      <Badge id='date' bg="primary" pill className='badgeList'>
                        {'Due Date: '}{ new Date(tasks.date).toLocaleDateString()}
                      </Badge>
                    </ListGroup.Item>
                    )}
                  </ListGroup>
                </Col>
              </Row>
            </Container>
            
            
            
        </Offcanvas.Body>
      </Offcanvas>

    </>
  )
}

export default SideNavbar



