import { useOidc, useOidcUser } from "@axa-fr/react-oidc";
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

  const onLogin: React.MouseEventHandler<HTMLAnchorElement> = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    console.log("Logging in...");
    login();
  };
  const onLogout: React.MouseEventHandler<HTMLAnchorElement> = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    console.log("Logging out...");
    logout();
  };
  const { oidcUser, oidcUserLoadingState } = useOidcUser();
  console.log(oidcUser);
  const name = oidcUser?.preferred_username || "Guest";
  const userAvatarUrl = `https://profiles.csh.rit.edu/image/${
    oidcUser?.preferred_username || "potate"
  }`;
  const profileDropdown = isAuthenticated ? (
    <>
      <DropdownItem onClick={() => (window.location.assign("/profile"))}>
        Your Uploads
      </DropdownItem>
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
          id="user-avatar"
          className="rounded-circle"
          src={userAvatarUrl}
          alt="user avatar"
          aria-hidden={true}
          width={32}
          height={32}
        />
        {name}
        <span className="caret" />
      </DropdownToggle>
      <DropdownMenu>{profileDropdown}</DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default Profile;
