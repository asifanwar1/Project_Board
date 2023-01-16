import React, {useState, useLayoutEffect, useEffect} from 'react'
import '../stylesheets/displayProjects.css'
import { Row, Col, Container, Card, CardGroup, ProgressBar, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';
import ViewProject from './ViewProject';
import UpdateProject from './UpdateProject';
import DeleteProject from './DeleteProject';
import Projects from './Projects';
import AssignPhases from './AssignPhases';
import ProjectNotification from './ProjectNotification';
import ProjectChat from './ProjectChat';


const DisplayProjects = (props) => {

    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const handleShow = () => {setFullscreen(true); setShow(true);}
    const [smShow, setSmShow] = useState(false);
    const [smShowAssign, setSmShowAssign] = useState(false);
    const [allfriends, setAllfriends] = useState([]);
    const [projects, setProjects] = useState([]);
    const [assignedProjects, setAssignedProjects] = useState([]);
    // const [projectId, setProjectId] = useState();
    const [currentProject, setCurrentProject] = useState();
    const [currentAssignedProject, setCurrentAssignedProject] = useState();
    const [fecthTasks, setFecthTasks] = useState();
    const [fecthAfterDelete, setFecthAfterDelete] = useState();

    const handleHideModal = () =>{
        setShow(false);
    }

    const handleHideSelectionModal = () =>{
        setCurrentProject("")
        setSmShow(false)
    }

    const handleHideAssignModal = () =>{
        setCurrentAssignedProject("")
        setSmShowAssign(false)
    }

    const getFriends = async () =>{
        try {
            const response = await fetch('/getFriends', {
                method: 'GET',
            })

            const data = await response.json();
            console.log(data)
            setAllfriends(data);

        } catch (error) {
            console.log(error)
        }

    }


    const showAssignedProjects = async () =>{
        try {
          const response = await fetch('/getAssignedProjects', {
            method: 'GET',
        });
    
        const data = await response.json();
        console.log(data)
        setAssignedProjects(data)
    
        } catch (error) {
          console.log(error)
        }
      
    }



    const showProjects = async () =>{
        try {
          const response = await fetch('/getProjects', {
            method: 'GET',
        });
    
        const data = await response.json();
        console.log(data)
        setProjects(data)
    
        } catch (error) {
          console.log(error)
        }
      
    }

    useEffect(() =>{
        setSmShow(false);
        setCurrentProject("");
        getFriends();
        showProjects();
        showAssignedProjects();
    },[fecthTasks])




    const clickedProject = (e) =>{
        let selectedId = e.target.id 

        let findProject = projects.find(element => element._id === selectedId);
        setCurrentProject(findProject)
        // setProjectId(selectedId)
        setSmShow(true)
        // props.setSelectedProject(selectedId)
    }

    const clickedAssignedProject = (e) =>{
        let selectedId = e.target.id 

        let findProject = assignedProjects.find(element => element._id === selectedId);
        setCurrentAssignedProject(findProject)
        // setProjectId(selectedId)
        setSmShowAssign(true) 
        // props.setSelectedProject(selectedId)
    }


    const handleRefreshCompnent = () =>{
        setCurrentProject("");
        getFriends();
        showProjects();
        showAssignedProjects();
    }


  return (
    <>
 
        <ListGroup.Item className='navList' onClick={handleShow}>
          <i className='fas fa-project-diagram'>&nbsp;</i>         
          {' '}
          My Projects
        </ListGroup.Item>

        <Modal show={show} fullscreen={fullscreen} onHide={handleHideModal}>
            <Modal.Header closeButton className='modalHeader'>
                <Container>
                    <Row className="justify-content-md-center">
                        <Col sm lg="5">
                            <Modal.Title>Current Projects</Modal.Title>
                            <br></br>
                        </Col>
                        <Col sm lg="6">
                            <Container><Projects props={{setFecthTasks}}/></Container>
                            <br></br>
                        </Col>
                        <Col sm lg="1">
                            <Button className='refreshBtn2' onClick={handleRefreshCompnent}><i className="material-icons refreshIcon">refresh</i></Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Header>
            <Modal.Body className='modalBody'>       
                <Container>
                    {/* <Button className='refreshBtn2' onClick={handleRefreshCompnent}><i className="material-icons refreshIcon">refresh</i></Button> */}
                    <br></br>
                    <Row className="justify-content-md-center">
                        {projects.map((project, index)=>
                            <Col xs lg="5" key={index}>
                                <ListGroup.Item className='projectListItem' id={project._id} onClick={clickedProject}>
                                    <b>{project.projectTitle}</b><b className='projectOwner'>My Project</b>
                                    <br></br>
                                    <br></br>
                                    <ProgressBar animated variant="info" now={project.progressBar} label={`${project.progressBar}%`} />
                                    <br></br>
                                    <p>Due Date: {project.dueDate.substring(0,10)}</p>
                                </ListGroup.Item>
                                <br></br>
                            </Col>
                        )}
                        {assignedProjects.map((project, index)=>
                            <Col xs lg="5" key={index}>
                                <ListGroup.Item className='projectListItem' id={project._id} onClick={clickedAssignedProject}>
                                    <b>{project.projectTitle}</b><b className='projectOwner'>Assigned Project</b>
                                    <br></br>
                                    <br></br>
                                    <ProgressBar animated variant="info" now={project.progressBar} label={`${project.progressBar}%`}/>
                                    <br></br>
                                    <p>Due Date: {project.dueDate.substring(0,10)}</p>
                                </ListGroup.Item>
                                <br></br>
                            </Col>
                        )}
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>




        {/* Project Option Selection Modal */}


        <Modal size="sm" show={smShow} onHide={handleHideSelectionModal} aria-labelledby="example-modal-sizes-title-sm" >
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="example-modal-sizes-title-sm" className='titleSelection'>
                    Choose For Selected Project
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBody'>
               
                <ViewProject projectData={currentProject}/> 

                <br></br>

                <UpdateProject projectData={{currentProject, allfriends, setFecthTasks}}/>
                        
                <br></br>

                <AssignPhases projectData={{currentProject, allfriends, setFecthTasks}}/>
                        
                <br></br>

                <ProjectNotification projectData={currentProject}/>
                        
                <br></br>

                <ProjectChat projectData={currentProject}/>

                <br></br>
                
                <DeleteProject projectData={{currentProject, setFecthTasks}} />
                
                <br></br>

            </Modal.Body>
        </Modal>





        {/* Assigned Project Option Selection Modal */}


        <Modal size="sm" show={smShowAssign} onHide={handleHideAssignModal} aria-labelledby="example-modal-sizes-title-sm" >
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="example-modal-sizes-title-sm" className='titleSelection'>
                    Choose For Selected Project
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBody'>
            
                <ViewProject projectData={currentAssignedProject}/> 

                <br></br>

            </Modal.Body>
        </Modal>

    </>
  )
}

export default DisplayProjects