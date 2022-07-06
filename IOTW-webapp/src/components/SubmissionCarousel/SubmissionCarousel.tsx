import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SubmissionCarousel.scss";

import APIMiddleware from "../../misc/APIMiddleware";
import Logger from "easylogger-ts";
import { Container } from "reactstrap";
import Config from "../../misc/config";
import SubmissionFullOverlay from "../SubmissionFullOverlay";
import DootDifferenceDisplay from "../DootDifferenceDisplay";

// export class SubmissionCarouselItem {
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

// export class SubmissionCarousel extends Component<SubmissionCarouselProps> {
//   maxItemCount: number;
//   animating: boolean;
//   state: {activeIndex: number; items: SubmissionCarouselItem[]} = { activeIndex: 0, items: [] };
//   constructor(props: SubmissionCarouselProps) {
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
//     const submissions = await APIMiddleware.getSubmissions(this.maxItemCount);
//     this.state.items = await Promise.all(
//       submissions.map(async (submission: UploadsResponseStructure) => {
//         const imageB64 = await APIMiddleware.getSlackImageBase64(submission.imageUrl);
//         return new SubmissionCarouselItem(
//           `data:${submission.imageMimetype};base64, ${imageB64}`,
//           `Slack image from url: ${submission.imageUrl}`,
//           `^${submission.updoots} v${submission.downdoots}`
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

interface SubmissionArrowProps {
  direction: "previous" | "next";
  onClick?: Function;
}
type SubmissionArrowType = React.FunctionComponent<SubmissionArrowProps>;
const SubmissionArrow: SubmissionArrowType = (
  props: SubmissionArrowProps
): React.ReactElement<any, any> => {
  return (
    <button
      className={`submission-arrow`}
      id={props.direction}
      onClick={() => {
        if (props.onClick) props.onClick();
      }}
    >
      <span>{props.direction === "previous" ? "<" : ">"}</span>
    </button>
  );
};

interface SubmissionSlideProps {
  id: string; // ID and key will be the same value
  src: string;
  dootDifference: number;
  onClick?: React.MouseEventHandler;
}

export const SubmissionSlide: React.FunctionComponent<SubmissionSlideProps> = (
  props: SubmissionSlideProps
) => {
  const toggleShowFullOverlayOnClick = React.useCallback(() => {
    const dom = document as any;
    console.log("drag: " + dom.userDragging);
    if (
      Object.prototype.hasOwnProperty.call(dom, "userDragging") &&
      !dom.userDragging
    ) {
      dom.setSubmissionFullOverlaySrc(props.src);
      dom.setSubmissionFullOverlayVisible(!dom.submissionFullOverlayVisible);
    }
    // Reset userDragging
    dom.userDragging = false;
  }, [props.src]);

  const [slideCheck, retriggerSlideCheck] = React.useState<boolean>(false);
  React.useEffect(() => {
    const slide = document.getElementById(props.id) as HTMLElement;
    if (!slide) {
      retriggerSlideCheck(!slideCheck);
      return;
    }
    // User interaction fixes
    const dom = document as any;
    const dragThreshold = 100;
    let dragInterval: NodeJS.Timeout | null = null;
    let currentMousePos = [0, 0];
    const onPointerMove = (ev: MouseEvent | TouchEvent) => {
      if(ev.type.includes("mouse")){
        ev = ev as MouseEvent;
        currentMousePos = [ev.clientX, ev.clientY];
      }
      else if(ev.type.includes("touch")){
        ev = ev as TouchEvent;

      }
    }
    document.addEventListener("touchmove", (ev: TouchEvent) => {
      currentMousePos = [ev.x, ev.clientY];

    });
    document.addEventListener("mousemove", (ev: MouseEvent) => {
    });
    document.addEventListener("mouseup", (ev: MouseEvent) => {
      if (dragInterval) clearInterval(dragInterval);
    });
    document.addEventListener("mousedown", (ev: MouseEvent) => {
      let initialMousePos = [ev.clientX, ev.clientY];
      dragInterval = setInterval(() => {
        const dragDistance = Math.sqrt(
          Math.abs(initialMousePos[0] - currentMousePos[0]) ** 2 +
            Math.abs(initialMousePos[1] - currentMousePos[1]) ** 2
        );
        if (dragDistance > dragThreshold) dom.userDragging = true;
      }, 100);
    });
  }, [props.id, slideCheck]);
  return (
    <div className="slide" key={props.id}>
      <DootDifferenceDisplay dootDifference={props.dootDifference} />
      <img
        id={props.id}
        src={props.src}
        alt="Submission"
        onClick={toggleShowFullOverlayOnClick}
      />
    </div>
  );
};

interface SubmissionCarouselProps {
  maxItemCount: number;
  autoplay?: boolean;
  onClick?: React.MouseEventHandler;
  id?: string;
  children?: React.ReactElement[] | React.ReactElement;
}

export const SubmissionCarousel: React.FunctionComponent<
  SubmissionCarouselProps
> = (props: SubmissionCarouselProps) => {
  // Load submissions
  const [slides, setSlides] = React.useState<React.ReactElement[]>([]);
  React.useEffect(() => {
    (async (): Promise<React.ReactElement[]> => {
      const subSlides: React.ReactElement[] = props.children
        ? Array.isArray(props.children)
          ? props.children
          : [props.children]
        : [];
      const presetSlidesLength = subSlides.length;
      if (presetSlidesLength >= props.maxItemCount) return subSlides;
      const submissionObjs = await APIMiddleware.getSubmissions(
        props.maxItemCount - presetSlidesLength
      );
      let count = subSlides.length;
      for (const submission of submissionObjs) {
        let imageSrc: string;
        Logger.error(Config.api.storeSubmissionsLocally);
        if (Config.api.storeSubmissionsLocally) {
          if (!submission.apiPublicFileUrl) {
            const errStr = `SubmissionCardCarousel: props.apiPublicFileUrl required \
            when storing submissions locally! Props provided: ${Logger.objectToPrettyStringSync(
              props as Record<string, any>
            )}`;
            Logger.error(errStr);
            throw new Error(errStr);
          } else {
            imageSrc = APIMiddleware.formatSlackImageSrc(
              submission.apiPublicFileUrl
            );
          }
        } else {
          if (!(submission.imageUrl && submission.imageMimetype)) {
            const errStr = `SubmissionCardCarousel: props.imageUrl && \
            props.imageMimetype required when not storing submissions \
            locally! Props provided: ${Logger.objectToPrettyStringSync(
              props as Record<string, any>
            )}`;
            Logger.error(errStr);
            throw new Error(errStr);
          } else {
            imageSrc = APIMiddleware.formatSlackImageSrc(
              await APIMiddleware.getSlackImageBase64(submission.imageUrl),
              submission.imageMimetype
            );
          }
        }
        Logger.error(`slide-${count}`);
        subSlides.push(
          <SubmissionSlide
            id={`slide-${count++}`}
            src={imageSrc}
            dootDifference={submission.updoots - submission.downdoots}
          />
        );
      }
      return subSlides;
    })()
      .then((subSlides) => setSlides(subSlides))
      .catch((err) => Logger.error(err));
  }, [props]);
  const settings = {
    autoplay: props.autoplay ?? false,
    arrows: true,
    accessibility: true, // Doesn't work i guess
    dots: true,
    prevArrow: <SubmissionArrow direction="previous" />,
    nextArrow: <SubmissionArrow direction="next" />,
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
      <SubmissionFullOverlay src={""} />
      <Slider {...settings}>{slides}</Slider>
    </Container>
  );
};

export default SubmissionCarousel;
