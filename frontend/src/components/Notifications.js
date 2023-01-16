import React, {useState, useEffect, useContext} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import '../stylesheets/notifications.css'
import { Row, Col, Container, InputGroup, Button, Modal, FormControl, ListGroup, Badge } from 'react-bootstrap';
import SearchMembers from './SearchMembers';
import image_S1 from '../images/abstract10.png'

const Notifications = () => { 

    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const handleShow = () => {setFullscreen(true); setShow(true);}
    const [senderProfiles, setSenderProfiles] = useState([]);
    const [receiverProfiles, setReceiverProfiles] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const handleAlertClose = () =>{setShowAlert(false);}
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [fetchData, setFetchData] = useState();


    const requestSentBYMe = async () =>{
      try {
          const response = await fetch('/requestSentBYMe', { 
              method: 'GET',
          })

          const data = await response.json();
          console.log(data)
          setReceiverProfiles(data);

      } catch (error) {
          console.log(error)
      }
  }



    const getRequest = async () =>{
        try {
            const response = await fetch('/getRequest', { 
                method: 'GET',
            })

            const data = await response.json();
            console.log(data)
            setSenderProfiles(data);
            // console.log(senderProfiles)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getRequest();
        requestSentBYMe();
    },[fetchData])


    const handleAcceptBtn = async (e) =>{
        let personId = e.target.id;
        try {
          const response = await fetch('/acceptRequest', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json' 
            },
            body: JSON.stringify({personId}),
            // body: searchInput
        })

        let data = await response.json();

        if(response.status === 201 && data){
          setAlertTitle("Alert");
          setAlertMessage(data.message);
          setShowAlert(true);
          setFetchData(data)
        }
          
      } catch (error) {
        console.log(error)    
      }
        
    }



    const handleCancelRequest = async (e) =>{
      let personId = e.target.id;
      try {
        const response = await fetch('/cancelRequest', {
          method: 'POST',
          headers: {
              'Content-Type' : 'application/json' 
          },
          body: JSON.stringify({personId}),
          // body: searchInput
      })

      let data = await response.json();

      if(response.status === 201 && data){
        setAlertTitle("Alert");
        setAlertMessage(data.message);
        setShowAlert(true);
        setFetchData(data)
      }
        
    } catch (error) {
      console.log(error)    
    }

    }

    const handleRefreshCompnent = () =>{
      getRequest();
    }


  return (
    <>
      <ListGroup.Item className='navList' onClick={handleShow}>
        <i className='fa fa-search'>&nbsp;</i>         
        {' '}
        Members
      </ListGroup.Item>

      <Modal show={show} fullscreen={fullscreen} onHide={()=>setShow(false)} aria-labelledby="example-modal-sizes-title-sm">
        <Modal.Header closeButton className='modalHeader'>
          <Container>
            <Row className="justify-content-md-center">
              <Col sm lg="5">
                <Modal.Title>Notifications</Modal.Title>
                <br></br>
              </Col>
              <Col sm lg="6">
                <Container><SearchMembers props={{setFetchData}}/></Container>  
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
              <Row>
                <Container>
                  <Row className="justify-content-md-center">
                      {senderProfiles.map( (senderProfiles, index) =>
                        <Col sm lg="4" key={index}>
                          <ListGroup.Item as="li" key={index}  className="profileMessages">
                            <img 
                              src={senderProfiles.image}
                              onError={(e)=>{e.target.onError = null; e.target.src = image_S1}}
                              className="profileImages"
                            />
                            <br></br>
                            <b>{senderProfiles.name}</b>
                            <br></br>
                            <br></br>
                            <Button id={senderProfiles._id} bg="primary" className="sendRequestBtn" onClick={handleAcceptBtn}>
                              Accept Request
                            </Button>
                          </ListGroup.Item>
                        </Col>
                      )}
                      {receiverProfiles.map( (receiverProfiles, index) =>
                        <Col sm lg="4" key={index}>
                          <ListGroup.Item as="li" key={index}  className="profileMessages">
                            <img 
                              src={receiverProfiles.image}
                              onError={(e)=>{e.target.onError = null; e.target.src = image_S1}}
                              className="profileImages"
                            />
                            <br></br>
                            <b>{receiverProfiles.name}</b>
                            <br></br>
                            <br></br>
                            <Button id={receiverProfiles._id} bg="primary" className="sendRequestBtn" onClick={handleCancelRequest}>
                              Cancel Request
                            </Button>
                          </ListGroup.Item>
                        </Col>
                      )}
                  </Row>
                </Container>
              </Row>
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

export default Notifications