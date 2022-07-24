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
import UploadCard from "./UploadCard";
import APIMiddleware from "../../misc/APIMiddleware";
import "./UploadGallery.scss";
import Config from "../../misc/config";
import UploadFullOverlay from "../UploadFullOverlay";
import IOTWShared from "iotw-shared";
import { useOidcUser } from "@axa-fr/react-oidc";

const SUBFETCH_INTERVAL_MS = 5000;
let LAST_SUBFETCH_SUCCESSFUL = false;
let SUBFETCH_ATTEMPT_COUNT = 0;

const UploadFetchFailure = () => <></>;

const Items = (props: {
  currentItems: IOTWShared.UploadsResponseStructure[];
}) => {
  const toggleShowFullOverlayOnClick = (src: string) => {
    const dom = document as IOTWShared.IOTWDOM;
    if (dom.setUploadFullOverlaySrc) dom.setUploadFullOverlaySrc(src);
    if (dom.setUploadFullOverlayVisible)
      dom.setUploadFullOverlayVisible(!dom.uploadFullOverlayVisible);
  };
  return (
    <>
      {props.currentItems &&
        props.currentItems.map((item: IOTWShared.UploadsResponseStructure) => {
          const fullOverlaySrc = Config.api.storeUploadsLocally
            ? APIMiddleware.formatSlackImageSrc(item.apiPublicFileUrl)
            : APIMiddleware.formatSlackImageSrc(
                item.imageUrl,
                item.imageMimetype
              );
          return (
            <UploadCard
              key={item.id}
              author={item.cshUsername}
              thumbnailUrl={item.thumbnailUrl}
              thumbnailMimetype={item.thumbnailMimetype}
              apiPublicFileUrl={item.apiPublicFileUrl}
              dootDifference={item.dootDifference}
              onClick={toggleShowFullOverlayOnClick.bind(null, fullOverlaySrc)}
            >
              Test f
            </UploadCard>
          );
        })}
    </>
  );
};

interface PaginatedItemProps {
  itemsPerPage: number;
  userOnly: boolean;
  uploadColumnID?: IOTWShared.UploadColumnID;
  direction?: IOTWShared.Direction;
}
type PaginatedItemType = React.FunctionComponent<PaginatedItemProps>;
const PaginatedItems: PaginatedItemType = (props: PaginatedItemProps) => {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = React.useState<any>(null);
  const [pageCount, setPageCount] = React.useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = React.useState(0);
  const [items, setItems] = React.useState(
    [] as IOTWShared.UploadsResponseStructure[]
  );
  const { oidcUser, oidcUserLoadingState } = useOidcUser();
  React.useEffect(() => {
    const uploadFetch = (
      sortedBy?: IOTWShared.UploadColumnID,
      direction?: IOTWShared.Direction
    ) =>
      (async () => {
        const uploads = props.userOnly
          ? await APIMiddleware.getUploadByColumnValue(
              IOTWShared.UploadColumnID.CSHUsername,
              oidcUser?.preferredUsername,
              null,
              sortedBy,
              direction
            )
          : await APIMiddleware.getUploads(null, sortedBy, direction);
        await Logger.log(
          await Logger.objectToPrettyString(uploads as Record<string, any>)
        );
        setItems(uploads);
        LAST_SUBFETCH_SUCCESSFUL = true;
      })().catch((err) => {
        console.error("Upload retrieval failed");
        LAST_SUBFETCH_SUCCESSFUL = false;
        SUBFETCH_ATTEMPT_COUNT++;
        const maxRetries = APIMiddleware.getMaxRetries();
        if (SUBFETCH_ATTEMPT_COUNT >= maxRetries) {
          console.error(
            `Reached max failed fetch limit (${maxRetries}). Refresh to try again.`
          );
          return;
        }
        setTimeout(uploadFetch, SUBFETCH_INTERVAL_MS);
      });
    const dom = document as IOTWShared.IOTWDOM;
    if (!Object.prototype.hasOwnProperty.call(dom, "uploadFetch"))
      dom.uploadFetch = uploadFetch;
    uploadFetch();
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
        <UploadFetchFailure />
      ) : null}
    </>
  );
};

const SortDropdowns = () => {
  const [uploadColumnIDDropdownOpen, setUploadColumnIDDropdownOpen] =
    React.useState<boolean>(false);
  const uploadColumnIDDropdownToggle = () =>
    setUploadColumnIDDropdownOpen(!uploadColumnIDDropdownOpen);
  const uploadColumnIDDropdownItems = Object.values(
    IOTWShared.UploadColumnID
  ).map((uploadColumnID) => (
    <DropdownItem onClick={() => setSelectedSort(uploadColumnID)}>
      {IOTWShared.uploadColumnIDToString(uploadColumnID)}
    </DropdownItem>
  ));
  const [directionDropdownOpen, setDirectionDropdownOpen] =
    React.useState<boolean>(false);
  const directionDropdownToggle = () =>
    setDirectionDropdownOpen(!directionDropdownOpen);
  const directionDropdownItems = Object.values(IOTWShared.Direction).map(
    (direction) => (
      <DropdownItem onClick={() => setSelectedDirection(direction)}>
        {IOTWShared.directionToString(direction)}
      </DropdownItem>
    )
  );
  const [selectedSort, setSelectedSort] = React.useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = React.useState<
    string | null
  >(null);
  React.useEffect(() => {
    (async () => {
      const dom = document as IOTWShared.IOTWDOM;
      if (Object.prototype.hasOwnProperty.call(dom, "uploadFetch")) {
        console.log("TEST");
        if (dom.uploadFetch)
          dom.uploadFetch(
            selectedSort as IOTWShared.UploadColumnID,
            selectedDirection as IOTWShared.Direction
          );
      }
    })();
  }, [selectedSort, selectedDirection]);
  return (
    <Container className="upload-gallery-dropdown-container">
      <Dropdown
        title="Sort By"
        isOpen={uploadColumnIDDropdownOpen}
        toggle={uploadColumnIDDropdownToggle}
        className="upload-gallery-dropdown"
      >
        <DropdownToggle caret>
          {selectedSort
            ? IOTWShared.uploadColumnIDToString(selectedSort)
            : "Sort By"}
        </DropdownToggle>
        <DropdownMenu>{uploadColumnIDDropdownItems}</DropdownMenu>
      </Dropdown>
      <Dropdown
        title="Direction"
        isOpen={directionDropdownOpen}
        toggle={directionDropdownToggle}
        className="upload-gallery-dropdown"
      >
        <DropdownToggle caret>
          {selectedDirection
            ? IOTWShared.directionToString(selectedDirection)
            : "Direction"}
        </DropdownToggle>
        <DropdownMenu>{directionDropdownItems}</DropdownMenu>
      </Dropdown>
    </Container>
  );
};

type UploadGalleryProps = { userOnly: boolean; title: string };

const UploadGallery: React.FunctionComponent<UploadGalleryProps> = (
  props: UploadGalleryProps
) => (
  <Container id="upload-gallery">
    <UploadFullOverlay src={""} />
    <div id="upload-gallery-header">
      <h1>{props.title}</h1>
      <hr className="my-1" />
      <SortDropdowns />
    </div>
    <div id="uploads-container">
      <PaginatedItems userOnly={props.userOnly ?? false} itemsPerPage={16} />
    </div>
  </Container>
);

export default UploadGallery;
