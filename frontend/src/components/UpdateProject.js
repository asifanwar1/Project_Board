import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import "../stylesheets/projects.css"
import {Container, Form, Button, Row, Col, Badge, FloatingLabel, Popover, Dropdown, ButtonGroup, DropdownButton, OverlayTrigger, FormControl, Modal, ListGroup, InputGroup } from 'react-bootstrap';
import image_S1 from '../images/abstract10.png'


const UpdateProject = ({projectData}) => {
    
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const handleAlertClose = () =>{setShowAlert(false);}
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const handleShow = () => {setFullscreen(true); setShow(true);}
    const handleHideModal = () =>{setShow(false);}
    const [smShow, setSmShow] = useState(false);
    const [desigModal, setDesigModal] = useState(false);
    const [phaseModaInUpdate, setPhaseModaInUpdate] = useState(false);  
    const [phaseEditModalInUpdate, setPhaseEditModalInUpdate] = useState(false);
    const [txtInput, setTxtInput] = useState("");
    const [updateProjectPhases, setUpdateProjectPhases] = useState([]);
    const [allfriends, setAllfriends] = useState([]);
    const [friends, setFriends] = useState([]);
    const [members, setMembers] = useState([]);
    const [membersIds, setMembersIds] = useState([]);
    const [designationInput, setDesignationInput] = useState();
    const [phaseInput, setPhaseInput] = useState("");
    const [phaseEditInput, setPhaseEditInput] = useState("");
    const [desigId, setDesigId] = useState("");
    const [projectFiles, setProjectFiles] = useState([]);
    const [projectDetails, setProjectDetails] = useState({
        projectTitle : "",
        projectDiscription : "",
        startDate : "",
        dueDate : "",
        projectType : "",
    });

    let name, value;

    const handleInputs = (e) =>{ 
        name = e.target.name;
        value = e.target.value;
        
        setProjectDetails({...projectDetails, [name]:value});
    }

    
    
    
    const handleFiles = (e) =>{
        let myfiles = e.target.files 
        console.log(myfiles)
        setProjectFiles(myfiles);
        
    }


    const getFriends = async () =>{
        try {
            const response = await fetch('/getFriends', {
                method: 'GET',
            })

            const data = await response.json();
            console.log(data)
            setAllfriends(data);
            setFriends(data);
            console.log(data)

        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        getFriends();
    },[])


    const forUpdatingProject = () =>{       

        if(projectData.currentProject){
            let getMembers = []
            let getMembersIds = []
            projectData.currentProject.members.map((element)=>{
                let findMember = projectData.allfriends.find(element1 => element1._id === element.memberRef)
                getMembersIds.push(findMember._id)
                let memberWithDesig = Object.assign(findMember, {designation: element.designation})
                getMembers.push(memberWithDesig)
            })
            // console.log(projectSelected)
            setMembersIds(getMembersIds)
            setMembers(getMembers)
            setUpdateProjectPhases(projectData.currentProject.projectPhases)

           
        }
       
    }

    useEffect(()=>{
        forUpdatingProject();
    },[projectData.currentProject])



    const handelDesigInput = (e) =>{
        let input = e.target.value

        setDesignationInput(input)

        console.log(designationInput)
    }



    const showSearchResult = () =>{

        if(txtInput === ""){
            // console.log("AA")
            setAllfriends(friends) 
        }
        else{
            let newList = allfriends.filter((element) =>{
                return element.name.toLowerCase().includes(txtInput.toLowerCase())
            })

            setAllfriends(newList) 
        }

        

    }


    useEffect(()=>{
        showSearchResult();
    },[txtInput])

    const handelChange = (e) =>{
        setTxtInput(e.target.value)
        // console.log(txtInput)
        showSearchResult();
    }


    

    const addMember = (e) =>{
        let id = e.target.id;

        if(projectData.currentProject){
            let getProfile = members.find(element => element._id === id);
            if(getProfile){
                projectData.currentProject.members.map((element)=>{
                    if(element.memberRef === id){
                        window.alert("Exisiting Member")
                    }
                })
            }
            else{
                let getProfile = projectData.allfriends.find(element => element._id === id);
        
            setMembersIds(membersIds => [...membersIds, getProfile._id])
    
            setMembers(members => [...members, getProfile])
    
    
            const newList = projectData.allfriends.filter(friendId => {
                return friendId._id !== id;
            })
            
            setAllfriends(newList) 
            }
           
           
        }
        else{
            let getProfile = projectData.allfriends.find(element => element._id === id);
        
            setMembersIds(membersIds => [...membersIds, getProfile._id])
    
            setMembers(members => [...members, getProfile])
    
    
            const newList = projectData.allfriends.filter(friendId => {
                return friendId._id !== id;
            })
            
            setAllfriends(newList)  
        }

             
        
    }

    const removeMember = (e) =>{
        let id = e.target.id;

        let getProfile = members.find(element => element._id === id);
        let getfriends = allfriends.find(element => element._id === id);

        if(!getfriends){
            console.log("done")
            setAllfriends(allfriends => [...allfriends, getProfile])
        }
        

        const newList = members.filter(friendId => {
            return friendId._id !== id;
        })

        const newIds = membersIds.filter(ids => {
            return ids !== id
        })
        setMembersIds(newIds)
        // console.log(newList)
        setMembers(newList)

    }




    const removeFile = (e) =>{
        let fileId = e.target.id;

        let removeSelectedFile = projectData.currentProject.projectFiles.filter(element1 => element1._id !== fileId)

        projectData.currentProject.projectFiles = removeSelectedFile

        // let listedFiles = document.getElementById("filesList")
        let selectedfile = document.getElementById("aa"+fileId)
        console.log(selectedfile)
        
        while (selectedfile.hasChildNodes()) {
            selectedfile.removeChild(selectedfile.firstChild);
        }
        // let x = listedFiles.removeChild(selectedfile);
        
    }

   

    const handleUpdateProject = async (e) =>{
        e.preventDefault();
        console.log(membersIds)
        let addDesig = []

        membersIds.map((membersIds)=>{
            let singleId = document.getElementById(membersIds)
            addDesig.push({memberRef: membersIds, designation: singleId.innerText})
        })

        let startDate = document.getElementById("startDate");
        let dueDate = document.getElementById("dueDate");
        let projectDiscription = document.getElementById("projectDiscription");
        let projectTitle = document.getElementById("projectTitle");
        let projectType = document.getElementById("projectType");
        
        
        let formData = new FormData();
        formData.append('projectTitle', projectTitle.value)
        formData.append('projectDiscription', projectDiscription.value)
        formData.append('startDate', startDate.value)
        formData.append('dueDate', dueDate.value)
        formData.append('projectType', projectType.value)
        formData.append('projectId', JSON.stringify(projectData.currentProject._id))
        formData.append('projectMembers', JSON.stringify(members))
        formData.append('projectDesig', JSON.stringify(addDesig))
        formData.append('existingFiles', JSON.stringify(projectData.currentProject.projectFiles))
        formData.append('projectPhases', JSON.stringify(updateProjectPhases))
        for(let i=0; i < projectFiles.length; i++){
            formData.append('projectFiles', projectFiles[i])
        }
        
        console.log(updateProjectPhases)

        if(updateProjectPhases.length > 0){
            try {
                const response = await fetch("/updatingProject", {
                    method: "POST",
                    body: formData
                      
                });
        
                const data = await response.json();
    
                if(response.status === 201 && data){
                    setAlertTitle("Alert");
                    setAlertMessage("Project Updated.");
                    setShowAlert(true);
                    projectData.setFecthTasks(data);
                }
                
            } catch (error) {
               console.log(error); 
            }
        }
        else{
            setAlertTitle("Alert")
            setAlertMessage("Please fill all the fields.");
            setShowAlert(true);
        }
        
       

    }

    const changeDesig = (e) =>{
        setDesigId(e.target.id )
        setDesigModal(true)
    }

    const handleDeisgBtn = () =>{
        console.log(designationInput)
        let desigTag = document.getElementById(desigId)
        desigTag.innerText = designationInput
        setDesigModal(false)
        // console.log(desigTag.innerText)
    }





   const handlePhasesInputInUpdate = (e) =>{
        const form = e.currentTarget;
        e.preventDefault();

        if(updateProjectPhases.length <= 9 && phaseInput){
            let checkPhase = updateProjectPhases.find(element1 => element1.PhaseTitle === phaseInput);
            if(checkPhase){
                setAlertTitle("Alert")
                setAlertMessage("Phase title already exist, Choose a different title.");
                setShowAlert(true);
            }
            else{
                if(phaseInput){
                    let phaseObj = {
                        PhaseTitle: phaseInput,
                        PhaseNum: ""
                    }
                    setUpdateProjectPhases(updateProjectPhases => [...updateProjectPhases, phaseObj])
                }
                else{
                    return;
                }  
            }
        }
        else{
            setAlertTitle("Alert")
            setAlertMessage("Please add minimum 1 or maximum 10 phases per project.");
            setShowAlert(true);
        }
        
        setPhaseInput("")
        form.reset();
    }


   const removePhaseInUpdate = (e) =>{
        let phaseName = e.target.id;
        let removeSelectedPhase = updateProjectPhases.filter(element1 => element1.PhaseTitle !== phaseName);
        setUpdateProjectPhases(removeSelectedPhase)
   }

      
   const editPhaseInUpdate = (e) =>{
        let phaseName = e.target.id;
        setPhaseEditInput(phaseName)
        setPhaseEditModalInUpdate(true)
   }


   const handlePhaseEditInUpdate = (e) =>{
        const form = e.currentTarget;
        e.preventDefault();
        console.log(phaseInput)

        let checkIndex;
        
        updateProjectPhases.map((element, index)=>{
            if(element.PhaseTitle === phaseEditInput){
                checkIndex = index;
            };
        });

        updateProjectPhases[checkIndex].PhaseTitle = phaseInput;

        setPhaseInput("")
        form.reset();
        setPhaseEditModalInUpdate(false)
   }

  return (
    <>
        
        
        <ListGroup.Item className='selectedListItem' onClick={handleShow}>
            <i className='fa fa-edit chat-icon'></i>         
            <br></br>
            Update Project
        </ListGroup.Item>
     
        <Modal show={show} fullscreen={fullscreen} onHide={handleHideModal}>
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title>Update Project</Modal.Title>
            </Modal.Header>
        <Modal.Body className='modalBody'>
            {projectData.currentProject ?
            
            <Form method='POST' className='contactForm' name='projectForm' id='projectForm'>
            <Container className='formCont'>
                <Row>
                    <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label className='formTxt'>Update Title</Form.Label>
                        <Form.Control type="text" name='projectTitle' className='formInput' id='projectTitle' defaultValue={projectData.currentProject.projectTitle} placeholder="Enter Task" />
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group className="mb-3 inputGroup" >
                        <Form.Label className='formTxt'>Type</Form.Label>
                        <Form.Select name='projectType' id='projectType' className='formInput' defaultValue={projectData.currentProject.projectType}>                
                            <option className='listOption' value='N/A'>N/A</option>               
                            <option className='listOption' value='Personal'>Personal</option>               
                            <option className='listOption' value='Team'>Team</option>              
                        </Form.Select>
                    </Form.Group>
  
                </Col>
                </Row>
                <Row>
                    <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Discription</Form.Label>
                        <Form.Control as="textarea" rows={3} name='projectDiscription' className='formInput' id='projectDiscription' defaultValue={projectData.currentProject.projectDiscription}/>
                    </Form.Group>
                    </Col>
                </Row>
                <Row>
                <Col>
                <Form.Group className="mb-3 inputGroup" >
                    <Form.Label className='formTxt'>Start Date</Form.Label>
                    <Form.Control type="date" name='startDate' id='startDate' className='formInput' defaultValue={projectData.currentProject.startDate.substring(0,10)} placeholder="date" />
                </Form.Group>
                </Col>
                <Col>
                <Form.Group className="mb-3 inputGroup" >
                    <Form.Label className='formTxt'>Due Date</Form.Label>
                    <Form.Control type="date" name='dueDate' id='dueDate' className='formInput' defaultValue={projectData.currentProject.dueDate.substring(0,10)} placeholder="date" />
                </Form.Group>
                </Col>
                
                </Row>
                <Row>
                    <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Add files</Form.Label>
                        <Form.Control type="file" multiple name='projectFiles' id='projectFiles' className='formInput' onChange={handleFiles}/>
                    </Form.Group>

                    {projectData.currentProject.projectFiles.length > 0 ?
                    <>
                    <Form.Label>Existing Files</Form.Label>
                    <ListGroup className="filesList" >
                        {projectData.currentProject.projectFiles.map((allfiles, index) =>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start singlefile"
                            key={index}
                            id={"aa"+allfiles._id}
                        >
                        <div className="ms-2 me-auto">
                        <div className="fw-bold">{allfiles.fileName}</div>
                        {Math.floor(allfiles.fileSize/1000000) + 'MB'}
                        </div>
                        
                        <i className="fa fa-trash phaseTrashBtn" id={allfiles._id} onClick={removeFile}></i>
                        
                        </ListGroup.Item>
                        )}
                    </ListGroup>
                    </>
                    :

                    <ListGroup>
                            <ListGroup.Item className='singlefile'>No Existing Files</ListGroup.Item>
                    </ListGroup>
                    }
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Col>
                        <Form.Label>Add Project Phases</Form.Label><Button className="addMembers" onClick={()=>setPhaseModaInUpdate(true)}><i className="fa fa-plus"></i></Button>
                        <ListGroup variant="flush" className='teamlist'>

                        {updateProjectPhases.map((element, index)=>
                            <ListGroup.Item as="li" key={index} className='phaseListItem'>
                                 <Container>
                                    <Row>
                                        <Col sm lg={8}> Phase {index + 1} {element.PhaseTitle}   </Col>
                                        <Col sm lg={2}>  <i className="fa fa-edit phaseEditBtn" id={element.PhaseTitle} onClick={editPhaseInUpdate}></i>  <br></br> </Col>
                                        <Col sm lg={2}> <i className="fa fa-trash phaseTrashBtn" id={element.PhaseTitle} onClick={removePhaseInUpdate}></i>     </Col>
                                    </Row>
                                </Container>     
                            </ListGroup.Item>
                        )}

                        </ListGroup>                
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Col>
                    <Form.Label>Add Team Members</Form.Label><Button className='addMembers' onClick={()=>setSmShow(true)}><i className="fa fa-plus"></i></Button>
                    <ListGroup variant="flush" className='teamlist'>
                        {members.map( (members, index) =>
                            <ListGroup.Item as="li" key={index}  className="d-flex justify-content-between align-items-start phaseListItem">
                                <Container>
                                <Row className="justify-content-md-center">
                                    <Col lg="3">
                                        <img 
                                            src={members.image}
                                            onError={(e)=>{e.target.onError = null; e.target.src = image_S1}}
                                            className="profileImages"
                                        />
                                    </Col>
                                    <Col lg="3">
                                        <h6>{members.name}</h6>
                                        
                                    </Col>
                                    <Col lg="4">
                                    {members.designation ?
                                        <p id={members._id} onClick={changeDesig} className="changeDesig">{members.designation}</p> 
                                    :
                                        <p id={members._id} onClick={changeDesig} className="changeDesig">Add Designation</p> 
                                    }                                   
                                    </Col>
                                    <Col lg="2">
                                        <i className="fa fa-trash phaseTrashBtn" id={members._id} onClick={removeMember}></i>
                                    </Col>
                                </Row>
                                </Container>
                            </ListGroup.Item>
                        )}

                        </ListGroup>
                        </Col>
                    </Row>
                    <br></br>
                    <Row className="justify-content-md-center">
                        <Col sm lg={5}>
                        <Button className='projectSubmitBtn' variant="primary" type="submit" onClick={handleUpdateProject}>
                            Update Project
                        </Button>
                        </Col>
                        
                    </Row>
                </Container>
            </Form>
            
            :
                <p>No selected Project</p>
            }
                
                <br></br>
                <br></br>
        </Modal.Body>
      </Modal>

      


      {/* Add Members */}

      <Modal size="sm" show={smShow} onHide={() => setSmShow(false)} aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="example-modal-sizes-title-sm">Add Members</Modal.Title>           
            </Modal.Header>
            <Modal.Body className='modalBody'>
                <Container>
                <Row >
                    <Col>
                        <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Search Members"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            value={txtInput}
                            onChange={handelChange}
                            className='formInput'
                        />
                    </InputGroup>

                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ListGroup variant="flush">
                        {allfriends.map( (allfriends, index) =>
                            <ListGroup.Item as="li" key={index}  className="d-flex justify-content-between align-items-start membersList" >
                                <Row>
                                    <Col>
                                        <img 
                                            src={allfriends.image}
                                            onError={(e)=>{e.target.onError = null; e.target.src = image_S1}}
                                            className="profileImages"
                                        />
                                    </Col>
                                    <Col>
                                        <p>{allfriends.name}</p>
                                    </Col>
                                    <Col>
                                    <i className="fa fa-plus addFriendIcon" id={allfriends._id} onClick={addMember}></i>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )}
                        </ListGroup>
                    </Col>
                </Row>
                </Container>
            </Modal.Body>
            </Modal>



                            {/* Changing Designation */}

            <Modal size="sm" show={desigModal} onHide={() => setDesigModal(false)} aria-labelledby="example-modal-sizes-title-sm">
              <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="example-modal-sizes-title-sm">
                    Add Designation
                </Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                <Container>
                <Row >
                    <Col>

                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Enter Designation"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            className='formInput'
                            onChange={handelDesigInput}
                        />
                        <Button variant="outline-secondary" className='searchBtn' id="button-addon2" onClick={handleDeisgBtn}>
                            <i className="fa fa-plus"></i>
                        </Button>
                        </InputGroup>
                    </Col>
                </Row>
                </Container>
            </Modal.Body>
            </Modal>



                      

            
                {/* Phase Modal In Update*/}


            <Modal size="sm" show={phaseModaInUpdate} onHide={() => setPhaseModaInUpdate(false)} aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header closeButton className='modalHeader'>
            <Modal.Title id="example-modal-sizes-title-sm">
                Project Phases
            </Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBody'>
                <Container>
                    <p>You can only add 1 to 10 phases per project.</p>
                    <Form noValidate  onSubmit={handlePhasesInputInUpdate}>
                        <Form.Group  controlId="validationCustom01">
                            <Form.Label>Phase Title</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Phase Title"
                                onChange={(e)=>setPhaseInput(e.target.value)} 
                                isValid={phaseInput}
                                className="formInput"
                            />
                            <Form.Control.Feedback type="invalid">
                                Invalid Input
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br></br>
                        <Button type="submit" className='phaseBtn'>
                            <i className="fa fa-plus"></i>
                        </Button>
                    </Form>
                </Container>
            </Modal.Body>
            </Modal>




             {/* Phase Edit Modal In Update*/}

             <Modal size="sm" show={phaseEditModalInUpdate} onHide={() => setPhaseEditModalInUpdate(false)} aria-labelledby="example-modal-sizes-title-sm">
               <Modal.Header closeButton className='modalHeader'>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Edit Phases
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                <Container>
                    <Form noValidate  onSubmit={handlePhaseEditInUpdate}>
                        <Form.Group  controlId="validationCustom01">
                            <Form.Label>Phase Title </Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Phase Title"
                                defaultValue={phaseEditInput}
                                onChange={(e)=>setPhaseInput(e.target.value)} 
                                isValid={phaseInput}
                                className="formInput"
                            />
                            <Form.Control.Feedback type="invalid">
                                Invalid Input
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br></br>
                        <Button type="submit" className='saveBtnPhase'>
                            Save Changes
                        </Button>
                    </Form>
                </Container>
                </Modal.Body>
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

export default UpdateProject