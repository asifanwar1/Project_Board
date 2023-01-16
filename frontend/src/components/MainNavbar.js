import React, {useState, useLayoutEffect, useEffect} from 'react'
import '../stylesheets/navbar.css'
import { Row, Col,Container, Navbar, Nav, NavDropdown, Form, Image, Button, ListGroup, Offcanvas, InputGroup, Modal } from 'react-bootstrap';
import Todos from "./Todos";
import SearchMembers from './SearchMembers';
import Messages from './Messages';
import { UserContext } from '../App'
import DisplayProjects from './DisplayProjects';
import Eventscalendar from './Eventscalendar';
import MyNotes from './MyNotes';
import Profile from './Profile';
import Notifications from './Notifications';

const MainNavbar = () => {

    return (
  
      <Navbar expand="md" fixed="top"  className='navbarMain'>
        <Container>
          <Navbar.Brand className='title' href="#home">ProjectBoard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className='toggleBtn1'/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto navItems">
              <Nav.Link href="#todos" className='navLinks'><Todos/></Nav.Link>
              <Nav.Link href="#todos" className='navLinks'><MyNotes/></Nav.Link>
              <Nav.Link href="#projects" className='navLinks'><DisplayProjects/></Nav.Link>
              <Nav.Link href="#messages" className='navLinks'><Messages/></Nav.Link>
              <Nav.Link href="#calendar" className='navLinks'><Eventscalendar/></Nav.Link>
              <Nav.Link href="#searchMembers" className='navLinks'><Notifications/></Nav.Link>         
              <Nav.Link href="#searchMembers" className='navLinks'><Profile/></Nav.Link>         
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    )
}

export default MainNavbar
