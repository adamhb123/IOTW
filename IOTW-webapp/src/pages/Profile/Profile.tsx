import React from "react";
import { Container } from "reactstrap";
import { OidcUserStatus, useOidcUser } from "@axa-fr/react-oidc";

import AuthVerifier from "../../components/AuthVerifier";
import "./Profile.scss";
// interface ProfileStandardClaims {
//   /** End-User's full name */
//   name?: string;
//   /** Given name(s) or first name(s) of the End-User */
//   given_name?: string;
//   /** Surname(s) or last name(s) of the End-User */
//   family_name?: string;
//   /** Middle name(s) of the End-User */
//   middle_name?: string;
//   /** Casual name of the End-User that may or may not be the same as the given_name. */
//   nickname?: string;
//   /** Shorthand name that the End-User wishes to be referred to at the RP, such as janedoe or j.doe. */
//   preferred_username?: string;
//   /** URL of the End-User's profile page */
//   profile?: string;
//   /** URL of the End-User's profile picture */
//   picture?: string;
//   /** URL of the End-User's Web page or blog */
//   website?: string;
//   /** End-User's preferred e-mail address */
//   email?: string;
//   /** True if the End-User's e-mail address has been verified; otherwise false. */
//   email_verified?: boolean;
//   /** End-User's gender. Values defined by this specification are female and male. */
//   gender?: string;
//   /** End-User's birthday, represented as an ISO 8601:2004 [ISO8601‑2004] YYYY-MM-DD format */
//   birthdate?: string;
//   /** String from zoneinfo [zoneinfo] time zone database representing the End-User's time zone. */
//   zoneinfo?: string;
//   /** End-User's locale, represented as a BCP47 [RFC5646] language tag. */
//   locale?: string;
//   /** End-User's preferred telephone number. */
//   phone_number?: string;
//   /** True if the End-User's phone number has been verified; otherwise false. */
//   phone_number_verified?: boolean;
//   /** object 	End-User's preferred address in JSON [RFC4627] */
//   address?: OidcAddress;
//   /** Time the End-User's information was last updated. */
//   updated_at?: number;
// }

const Profile = () => {
  const { oidcUser } = useOidcUser();
  const userData = {
    cshUsername: oidcUser?.preferred_username,
    fullname: oidcUser?.name,
    avatarUrl:
      `https://profiles.csh.rit.edu/image/${oidcUser?.preferred_username}` ||
      oidcUser?.picture,
    email: oidcUser?.email,
  };
  return (
    <AuthVerifier>
      <Container id="profile-container">
        <div id="user-information-container">
          <img
            id="user-avatar"
            className="rounded-circle"
            src={userData.avatarUrl}
            alt="user avatar"
            aria-hidden={true}
          />
          <div id="user-information">
            <span id="user-csh-username">User: {userData.cshUsername}</span>
            <hr className="my-1" />
            <span id="user-fullname">Full name: {userData.fullname}</span>
            <span id="user-email">
              Email: <a href={`mailto:${userData.email}`}>{userData.email}</a>
            </span>
          </div>
        </div>
      </Container>
    </AuthVerifier>
  );
};

export default Profile;
