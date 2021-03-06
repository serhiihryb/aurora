import React, { Children } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled from "styled-components";

import { getRelByTarget } from "../../utils/link";
import { colors } from "../../theme";

const StyledLink = styled.a`
  display: inline-block;
  text-decoration: none;
  outline: 0;
  border: 0;
  position: relative;

  .links__list & {
    width: 100%;
    text-align: left;
  }

  &:focus,
  &:hover {
    outline: 0;
  }

  &.link--has-other.link--open:after {
    content: "";
    display: inline-block;
    border-bottom: 4px solid ${colors.azure.base};
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

export default class LinkItem extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    href: PropTypes.string,
    target: PropTypes.string,
    rel: PropTypes.string,
    role: PropTypes.string
  };

  static defaultProps = {
    children: null,
    className: "",
    href: null,
    target: "_self",
    rel: null,
    role: null
  };

  state = {
    open: false,
    touchEventsExist: false
  };

  componentDidMount() {
    if ("ontouchstart" in document.documentElement) {
      this.setState({ touchEventsExist: true }); // eslint-disable-line
    }
  }

  open = () => this.hasOther && this.setState(() => ({ open: true }));

  close = () => this.hasOther && this.setState(() => ({ open: false }));

  toggle = () =>
    this.hasOther && this.setState(({ open }) => ({ open: !open }));

  render() {
    const { children, rel, target, role, className, ...props } = this.props;
    const [label, ...other] = Children.toArray(children);
    this.hasOther = other && other.length > 0;
    const aria = this.hasOther
      ? { "aria-haspopup": this.hasOther, "aria-expanded": this.state.open }
      : {};

    const classes = classNames(
      {
        link: true,
        "link--has-other": this.hasOther,
        "link--open": this.state.open
      },
      className
    );

    const content = props.href ? (
      <StyledLink
        {...props}
        target={target}
        rel={getRelByTarget(target, rel)}
        role={role || "link"}
        {...aria}
        className={classes}
      >
        {label}
      </StyledLink>
    ) : (
      <StyledLink
        {...props}
        role={role || "button"}
        {...aria}
        className={classes}
        as="button"
      >
        {label}
      </StyledLink>
    );
    return (
      <span
        className={
          this.state.open
            ? "list-container list-container--open"
            : "list-container list-container--closed"
        }
        onClick={this.toggle}
        onMouseEnter={this.state.touchEventsExist ? null : this.open}
        onMouseLeave={this.close}
        role="none"
      >
        {content}
        {other}
      </span>
    );
  }
}
