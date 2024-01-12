// Source: https://css-tricks.com/using-css-transitions-auto-dimensions/
import React from "react";
import ExpandLess from "./assets/expand_less.svg";
import ExpandMore from "./assets/expand_more.svg";
import "./collapse.css";

const CollapseAction = ({ isExpanded, onClick }) => {
  const title = isExpanded ? "View Less" : "View More";
  const arrow = isExpanded ? ExpandLess : ExpandMore;

  return (
    <div className="collapseActionContainer">
      <button onClick={onClick}>
        {title} <img src={arrow} alt="toggle collapse" />
      </button>
    </div>
  );
};

const CollapseItem = ({ title, children }) => {
  // TODO: Can be improved
  const [isOpen, setIsOpen] = React.useState(true);
  const accordionContentRef = React.useRef();

  // TODO: Move to util, accept element Ref
  const collapse = () => {
    const element = accordionContentRef.current;
    const sectionHeight = element.scrollHeight;

    // temporarily disable all css transitions
    const elementTransition = element.style.transition;
    element.style.transition = "";

    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we
    // aren't transitioning out of 'auto'
    requestAnimationFrame(() => {
      element.style.height = sectionHeight + "px";
      element.style.transition = elementTransition;

      // on the next frame (as soon as the previous style change has taken effect),
      // have the element transition to height: 0
      requestAnimationFrame(() => {
        element.style.height = 0 + "px";
        element.style.opacity = 0;
      });
    });
  };

  const expand = () => {
    const element = accordionContentRef.current;
    const sectionHeight = element.scrollHeight;
    const elementTransition = element.style.transition;
    // Transition #2
    element.style.height = sectionHeight + "px";
    element.style.transition = elementTransition;
    element.style.opacity = 1;
  };

  // TODO: consider not doing this ?
  const onTransitionEnd = () => {
    // expand is complete
    if (!isOpen) {
      // IMPORTANT: For resize
      const element = accordionContentRef.current;
      element.style.height = "auto";
      setIsOpen(true);
    }
    // collapse is complete
    else {
      setIsOpen(false);
    }
  };

  return (
    <div className="collapseItemContainer">
      <h3
        className="collapseHeader"
        onClick={() => (isOpen ? collapse() : expand())}
      >
        {title}
      </h3>
      <div
        onTransitionEnd={onTransitionEnd}
        ref={accordionContentRef}
        className="collapseContent"
      >
        {children}
      </div>
      <CollapseAction
        isExpanded={isOpen}
        onClick={() => (isOpen ? collapse() : expand())}
      />
    </div>
  );
};

const Collapse = ({ items }) => {
  return (
    <div className="collapseContainer">
      {items.map((item, index) => (
        <CollapseItem key={index} title={item.title}>
          {item.content}
        </CollapseItem>
      ))}
    </div>
  );
};

export default Collapse;
