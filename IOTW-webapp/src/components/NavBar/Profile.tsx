import { OidcUserStatus, useOidc, useOidcUser } from "@axa-fr/react-oidc";
import React from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import "./Profile.scss";

export const Profile: React.FunctionComponent = () => {
  const { login, logout, isAuthenticated } = useOidc();
  const onLogin: React.MouseEventHandler<HTMLAnchorElement> = (event: React.MouseEvent<HTMLAnchorElement>) => {
    console.log("Logging in...");
    login();
  }
  const onLogout: React.MouseEventHandler<HTMLAnchorElement> = (event: React.MouseEvent<HTMLAnchorElement>) => {
    console.log("Logging out...");
    logout();
  }
  const { oidcUser, oidcUserLoadingState } = useOidcUser();
  console.log(oidcUser);
  const name = oidcUser?.preferred_username || "Guest";
  const user_avatar_url = `https://profiles.csh.rit.edu/image/${
    oidcUser?.preferred_username || "potate"
  }`;
  let profile_dropdown = isAuthenticated ? (
    <>
      <DropdownItem>Your Submissions</DropdownItem>
      <DropdownItem>Settings</DropdownItem>
      <DropdownItem divider />
      <DropdownItem onClick={onLogout}>Logout</DropdownItem>
    </>
  ) : (
    <>
      <DropdownItem onClick={onLogin}>Login</DropdownItem>
    </>
  );
  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret className="navbar-user">
        <img
          id="user-avatar-image"
          className="rounded-circle"
          src={user_avatar_url}
          alt=""
          aria-hidden={true}
          width={32}
          height={32}
        />
        {name}
        <span className="caret" />
      </DropdownToggle>
      <DropdownMenu>{profile_dropdown}</DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default Profile;
