import { Container } from "reactstrap";
import { SubmissionCarousel } from "../../components/SubmissionCarousel"

const Home: React.FunctionComponent = () => {
  return (
    <Container>
      <SubmissionCarousel maxItemCount={5}/>
    </Container>
  );
}

export default Home;
