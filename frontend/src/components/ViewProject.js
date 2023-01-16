import React, {useState, useContext, useEffect} from 'react'
import '../stylesheets/displayProjects.css'
import { Row, Col, Container, Card, CardGroup, ProgressBar, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';
import { UserContext } from '../App'

const ViewProject = ({projectData}) => {
   
    const {state, dispatch} = useContext(UserContext);  
    const [showAlert, setShowAlert] = useState(false);
    const handleAlertClose = () =>{setShowAlert(false);}
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [smShow, setSmShow] = useState(false);
    const [currentProjectMembers, setCurrentProjectMembers] = useState([]);
    const [assignedPhases, setAssignedPhases] = useState([]);
    const [currentProjectCreator, setCurrentProjectCreator] = useState();
    const [myAssignedPhases, setmyAssignedPhases] = useState([]);
    const [selectedPhase, setSelectedPhase] = useState();
  



    const showPhases = async () =>{
        if(projectData){
            try {
                let selectedProjectId = projectData._id;
                let selectedProjectCreator = projectData.projectCreator;

                const response = await fetch('/showProjectPhases', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({selectedProjectId, selectedProjectCreator}),
                })
    
                const data = await response.json();
                console.log(data)
                if(data){
                    if(data.findProjectPhases){
                        setAssignedPhases(data.findProjectPhases.allPhases);
                    }
                    else{
                        setAssignedPhases([]);
                    }
                    setCurrentProjectCreator(data.findProjectCreator);
                    setCurrentProjectMembers(data.selectedProjectMembers)
                }
               

            } catch (error) {
                console.log(error)
            }
        }
    }


    useEffect(() =>{
        showPhases();
    },[])

    const handelAssigning = () =>{
        if(assignedPhases){
            let phaseObj = [];
            assignedPhases.map((element)=>{
                if(element.memberRef === state.id){
                    phaseObj.push(element);
                }
            })
       
            setmyAssignedPhases(phaseObj); 

            console.log(myAssignedPhases)
        }
    }



    useEffect(() =>{
        handelAssigning();
    },[assignedPhases])


    const phaseCompletionModal = (e) =>{
        let id = e.target.id;
        let findPhase = myAssignedPhases.find(element => element.phaseId === id);
        console.log(findPhase)
        setSelectedPhase(findPhase);
        setSmShow(true);
    }

    const handleCompletedPhases = async (e) =>{
        let selectedProjectId = e.target.id;
        try {
            const response = await fetch('/phaseCompletedNotification', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' 
                },
                body: JSON.stringify({selectedProjectId, selectedPhase}),
            })

            const data = await response.json();

            if(response.status === 201 && data){
                setAlertTitle("Alert")
                setAlertMessage(data.message);
                setShowAlert(true);
            }
            
        } catch (error) {
            console.log(error);
        }
        setSmShow(false);
    }


    const handleDownloadFile = async (e) =>{
        let fileId = e.target.id;
        console.log(fileId)
        let x = document.getElementById("2abc")
        try {
            const response = await fetch(`/downloadFile/${fileId}`);

            const file = await response.blob();
            const url = window.URL.createObjectURL(file);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileId;
            // document.body.appendChild(a);
            x.appendChild(a);
            a.click();
            // window.URL.revokeObjectURL(url);

        } catch (error) {
            console.log(error)
        }
    }

  
    return (
    <>
    
        <ListGroup.Item className='selectedListItem' onClick={handleShow}>
            <i className='fa fa-tv chat-icon'></i>         
            <br></br>
            View Project
        </ListGroup.Item>
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} >
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title>Selected Project</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBody'>
                {projectData ?
                    <Container>
                        <ListGroup>
                            <h6><b>Details: </b> </h6>
                            {currentProjectCreator ?
                                <ListGroup.Item className='phaseListItem'><b>Project Creator: {currentProjectCreator.projectCreatorName}</b></ListGroup.Item>
                            :
                                <ListGroup.Item className='phaseListItem'><b>Project Creator: </b></ListGroup.Item>
                            }
                            
                            <ListGroup.Item className='phaseListItem'><b>Title: </b> {projectData.projectTitle} </ListGroup.Item>
                            <ListGroup.Item className='phaseListItem'><b>Discription: </b> {projectData.projectDiscription}</ListGroup.Item>
                            <ListGroup.Item className='phaseListItem'><b>Start Date: </b> {projectData.startDate.substring(0,10)}</ListGroup.Item>
                            <ListGroup.Item className='phaseListItem'><b>Due Date: </b> {projectData.dueDate.substring(0,10)}</ListGroup.Item>
                            <ListGroup.Item className='phaseListItem'><b>Type: </b> {projectData.projectType}</ListGroup.Item>
                            <br></br>
                            <h6><b>Members: </b> </h6>
                            {currentProjectMembers.map((element, index)=>
                                <ListGroup.Item key={index} className='phaseListItem'>
                                    {element.memberName}
                                </ListGroup.Item>
                            )}
                            <br></br>
                            <h6><b>Phases: </b> </h6>
                            {projectData.projectPhases.map((element, index)=>
                                <ListGroup.Item key={index} className='phaseListItem'>
                                    Phase {element.PhaseNum} --- {element.PhaseTitle}
                                </ListGroup.Item>
                            )}
                            <br></br> 
                            <h6><b>Files: </b> </h6>
                            {projectData.projectFiles.map((element, index)=>
                                <ListGroup.Item key={index} id={index + "abc"} className='phaseListItem'>
                                    File Name: {element.fileName}
                                    <br></br>
                                    File Size: {Math.floor(element.fileSize/10000) + 'KB'}
                                    <Button className='downloadBtn' id={element._id} onClick={handleDownloadFile}><i className="fa fa-download" id={element._id} onClick={handleDownloadFile}></i></Button>
                                </ListGroup.Item>
                            )}
                            <br></br>
                            <h6><b>My Assigned Phases & Tasks: </b> </h6>
                            {myAssignedPhases ?
                                <>
                                {myAssignedPhases.map((element, index)=>
                                    <ListGroup.Item key={index} className='phaseListItem'>
                                        Phase Number: {element.phaseNum} <i id={element.phaseId} className="fa fa-check-circle completedBtn" onClick={phaseCompletionModal}></i>
                                        <br></br>
                                        Phase Title: {element.phaseTitle}
                                    </ListGroup.Item>
                                )}
                                </>
                            :
                                <ListGroup.Item className='phaseListItem'>No Assigned Phases</ListGroup.Item>
                            }
                            
                    </ListGroup>
                    </Container>
                :
                    <ListGroup>
                        <ListGroup.Item className='phaseListItem'><b>Creator: </b> </ListGroup.Item>
                        <ListGroup.Item className='phaseListItem'><b>Title: </b> </ListGroup.Item>
                        <ListGroup.Item className='phaseListItem'><b>Discription: </b> </ListGroup.Item>
                        <ListGroup.Item className='phaseListItem'><b>Start Date: </b> </ListGroup.Item>
                        <ListGroup.Item className='phaseListItem'><b>Due Date: </b> </ListGroup.Item>
                        <ListGroup.Item className='phaseListItem'><b>Type: </b> </ListGroup.Item>
                        <ListGroup.Item className='phaseListItem'><b>Members: </b> </ListGroup.Item>
                        <ListGroup.Item className='phaseListItem'><b>Phases: </b> </ListGroup.Item>
                        <ListGroup.Item className='phaseListItem'><b>Files: </b> </ListGroup.Item>
                    </ListGroup>
                }
                
            </Modal.Body>
        </Modal>


                {/* Phase Completion Modal  */}


        <Modal size="sm" show={smShow} onHide={() => setSmShow(false)} aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header closeButton className='modalHeader'>
                {selectedPhase ?
                    <Modal.Title id="example-modal-sizes-title-sm">{selectedPhase.phaseTitle}</Modal.Title>
                  :
                    <Modal.Title id="example-modal-sizes-title-sm">Selected Phase</Modal.Title>
                }  
            </Modal.Header>
            <Modal.Body className='modalBodyStatic'>
                <p>If you completed the selected phase / task then click 
                    on <b>Task Completed</b> button to send notification to the project creator.</p>
            </Modal.Body>
            <Modal.Footer className='modalFooter'>
                {projectData ?
                    <Button className='saveBtn' id={projectData._id} onClick={handleCompletedPhases}>Task Completed</Button>
                    :
                    <Button className='saveBtn'>Save</Button>
                }
            </Modal.Footer>
        </Modal>



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

export default ViewProject