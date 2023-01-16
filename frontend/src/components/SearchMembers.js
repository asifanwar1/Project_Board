import React, {useState, useEffect, useContext} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import '../stylesheets/searchMembers.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, InputGroup, Button, Modal, FormControl, ListGroup, Badge } from 'react-bootstrap';
import image_S1 from '../images/abstract10.png'
import { UserContext } from '../App'

const SearchMembers = ({props}) => {
    const {state, dispatch} = useContext(UserContext);  
    const [showAlert, setShowAlert] = useState(false);
    const handleAlertClose = () =>{setShowAlert(false);}
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [show, setShow] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [allfriends, setAllfriends] = useState([]);

    
    
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

    useEffect(() => {
        getFriends();
    },[])


    const handelChange = (e) =>{
        setSearchInput(e.target.value)
        // console.log(e.target.value)
    }

    const handleKeyDown = async (e) =>{
        

        if(e.keyCode === 13 && searchInput){

            try {
                const response = await fetch('/searchBar', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({searchInput}),
                })
                
                let data = await response.json();
                if(response.status === 201 && data.length > 0){
                    setSearchResult(data);
                } 
                else{
                    setAlertTitle("Alert");
                    setAlertMessage("No matches found.");
                    setShowAlert(true);
                }             
                
            } catch (error) {
                console.log(error);
            }
            
        }

    }

    const handleSearchBtn = async () =>{
        
        try {
            const response = await fetch('/searchBar', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' 
                },
                body: JSON.stringify({searchInput}),
            })
            
            let data = await response.json();
            if(response.status === 201 && data.length > 0){
                setSearchResult(data);
            } 
            else{
                setAlertTitle("Alert");
                setAlertMessage("No matches found.");
                setShowAlert(true);
            } 
        } catch (error) {
            console.log(error);
        }
        
    }


    const compareIds = () =>{
        let selfBtn = document.getElementById(state.id)
        
        if(selfBtn){
            selfBtn.textContent = 'Own Profile';
            selfBtn.disabled = true;
        }

        allfriends.map((element)=>{
            let friendBtn = document.getElementById(element._id)
            if(friendBtn){
                friendBtn.textContent = 'Member Exist';
                friendBtn.disabled = true;
            }
        })
    }

    useEffect(()=>{
        compareIds();
    },[searchResult])
   

    const handleRequestBtn = async (e) =>{
        let personId = e.target.id;        
       
        try {
            const response = await fetch('/sendingRequest', {
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
                props.setFetchData(data);
                setShow(false);
                setSearchInput("");
                setSearchResult([]);
            }
            else{
                setAlertTitle("Alert");
                setAlertMessage(data.message);
                setShowAlert(true); 
            }
            
        } catch (error) {
            console.log(error)
        }

    }



    const handleCoseModal = () =>{
        setShow(false);
        setSearchInput("");
        setSearchResult([]);
    }
 
  return (
    <>

        <ListGroup.Item className='newProjectBtn' onClick={() => setShow(true)}>    
            <i className='fa fa-search'></i>
            {' '}
            Find Members      
        </ListGroup.Item>

        <Modal show={show} onHide={handleCoseModal}>
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title>Find Members</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBody'>
                <Row>    
                    <Col>
                        <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Find Members"
                            type="text"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            value={searchInput}
                            className='formInput'
                            onChange={handelChange}
                            onKeyDown={handleKeyDown}
                        />
                        <Button variant="outline-secondary" className='searchBtn' id="button-addon2" onClick={handleSearchBtn}>
                            <i className="fa fa-search searchIcon"></i>
                        </Button>
                        </InputGroup>
                    </Col>
                </Row>

                <Row>
                <Col>
                  <ListGroup as="ol" variant="flush" >
                    {searchResult.map( (searchResult, index) =>
                      <ListGroup.Item as="li" key={index}  className="d-flex justify-content-between align-items-start memberLists">
                        <Row>
                            <Col>
                                <img src={searchResult.image}
                                    onError={(e)=>{e.target.onError = null; e.target.src = image_S1}}
                                    className="profileImages"
                                />
                                <h5>{searchResult.name}</h5>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button id={searchResult._id} className='sendRequestBtn'  bg="primary" onClick={handleRequestBtn}>
                                    Send Request
                                </Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    )}
                  </ListGroup>
                </Col>
              </Row>
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

export default SearchMembers