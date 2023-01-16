import React from 'react';
import "../stylesheets/sidebar.css"
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sidebarDiv'>
      <CDBSidebar className='sideBarMain' >
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: 'inherit' }}
          >
            Sidebar
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/" >
              <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/taskCategories" >
              <CDBSidebarMenuItem icon="table">Task Categories</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/teamManagement" >
              <CDBSidebarMenuItem icon="user">Team Management</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/messages" >
              <CDBSidebarMenuItem icon="chart-line">
                Messages
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/login" >
              <CDBSidebarMenuItem icon="chart-line">
                Login
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
            Sidebar Footer
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
