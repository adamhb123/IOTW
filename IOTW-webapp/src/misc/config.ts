import Logger from "easylogger-ts";
import { stringToPrimitive, PrimitiveTypeString } from "./utility";

const _parseEnvVar = (failureDefault: any, ...envVarNames: string[]) => {
  const desiredPrimitive = (typeof failureDefault) as PrimitiveTypeString;
  for (const envVarName of envVarNames) {
    const envVar = process.env[envVarName];
    if (typeof envVar !== "undefined") {
      return stringToPrimitive(envVar, desiredPrimitive);
    }
  }
  return failureDefault;
};

// SSO
const _CLIENT_ID = _parseEnvVar(
  "react-boilerplate",
  "REACT_APP_SSO_CLIENT_ID_OKD",
  "REACT_APP_SSO_CLIENT_ID"
);
const _CLIENT_SECRET = _parseEnvVar(
  "",
  "REACT_APP_SSO_CLIENT_SECRET_OKD",
  "REACT_APP_SSO_CLIENT_SECRET"
);
const _POST_LOGOUT_REDIRECT_URI = _parseEnvVar(
  "http://localhost:3000/",
  "REACT_APP_SITE_URL_OKD",
  "REACT_APP_SITE_URL"
);
const _AUTHORITY = _parseEnvVar(
  "https://sso.csh.rit.edu/auth/realms/csh",
  "REACT_APP_SSO_AUTHORITY_OKD",
  "REACT_APP_SSO_AUTHORITY"
);

export const Config = {
  webapp: {},
  api: {
    host: _parseEnvVar("localhost", "REACT_APP_IOTW_API_HOST_OKD", "REACT_APP_IOTW_API_HOST"),
    port: _parseEnvVar("3001", "REACT_APP_IOTW_API_PORT_OKD", "REACT_APP_IOTW_API_PORT"),
    storeSubmissionsLocally: _parseEnvVar(true, "REACT_APP_IOTW_API_STORE_SUBMISSIONS_LOCALLY_OKD", "REACT_APP_IOTW_API_STORE_SUBMISSIONS_LOCALLY"),
  },
  sso: {
    client_id: _CLIENT_ID,
    //client_secret: _CLIENT_SECRET,
    redirect_uri: `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ""
    }/authentication/callback`,
    //post_logout_redirect_uri: _POST_LOGOUT_REDIRECT_URI,
    scope: "openid profile email offline_access",
    authority: _AUTHORITY,
    silent_redirect_uri: `${window.location.protocol}//${
      window.location.hostname
    }${
      window.location.port ? `:${window.location.port}` : ""
    }/authentication/silent_callback`,
    service_worker_only: false,
  },
};
export default Config;
