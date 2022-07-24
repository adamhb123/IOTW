import React from "react";
import Slider from "react-slick";
import { Container } from "reactstrap";
import Logger from "easylogger-ts";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./UploadCarousel.scss";

import APIMiddleware from "../../misc/APIMiddleware";
import IOTWShared from "iotw-shared";
import Config from "../../misc/config";
import UploadFullOverlay from "../UploadFullOverlay";
import DootDifferenceDisplay from "../DootDifferenceDisplay";

// export class UploadCarouselItem {
//   src: string;
//   altText: string;
//   caption: string;
//   constructor(src: string, altText: string, caption: string) {
//     this.src = src;
//     this.altText = altText;
//     this.caption = caption;
//   }
//   asObject() {
//     return {
//       src: this.src,
//       altText: this.altText,
//       caption: this.caption,
//     };
//   }
// }

// export class UploadCarousel extends Component<UploadCarouselProps> {
//   maxItemCount: number;
//   animating: boolean;
//   state: {activeIndex: number; items: UploadCarouselItem[]} = { activeIndex: 0, items: [] };
//   constructor(props: UploadCarouselProps) {
//     super(props);
//     this.next = this.next.bind(this);
//     this.previous = this.previous.bind(this);
//     this.goToIndex = this.goToIndex.bind(this);
//     this.onExiting = this.onExiting.bind(this);
//     this.onExited = this.onExited.bind(this);
//     this.animating = false;
//     this.maxItemCount = props.maxItemCount;
//     this.updateItems();
//   }

//   async updateItems() {
//     const uploads = await APIMiddleware.getUploads(this.maxItemCount);
//     this.state.items = await Promise.all(
//       uploads.map(async (upload: UploadsResponseStructure) => {
//         const imageB64 = await APIMiddleware.getSlackImageBase64(upload.imageUrl);
//         return new UploadCarouselItem(
//           `data:${upload.imageMimetype};base64, ${imageB64}`,
//           `Slack image from url: ${upload.imageUrl}`,
//           `^${upload.updoots} v${upload.downdoots}`
//         )
//       })
//     );
//   }

//   onExiting() {
//     this.animating = true;
//   }

//   onExited() {
//     this.animating = false;
//   }

//   next() {
//     if (this.animating) return;
//     const nextIndex =
//       this.state.activeIndex === this.state.items.length - 1
//         ? 0
//         : this.state.activeIndex + 1;
//     this.setState({ activeIndex: nextIndex });
//   }

//   previous() {
//     if (this.animating) return;
//     const nextIndex =
//       this.state.activeIndex === 0
//         ? this.state.items.length - 1
//         : this.state.activeIndex - 1;
//     this.setState({ activeIndex: nextIndex });
//   }

//   goToIndex(newIndex: number) {
//     if (this.animating) return;
//     this.setState({ activeIndex: newIndex });
//   }

//   render() {
//     const { activeIndex } = this.state;

//     const slides = this.state.items.map((item) => {
//       return (
//         <CarouselItem
//           onExiting={this.onExiting}
//           onExited={this.onExited}
//           key={item.src}
//         >
//           <img src={item.src} alt={item.altText} />
//           <CarouselCaption
//             captionText={item.caption}
//             captionHeader={item.caption}
//           />
//         </CarouselItem>
//       );
//     });

//     return (
//       <Carousel
//         activeIndex={activeIndex}
//         next={this.next}
//         previous={this.previous}
//       >
//         <CarouselIndicators
//           items={this.state.items}
//           activeIndex={activeIndex}
//           onClickHandler={this.goToIndex}
//         />
//         {slides}
//         <CarouselControl
//           direction="prev"
//           directionText="Previous"
//           onClickHandler={this.previous}
//         />
//         <CarouselControl
//           direction="next"
//           directionText="Next"
//           onClickHandler={this.next}
//         />
//       </Carousel>
//     );
//   }
// }

interface UploadArrowProps {
  direction: "previous" | "next";
  onClick?: React.EventHandler<any>;
}
type UploadArrowType = React.FunctionComponent<UploadArrowProps>;
const UploadArrow: UploadArrowType = (
  props: UploadArrowProps
): React.ReactElement<any, any> => {
  return (
    <button
      className={`upload-arrow`}
      id={props.direction}
      onClick={(evt) => {
        if (props.onClick) props.onClick(evt);
      }}
    >
      <span>{props.direction === "previous" ? "<" : ">"}</span>
    </button>
  );
};

interface UploadSlideProps {
  id: string; // ID and key will be the same value
  src: string;
  dootDifference: number;
  onClick?: React.MouseEventHandler;
}

export const UploadSlide: React.FunctionComponent<UploadSlideProps> = (
  props: UploadSlideProps
) => {
  const toggleShowFullOverlayOnClick = React.useCallback(() => {
    const dom = document as IOTWShared.IOTWDOM;
    if (!dom.userDragging) {
      if (dom.setUploadFullOverlaySrc) props.src;
      if (dom.setUploadFullOverlayVisible) !dom.uploadFullOverlayVisible;
    }
    // Reset userDragging
    dom.userDragging = false;
  }, [props.src]);

  const dragThreshold = 25;
  let dragInterval: NodeJS.Timeout | null = null;
  IOTWShared.addEventListeners(["mouseup", "touchend"], () => {
    if (dragInterval) clearInterval(dragInterval);
  });
  IOTWShared.addEventListeners(["mousedown", "touchstart"], (evt: Event) => {
    const dom = document as IOTWShared.IOTWDOM;
    const initialMousePos = IOTWShared.mousePositionFromEvent(evt);
    if (!initialMousePos) return;
    if (dragInterval) clearInterval(dragInterval);
    dragInterval = setInterval(() => {
      if (!dom.currentMousePosition) return;
      const dragDistance = Math.sqrt(
        Math.abs(initialMousePos[0] - dom.currentMousePosition[0]) ** 2 +
          Math.abs(initialMousePos[1] - dom.currentMousePosition[1]) ** 2
      );
      dom.userDragging = dragDistance > dragThreshold;
    }, 100);
  });

  const [slideCheck, retriggerSlideCheck] = React.useState<boolean>(false);
  React.useEffect(() => {
    const slide = document.getElementById(props.id) as HTMLElement;
    if (!slide) {
      retriggerSlideCheck(!slideCheck);
      return;
    }
    // User interaction fixes
  }, [props.id, slideCheck]);
  return (
    <div className="slide" key={props.id}>
      <DootDifferenceDisplay dootDifference={props.dootDifference} />
      <img
        id={props.id}
        src={props.src}
        alt="Upload"
        onClick={toggleShowFullOverlayOnClick}
      />
    </div>
  );
};

interface UploadCarouselProps {
  maxItemCount: number;
  autoplay?: boolean;
  onClick?: React.MouseEventHandler;
  id?: string;
  children?: React.ReactElement[] | React.ReactElement;
}

export const UploadCarousel: React.FunctionComponent<UploadCarouselProps> = (
  props: UploadCarouselProps
) => {
  // Mouse position updates
  const updateCurrentMousePosition: EventListener = (evt: Event) => {
    const dom = document as IOTWShared.IOTWDOM;
    const mousePosition = IOTWShared.mousePositionFromEvent(evt);
    if (mousePosition) {
      dom.currentMousePosition = mousePosition;
    }
  };
  IOTWShared.addEventListeners(
    [
      "mousedown",
      "mouseup",
      "mousemove",
      "mouseover",
      "mouseout",
      "mouseenter",
      "mouseleave",
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
    ],
    updateCurrentMousePosition
  );
  // Load uploads
  const [slides, setSlides] = React.useState<React.ReactElement[]>([]);
  React.useEffect(() => {
    (async (): Promise<React.ReactElement[]> => {
      const uploadSlides: React.ReactElement[] = props.children
        ? Array.isArray(props.children)
          ? props.children
          : [props.children]
        : [];
      const presetSlidesLength = uploadSlides.length;
      if (presetSlidesLength >= props.maxItemCount) return uploadSlides;
      const uploadObjs = await APIMiddleware.getUploads(
        props.maxItemCount - presetSlidesLength
      );
      let count = uploadSlides.length;
      console.log(uploadObjs);
      for (const upload of uploadObjs) {
        let imageSrc: string;
        console.error("err: " + Config.api.storeUploadsLocally);
        console.error(upload);
        if (Config.api.storeUploadsLocally) {
          if (!upload.apiPublicFileUrl) {
            const errStr = `UploadCardCarousel: props.apiPublicFileUrl required \
            when storing uploads locally! Props provided: ${Logger.objectToPrettyStringSync(
              props as Record<string, any>
              // eslint-disable-next-line indent
            )}`;
            console.error(errStr);
            throw new Error(errStr);
          } else {
            imageSrc = APIMiddleware.formatSlackImageSrc(
              upload.apiPublicFileUrl
            );
          }
        } else {
          if (!(upload.imageUrl && upload.imageMimetype)) {
            const errStr = `UploadCardCarousel: props.imageUrl && \
            props.imageMimetype required when not storing uploads \
            locally! Props provided: ${Logger.objectToPrettyStringSync(
              props as Record<string, any>
              // eslint-disable-next-line indent
            )}`;
            console.error(errStr);
            throw new Error(errStr);
          } else {
            imageSrc = APIMiddleware.formatSlackImageSrc(
              await APIMiddleware.getSlackImageBase64(upload.imageUrl),
              upload.imageMimetype
            );
          }
        }
        console.error(`slide-${count}`);
        uploadSlides.push(
          <UploadSlide
            id={`slide-${count++}`}
            src={imageSrc}
            dootDifference={upload.updoots - upload.downdoots}
          />
        );
      }
      return uploadSlides;
    })()
      .then((uploadSlides) => setSlides(uploadSlides))
      .catch((err) => console.error(err));
  }, [props]);
  const settings = {
    autoplay: props.autoplay ?? false,
    arrows: true,
    accessibility: true, // Doesn't work i guess
    dots: true,
    prevArrow: <UploadArrow direction="previous" />,
    nextArrow: <UploadArrow direction="next" />,
    infinite: true,
    speed: 500,
    slide: ".slide",
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  // Add onclick to slider
  React.useEffect(() => {
    const slider = document.getElementsByClassName("slick-slider")[0];
    slider.addEventListener("click", (ev: any) => {
      if (props.onClick) props.onClick(ev);
    });
  }, [props]);
  return (
    <Container id={props.id}>
      <UploadFullOverlay src={""} />
      <Slider {...settings}>{slides}</Slider>
    </Container>
  );
};
