import { Container } from "reactstrap";
import UploadCarousel from "../../components/UploadCarousel";

const Home: React.FunctionComponent = () => {
  return (
    <Container>
      <UploadCarousel maxItemCount={5} />
    </Container>
  );
};

export default Home;
