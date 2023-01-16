import React, {useState, useContext, useEffect} from 'react'
import '../stylesheets/displayProjects.css'
import Dropdown from 'react-bootstrap/Dropdown';
import { Row, Col, Container, Card, CardGroup, ProgressBar, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';
import image_S1 from '../images/abstract10.png'
import { UserContext } from '../App'

const AssignPhases = ({projectData}) => {
    const {state, dispatch} = useContext(UserContext); 
    const [showAlert, setShowAlert] = useState(false);
    const handleAlertClose = () =>{setShowAlert(false);}
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const handleShow = () => {setFullscreen(true); setShow(true);}
    const handleHideModal = () =>{setShow(false);}
    const [smShow, setSmShow] = useState(false);
    const [smShowUpdate, setSmShowUpdate] = useState(false);
    const [projectMembers, setProjectMembers] = useState();
    const [currentProjectCreator, setCurrentProjectCreator] = useState();
    const [selectedPhase, setSelectedPhase] = useState();
    const [selectedphaseForUpdate, setSelectedphaseForUpdate] = useState();
    const [assignEachPhase, setAssignEachPhase] = useState([]);


    const checkMembers = () =>{
        if(projectData){
            console.log(projectData.currentProject)
            let currentMembers = [];
            projectData.currentProject.members.map((element1)=>{
                let getProfile = projectData.allfriends.find(element2 => element2._id === element1.memberRef);
                currentMembers.push(getProfile);
            })
            setProjectMembers(currentMembers)
            console.log(currentMembers)
        }
    }


    useEffect(()=>{
        checkMembers();
    },[])


    const handleAssignBtn = (e) =>{
        let id = e.target.id;
        
        if(projectData){
            let getPhase = projectData.currentProject.projectPhases.find(element => element._id === id);
            setSelectedPhase(getPhase);
            setSmShow(true);
            console.log(getPhase)
        }
    }


    const addMember = (e) =>{
        let id = e.target.id;
        

        // let checkArr = assignEachPhase.find(element => element.phaseId === selectedPhase._id && element.phaseMembers === id);
        let checkArr = assignEachPhase.find(element => element.phaseId === selectedPhase._id && element.memberRef === id);
        
        if(checkArr){
            setAlertTitle("Alert");
            setAlertMessage("Member is already added in this phase.");
            setShowAlert(true);
        }
        else{          
            
            let getProfile = projectData.allfriends.find(element => element._id === id);
            
            if(getProfile){
                let eachPhaseObj = {
                    phaseId: selectedPhase._id,
                    phaseNum: selectedPhase.PhaseNum,
                    phaseTitle: selectedPhase.PhaseTitle,
                    memberRef: id,
                    memberName: getProfile.name,
                    uniqueId: selectedPhase._id + id,
                }
                setAssignEachPhase(assignEachPhase => [...assignEachPhase, eachPhaseObj])
            }
            else{
                let eachPhaseObj = {
                    phaseId: selectedPhase._id,
                    phaseNum: selectedPhase.PhaseNum,
                    phaseTitle: selectedPhase.PhaseTitle,
                    memberRef: id,
                    memberName: state.name,
                    uniqueId: selectedPhase._id + id, 
                }
                setAssignEachPhase(assignEachPhase => [...assignEachPhase, eachPhaseObj])
            }

        }
           
    }


    const removeMember = (e) =>{
        let id = e.target.id;
        let removeSelectedMember = assignEachPhase.filter(element => element.uniqueId !== id); 
        setAssignEachPhase(removeSelectedMember)
    }

    const handleAssignPhases = async (e) =>{
        let projectId = e.target.id;
        try {
            const response = await fetch('/assignProjectPhases', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' 
                },
                body: JSON.stringify({assignEachPhase, projectId}),
            })

            const data = await response.json();

            if(response.status === 201 || data){
                setAlertTitle("Alert");
                setAlertMessage("Phases Assigned.");
                setShowAlert(true);
                projectData.setFecthTasks(data);
            }
        } catch (error) {
            console.log(error)
        }
        setShow(false)
    }


    const showPhases = async () =>{
        if(projectData){
            try {
                let selectedProjectId = projectData.currentProject._id;
                let selectedProjectCreator = projectData.currentProject.projectCreator;

                const response = await fetch('/showProjectPhases', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({selectedProjectId, selectedProjectCreator}),
                })
    
                const data = await response.json();

                if(data){
                    if(data.findProjectPhases){
                        setAssignEachPhase(data.findProjectPhases.allPhases);
                    }
                    else{
                        setAssignEachPhase([]);
                    }
                    setCurrentProjectCreator(data.findProjectCreator);
                }
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }
    }


    useEffect(() =>{
        showPhases();
    },[])


    const handleUpdateBtn = (e) =>{
        let id = e.target.id
        if(projectData){

            let findPhase = projectData.currentProject.projectPhases.find(element => element._id === id);
            console.log(findPhase);
            setSelectedphaseForUpdate(findPhase)
            setSmShowUpdate(true);
        }
        
    }

    const handleUpdatePhaseBtn = async () =>{
        if(selectedphaseForUpdate){
            try {
                const response = await fetch('/updatePhaseToCompleted', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({selectedphaseForUpdate}),
                })
    
                const data = await response.json();

                if(response.status === 201 && data){
                    setSmShowUpdate(false);
                }
                
            } catch (error) {
                console.log(error);
            }
        }

    }


    const handleUndoUpdatePhaseBtn = async () =>{

        if(selectedphaseForUpdate){
            try {
                const response = await fetch('/updatePhaseToPending', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({selectedphaseForUpdate}),
                })
    
                const data = await response.json();

                if(response.status === 201 && data){
                    setSmShowUpdate(false);
                }
                
            } catch (error) {
                console.log(error);
            }
        }

    }

  return (
    <>

        <ListGroup.Item className='selectedListItem' onClick={handleShow}>
          <i className='fa fa-sitemap'></i>         
          <br></br>
          Assign Phases
        </ListGroup.Item>

        <Modal show={show} fullscreen={fullscreen} onHide={handleHideModal} keyboard={false} >
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title>Assign Project Phases</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBodyStatic'>
                {projectData.currentProject && projectMembers ?
                <>
                <p>You can assign & update a phase of selected project to your team members or yourself.</p> 
                <p>Click on mentioned project phases to assign a phase to a member.</p>
                <p><b>Project Title:  {projectData.currentProject.projectTitle} </b></p>
                <br></br>
                <Container>
                    <p><b>Project Phases :-</b></p>
                    <Row>
                        {projectData.currentProject.projectPhases.map((element, index)=>
                            <Col sm lg="3" key={index}>
                                <Dropdown >
                                    <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropBtn'>
                                        Phase {element.PhaseNum} : {element.PhaseTitle}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className='dropDownCont'>
                                        <Dropdown.Item id={element._id} onClick={handleAssignBtn}>Add Members</Dropdown.Item>
                                        <Dropdown.Item id={element._id} onClick={handleUpdateBtn}>Update Status</Dropdown.Item> 
                                    </Dropdown.Menu>
                                </Dropdown>
                                <br></br>
                            </Col>
                        )}
                    </Row>
                </Container>
                <br></br>
                <Container>
                    <p><b>Assign To :-</b></p>
                    <Row>
                        {assignEachPhase.map((element, index)=>
                            <Col sm lg="3" key={index}>
                                <ListGroup.Item className='listPhase'>
                                    Phase {element.phaseNum} : {element.memberName}
                                    <i className="fa fa-times removeBtnPhase" id={element.phaseId + element.memberRef} onClick={removeMember}></i>
                                </ListGroup.Item> 
                            </Col>        
                        )}
                    </Row>                                            
                </Container>
                </>
                :
                <>
                <p className='warningTxt'>Selected project will be permanently deleted when click on <b>Delete Project</b> button.</p>
                <ListGroup>
                    <ListGroup.Item  className='listPhase'><b>Title: </b> </ListGroup.Item>
                </ListGroup>
                </>
                }
            </Modal.Body>
            <Modal.Footer className='modalFooter'>
                {projectData.currentProject ?
                    <Button className='phaseSaveBtn' id={projectData.currentProject._id} onClick={handleAssignPhases}>Save</Button>
                :
                    <Button className='phaseSaveBtn'>Save</Button>
                }
                
            </Modal.Footer>
        </Modal>






        {/* add Members */}

        <Modal size="sm" show={smShow} onHide={() => setSmShow(false)} aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="example-modal-sizes-title-sm">
                    Project Members
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBody'>
               
                        <ListGroup variant="flush" >
                            {currentProjectCreator ?
                            <>
                            <ListGroup.Item as="li"  className="d-flex justify-content-between align-items-start memberLists" >
                           
                            <Row>
                                <Col>
                                    <img src={currentProjectCreator.projectCreatorImage}
                                        onError={(e)=>{e.target.onError = null; e.target.src = image_S1}}
                                        className="profileImages"
                                    />
                                </Col>
                                <Col>
                                    <p>{currentProjectCreator.projectCreatorName}</p>
                                    <p>Project Creator</p>
                                </Col>
                                <Col>
                                    <i className="fa fa-plus addFriendIcon" id={currentProjectCreator.projectCreatorId} onClick={addMember}></i>
                                </Col>
                            </Row>
                           
                            </ListGroup.Item>
                            {projectMembers.map( (element, index) =>
                                <ListGroup.Item as="li" key={index}  className="d-flex justify-content-between align-items-start memberLists" >
                                    <Row>
                                        <Col>
                                            <img src={element.image}
                                            onError={(e)=>{e.target.onError = null; e.target.src = image_S1}}
                                            className="profileImages"
                                            />
                                        </Col>
                                        <Col>
                                            <p>{element.name}</p>
                                            <p>{element.designation}</p>
                                        </Col>
                                        <Col>
                                        <i className="fa fa-plus addFriendIcon" id={element._id} onClick={addMember}></i>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                               
                            )}
                             </>
                            :
                            <ListGroup.Item></ListGroup.Item>
                            
                            }
                            
                        </ListGroup>
                  
            </Modal.Body>
            </Modal>
    




            {/* Update Selected Phase */}

            <Modal size="sm" show={smShowUpdate} onHide={() => setSmShowUpdate(false)} aria-labelledby="example-modal-sizes-title-sm">
                <Modal.Header closeButton className='modalHeader'>
                    {selectedphaseForUpdate ?
                        <Modal.Title id="example-modal-sizes-title-sm">{selectedphaseForUpdate.PhaseTitle}</Modal.Title>
                    :
                        <Modal.Title id="example-modal-sizes-title-sm">Selected Phase</Modal.Title>
                    }
                </Modal.Header>
                <Modal.Body className='modalBodyStatic'>
                    {selectedphaseForUpdate ?
                        <>
                        {selectedphaseForUpdate.PhaseStatus === "Pending" ?
                            <>
                                <p>Phase Status: {selectedphaseForUpdate.PhaseStatus}</p>
                                <br></br>
                                <p>Click on "Update" button to update the phase status to "Completed".</p>
                            </>
                        :
                            <>
                                <p>Phase Status: {selectedphaseForUpdate.PhaseStatus}</p>
                                <br></br>
                                <p>Click on "Update" button to update the phase status to "Pending".</p>
                            </>
                        }
                        </>
                    
                    :
                        <p></p>
                    }
                    
                </Modal.Body>
                <Modal.Footer className='modalFooter'>
                    {selectedphaseForUpdate ?
                        <>
                        {selectedphaseForUpdate.PhaseStatus === "Pending" ?
                            <Button className='saveBtn' onClick={handleUpdatePhaseBtn}>Update</Button>
                        :
                            <Button className='saveBtn' onClick={handleUndoUpdatePhaseBtn}>Update</Button>  
                        }
                        </>
                    
                    :
                        <Button className='saveBtn'>Update</Button>
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

export default AssignPhases