import React from "react";
import {
  Collapse,
  Nav,
  Navbar,
  NavbarToggler,
  NavItem,
  NavLink
} from "reactstrap";
import Profile from "./Profile";
import "./NavBar.scss";

export const NavBar: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Navbar id="navbar" dark expand="lg">
      <NavLink href="/" id="brand" className={"navbar-brand"}>
        <img id="csh-logo" src="/logo.svg"/>
        IOTW
      </NavLink>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav navbar>
          <NavItem>
              <NavLink href="/" className={"nav-link"}>
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/my-uploads" className={"nav-link"}>
                My Uploads
              </NavLink>
          </NavItem>
        </Nav>
        <Nav navbar className="ms-auto">
          <Profile />
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default NavBar;
