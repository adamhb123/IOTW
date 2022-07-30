import { OidcUserStatus, useOidcUser } from "@axa-fr/react-oidc";
import React from "react";
import { Container } from "reactstrap";
export interface AuthVerifierProps {
  children: React.ReactNode;
}

interface RedirectDOM extends Document {
  redirectCountdown?: number;
  redirectInterval?: NodeJS.Timer;
}

export interface UnauthenticatedDisplayProps {
  redirectCountdown: number;
}

export const UnauthenticatedDisplay = (props: UnauthenticatedDisplayProps) => {
  return (
    <Container>
      <h1>
        {`You must be logged in to view this page, redirecting in \
        ${props.redirectCountdown} seconds`}
      </h1>
    </Container>
  );
};

export const AuthVerifier: React.FunctionComponent<AuthVerifierProps> = (
  props: AuthVerifierProps
) => {
  const { oidcUserLoadingState } = useOidcUser();
  const dom = document as RedirectDOM;
  if(!dom.redirectCountdown) dom.redirectCountdown = 5;
  const [renderTrigger, setRenderTrigger] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (!dom.redirectInterval) {
      dom.redirectInterval = setInterval(() => {
        if (dom.redirectCountdown) {
          dom.redirectCountdown -= 1;
          setRenderTrigger(renderTrigger => !renderTrigger);
          if (dom.redirectCountdown <= 0) window.location.assign("/");
        }
      }, 1000);
    }
  }, [renderTrigger]);
  return oidcUserLoadingState === OidcUserStatus.Unauthenticated ? (
    <UnauthenticatedDisplay redirectCountdown={dom.redirectCountdown} />
  ) : (
    <>{props.children}</>
  );
};

export default AuthVerifier;
