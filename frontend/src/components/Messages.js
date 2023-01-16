import React, {useState, useEffect, useContext} from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import '../stylesheets/messages.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col,Container, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';
import image_S1 from '../images/abstract10.png'
import image_S2 from '../images/abstract1.png'
import { UserContext } from '../App'
import io from "socket.io-client";
import DeleteMember from './DeleteMember';

const ENDPOINT = "http://localhost:5000"
var socket, currentChat;

const Messages = () => {

    const {state, dispatch} = useContext(UserContext);
    const [smShow, setSmShow] = useState(false);
    const [smShowGroup, setSmShowGroup] = useState(false);
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const handleShow = () => {setFullscreen(true); setShow(true);}
    const [lgShow, setLgShow] = useState(false);
    const [lgShowGroup, setLgGroupShow] = useState(false);
    const [groupChats, setGroupChats] = useState([]);
    const [allfriends, setAllfriends] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [txtInput, setTxtInput] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const [userConnection, setUserConnection] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState("");
    const [senderchatId, setSenderChatId] = useState("");
    const [notification, setNotification] = useState([]);
    const userProfile = JSON.parse(localStorage.getItem("User")); 

    const handleHideSelectionModal = () =>{
        setSmShow(false);
    }

    const handleHideSelectionModalGroup = () =>{
        setSmShowGroup(false);
    }


    const getAllChats = async () =>{
        try {
            const response = await fetch('/allGroupChats', {
                method: 'GET',
            })

            const data = await response.json();
            console.log(data)
            setGroupChats(data);

        } catch (error) {
            console.log(error)
        }

    }
    
    

    const getFriends = async () =>{
        try {
            const response = await fetch('/getFriends', {
                method: 'GET',
            })

            const data = await response.json();
            console.log(data)
            setAllfriends(data);
            // console.log(senderProfiles)

        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        getFriends();
        getAllChats();
        socket = io(ENDPOINT);
        socket.emit("setUser", userProfile);
        socket.on("User Connected", () => setUserConnection(true));
    },[])


    const handleRefreshCompnent = () =>{
        getFriends();
        getAllChats();
    }



    const handleGroupClick = async (e) =>{
        // console.log(e.target.id)
        setSelectedId(e.target.id)
        let selectedId = e.target.id;
        // console.log(e.target.id)
        setSmShowGroup(true);

        try { 
            const response = await fetch('/getAllGroupMsgs', {  
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' 
                },
                body: JSON.stringify({selectedId}),
            });

            const data = await response.json();
            let getMessages = data.getAllMessages;
            let getChat = data.chatExist;
            setSelectedChatId(getChat._id);
            setAllMessages(getMessages);

            socket.emit("joinSelectedChat", getChat._id);


        } catch (error) {
            console.log(error)
        }  
        
    }



    const handleClick = async (e) =>{
        // console.log(e.target.id)
        setSelectedId(e.target.id)
        let selectedId = e.target.id;
        // console.log(e.target.id)
        setSmShow(true);

        try {
            const response = await fetch('/getAllMsgs', {  
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' 
                },
                body: JSON.stringify({selectedId}),
            });

            const data = await response.json();
            let getMessages = data.getAllMessages;
            let getChat = data.chatExist;
            setSelectedChatId(getChat._id);
            setAllMessages(getMessages);

            socket.emit("joinSelectedChat", getChat._id);


        } catch (error) {
            console.log(error)
        }  
        
    }



    // const handelChange = (e) =>{setTxtInput(e.target.value)}

    const handleKeyDown = async (e) =>{
        if(e.keyCode === 13 && selectedId){
            try {
                const response = await fetch('/sendingMsg', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({selectedId, txtInput}),
                    // body: searchInput
                })
                
                let data = await response.json();
               
                setSenderChatId(data.newMessage.ChatId)
                socket.emit("sendingMessage", data)
    
            } catch (error) {
                console.log(error)
            }
        }
        
    }

    const handleSendBtn = async () =>{

        try {
            const response = await fetch('/sendingMsg', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' 
                },
                body: JSON.stringify({selectedId, txtInput}),
                // body: searchInput
            })
            
            let data = await response.json();
           
            setSenderChatId(data.newMessage.ChatId)
            socket.emit("sendingMessage", data)

        } catch (error) {
            console.log(error)
        }
    }


    const handleKeyDownGroup = async (e) =>{
        if(e.keyCode === 13 && selectedId){
            try {
                const response = await fetch('/sendingGroupMsg', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({selectedId, txtInput}),
                    // body: searchInput
                })
                
                let data = await response.json();
               
                setSenderChatId(data.newMessage.ChatId)
                socket.emit("sendingMessage", data)
    
            } catch (error) {
                console.log(error)
            }
        }
        
    }

    const handleSendGroupBtn = async () =>{
        try {
            const response = await fetch('/sendingGroupMsg', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' 
                },
                body: JSON.stringify({selectedId, txtInput}),
                // body: searchInput
            })
            
            let data = await response.json();
           
            setSenderChatId(data.newMessage.ChatId)
            socket.emit("sendingMessage", data)

        } catch (error) {
            console.log(error)
        }
    }
 


    useEffect(() => {
        currentChat = selectedChatId

    }, [selectedChatId])

    useEffect(() => {
        socket.on("messageRecieved", (newMessage) =>{
            console.log(newMessage)    
            if(!currentChat || currentChat !== newMessage.ChatId){
                console.log(newMessage)
                setNotification(notification => [newMessage, ...notification]);
                socket.off("messageRecieved");
                console.log(notification)
            } 
            else{  
            setAllMessages(allMessages => [...allMessages, newMessage]);
            socket.off("messageRecieved");
            }
        });
        console.log(allMessages)
        
    },[])



  return (
    <>
          
        <ListGroup.Item className='navList' onClick={handleShow}>
            <i className='far fa-comments'>&nbsp;</i>         
            {' '}
            Chat Box 
        </ListGroup.Item>
       
     
        <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title>Chat Box</Modal.Title>
                <Button className='refreshBtn' onClick={handleRefreshCompnent}><i className="material-icons refreshIcon">refresh</i></Button>
            </Modal.Header>
        <Modal.Body className='modalBody'>
            <Container>
                <Row className="justify-content-md-center">
                    {allfriends.map( (allfriends, index) =>
                        <Col sm lg="3" key={index}>
                            <ListGroup.Item as="li"  id={allfriends._id} onClick={handleClick} className="profileMessages">
                                <img 
                                    src={allfriends.image}
                                    id={allfriends._id}
                                    onClick={handleClick}
                                    onError={(e)=>{e.target.onError = null; e.target.src = image_S1}}
                                    className="profileImages"
                                />
                                <br></br>
                                <b>{allfriends.name}</b>
                            </ListGroup.Item>
                            <br></br>
                        </Col>
                    )}
                    {groupChats.map( (element, index) =>
                        <Col sm lg="3" key={index}>
                            <ListGroup.Item as="li"  id={element._id} onClick={handleGroupClick} className="profileMessages">
                                <img 
                                    src={image_S2}
                                    id={element._id}
                                    onClick={handleGroupClick}
                                    onError={(e)=>{e.target.onError = null; e.target.src = image_S1}}
                                    className="profileImages"
                                />
                                <br></br>
                                <b>{element.groupName}</b>
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
                    Choose For Selected Member
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBody'>

                <ListGroup.Item className='selectedListItem' onClick={() => setLgShow(true)}>
                    <i className='far fa-comments'></i>         
                    <br></br>
                    Start Chat
                </ListGroup.Item>

                <br></br>

                <DeleteMember/>

            </Modal.Body>
        </Modal>



      <Modal size="lg" show={lgShow} onHide={() => setLgShow(false)} backdrop="static" keyboard={false} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton className='modalHeader'>
          <Modal.Title id="example-modal-sizes-title-lg">
            Chat
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='modalBodyMsg'>
            {selectedId ?
                <Container>  
                    <ListGroup>                 
                    {allMessages.map( (allMessages, index) =>                              
                        <ListGroup.Item className={allMessages.sender === state.id ? "myMsgs" : "otherMsgs"} key={index}>
                            <p className='msgtxt'> {allMessages.message}</p> 
                        </ListGroup.Item>                        
                    )}
                    </ListGroup>
                </Container>
            :
                <Container></Container>
            }
        </Modal.Body>
        <Modal.Footer className='modalFooter'>
            {selectedId ?
                <Container>        
                    <InputGroup className="mb-3">
                        <Form.Control placeholder="Message" className='formInput' value={txtInput} onChange={(e) => setTxtInput(e.target.value)} onKeyDown={handleKeyDown} />
                        <Button variant="outline-secondary" className='searchBtn' id="button-addon2" onClick={handleSendBtn}>
                            <i className="fa fa-paper-plane"></i>
                        </Button>
                    </InputGroup>
                </Container>
            :
                <Container></Container>
            }
        </Modal.Footer>
      </Modal>








      <Modal size="sm" show={smShowGroup} onHide={handleHideSelectionModalGroup} aria-labelledby="example-modal-sizes-title-sm" >
            <Modal.Header closeButton className='modalHeader'>
                <Modal.Title id="example-modal-sizes-title-sm" className='titleSelection'>
                    Choose For Selected Group
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBody'>

                <ListGroup.Item className='selectedListItem' onClick={() => setLgGroupShow(true)}>
                    <i className='far fa-comments'></i>         
                    <br></br>
                    Start Chat
                </ListGroup.Item>

                <br></br>

                <DeleteMember/>

            </Modal.Body>
        </Modal>

            {/* group chat */}

      <Modal size="lg" show={lgShowGroup} onHide={() => setLgGroupShow(false)} backdrop="static" keyboard={false} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton className='modalHeader'>
          <Modal.Title id="example-modal-sizes-title-lg">
            Chat
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='modalBodyMsg'>
            {selectedId ?
                <Container>  
                    <ListGroup>                 
                    {allMessages.map( (allMessages, index) =>                              
                        <ListGroup.Item className={allMessages.sender === state.id ? "myMsgs" : "otherMsgs"} key={index}>
                            <p className='msgtxt'> {allMessages.message}</p> 
                        </ListGroup.Item>                        
                    )}
                    </ListGroup>
                </Container>
            :
                <Container></Container>
            }
        </Modal.Body>
        <Modal.Footer className='modalFooter'>
            {selectedId ?
                <Container>        
                    <InputGroup className="mb-3">
                        <Form.Control placeholder="Message" className='formInput' value={txtInput} onChange={(e) => setTxtInput(e.target.value)} onKeyDown={handleKeyDownGroup} />
                        <Button variant="outline-secondary" className='searchBtn' id="button-addon2" onClick={handleSendGroupBtn}>
                            <i className="fa fa-paper-plane"></i>
                        </Button>
                    </InputGroup>
                </Container>
            :
                <Container></Container>
            }
        </Modal.Footer>
      </Modal>
    

    </>
  )
}

export default Messages