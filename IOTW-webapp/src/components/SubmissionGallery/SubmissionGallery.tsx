import React from "react";
import ReactPaginate from "react-paginate";
import {
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
// import { useOidcUser } from "@axa-fr/react-oidc";
import Logger from "easylogger-ts";
import SubmissionCard from "./SubmissionCard";
import APIMiddleware, {
  Direction,
  UploadsResponseStructure,
  SortedBy,
} from "../../misc/APIMiddleware";
import "./SubmissionGallery.scss";
import Config from "../../misc/config";
import SubmissionFullOverlay from "../SubmissionFullOverlay";
const SUBFETCH_INTERVAL_MS = 5000;
let LAST_SUBFETCH_SUCCESSFUL = false;
let SUBFETCH_ATTEMPT_COUNT = 0;

const SubFetchFailure = () => <></>;

const Items = (props: { currentItems: UploadsResponseStructure[] }) => {
  const toggleShowFullOverlayOnClick = (src: string) => {
    const dom = document as any;
    dom.setSubmissionFullOverlaySrc(src);
    dom.setSubmissionFullOverlayVisible(!dom.submissionFullOverlayVisible);
  };
  return (
    <>
      {props.currentItems &&
        props.currentItems.map((item: UploadsResponseStructure) => {
          const fullOverlaySrc = Config.api.storeSubmissionsLocally
            ? APIMiddleware.formatSlackImageSrc(item.apiPublicFileUrl)
            : APIMiddleware.formatSlackImageSrc(
                item.imageUrl,
                item.imageMimetype
              );
          return (
            <SubmissionCard
              key={item.id}
              author={item.cshUsername}
              thumbnailUrl={item.thumbnailUrl}
              thumbnailMimetype={item.thumbnailMimetype}
              apiPublicFileUrl={item.apiPublicFileUrl}
              dootDifference={item.dootDifference}
              onClick={toggleShowFullOverlayOnClick.bind(null, fullOverlaySrc)}
            >
              Test f
            </SubmissionCard>
          );
        })}
    </>
  );
};

interface PaginatedItemProps {
  itemsPerPage: number;
  sortedBy?: SortedBy;
  direction?: Direction;
}
type PaginatedItemType = React.FunctionComponent<PaginatedItemProps>;
const PaginatedItems: PaginatedItemType = (props: PaginatedItemProps) => {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = React.useState<any>(null);
  const [pageCount, setPageCount] = React.useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = React.useState(0);
  const [items, setItems] = React.useState([] as UploadsResponseStructure[]);
  React.useEffect(() => {
    const subFetch = (sortedBy?: SortedBy, direction?: Direction) =>
      (async () => {
        const submissions = await APIMiddleware.getSubmissions(
          -1,
          sortedBy,
          direction
        );
        await Logger.log(
          await Logger.objectToPrettyString(submissions as Record<string, any>)
        );
        setItems(submissions);
        LAST_SUBFETCH_SUCCESSFUL = true;
      })().catch((err) => {
        Logger.error("Submission retrieval failed");
        LAST_SUBFETCH_SUCCESSFUL = false;
        SUBFETCH_ATTEMPT_COUNT++;
        const maxRetries = APIMiddleware.getMaxRetries();
        if (SUBFETCH_ATTEMPT_COUNT >= maxRetries) {
          Logger.error(
            `Reached max failed fetch limit (${maxRetries}). Refresh to try again.`
          );
          return;
        }
        setTimeout(subFetch, SUBFETCH_INTERVAL_MS);
      });
    const dom = document as any;
    if (!Object.prototype.hasOwnProperty.call(dom, "subFetch"))
      dom.subFetch = subFetch;
    subFetch();
  }, []);
  React.useEffect(() => {
    console.log(items);
    console.log(typeof items);

    const endOffset = itemOffset + props.itemsPerPage;
    Logger.log(`Items: ${items}`);
    Logger.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / props.itemsPerPage));
  }, [itemOffset, props.itemsPerPage, items]);

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * props.itemsPerPage) % items.length;
    Logger.debug(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} />
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={() => null}
        containerClassName="paginate-container"
      />
      {!LAST_SUBFETCH_SUCCESSFUL &&
      SUBFETCH_ATTEMPT_COUNT >= APIMiddleware.getMaxRetries() ? (
        <SubFetchFailure />
      ) : null}
    </>
  );
};

const SortDropdowns = () => {
  const [
    sortedByDropdownOpen,
    setSortedByDropdownOpen,
  ] = React.useState<boolean>(false);
  const sortedByDropdownToggle = () =>
    setSortedByDropdownOpen(!sortedByDropdownOpen);
  const sortedByDropdownItems = Object.values(
    APIMiddleware.SortedBy
  ).map((sortedBy) => (
    <DropdownItem onClick={() => setSelectedSort(sortedBy)}>
      {APIMiddleware.sortedByToString(sortedBy)}
    </DropdownItem>
  ));
  const [
    directionDropdownOpen,
    setDirectionDropdownOpen,
  ] = React.useState<boolean>(false);
  const directionDropdownToggle = () =>
    setDirectionDropdownOpen(!directionDropdownOpen);
  const directionDropdownItems = Object.values(
    APIMiddleware.Direction
  ).map((direction) => (
    <DropdownItem onClick={() => setSelectedDirection(direction)}>
      {APIMiddleware.directionToString(direction)}
    </DropdownItem>
  ));
  const [selectedSort, setSelectedSort] = React.useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = React.useState<
    string | null
  >(null);
  React.useEffect(() => {
    (async () => {
      const dom = document as any;
      if (Object.prototype.hasOwnProperty.call(dom, "subFetch")) {
        console.log("TEST");
        dom.subFetch(selectedSort, selectedDirection);
      }
    })();
  }, [selectedSort, selectedDirection]);
  return (
    <Container className="submission-gallery-dropdown-container">
      <Dropdown
        title="Sort By"
        isOpen={sortedByDropdownOpen}
        toggle={sortedByDropdownToggle}
        className="submission-gallery-dropdown"
      >
        <DropdownToggle caret>
          {selectedSort
            ? APIMiddleware.sortedByToString(selectedSort)
            : "Sort By"}
        </DropdownToggle>
        <DropdownMenu>{sortedByDropdownItems}</DropdownMenu>
      </Dropdown>
      <Dropdown
        title="Direction"
        isOpen={directionDropdownOpen}
        toggle={directionDropdownToggle}
        className="submission-gallery-dropdown"
      >
        <DropdownToggle caret>
          {selectedDirection
            ? APIMiddleware.directionToString(selectedDirection)
            : "Direction"}
        </DropdownToggle>
        <DropdownMenu>{directionDropdownItems}</DropdownMenu>
      </Dropdown>
    </Container>
  );
};

type SubmissionGalleryProps = { userOnly: boolean; title: string };

const SubmissionGallery: React.FunctionComponent<SubmissionGalleryProps> = (
  props: SubmissionGalleryProps
) => (
  <Container id="submission-gallery">
    <SubmissionFullOverlay src={""} />
    <div id="submission-gallery-header">
      <h1>{props.title}</h1>
      <hr className="my-1"/>
      <SortDropdowns />
    </div>
    <div id="submissions-container">
      <PaginatedItems itemsPerPage={16} />
    </div>
  </Container>
);

export default SubmissionGallery;
