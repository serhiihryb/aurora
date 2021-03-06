import React from "react";
import renderer from "react-test-renderer";
import "jest-styled-components";

import PopOver from "..";

describe("PopOver", () => {
  it("should match snapshot", () => {
    const tree = renderer.create(<PopOver />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should match snapshot", () => {
    const tree = renderer.create(<PopOver isVisible />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe("calculatePosition tests", () => {
    const reduce = {
      top: 0,
      bottom: 0
    };
    it("should render viewport left and bottom", () => {
      const position = {
        elBottom: 10,
        elTop: 0,
        mouseX: 5,
        offsetTop: 0,
        clientHeight: 1000,
        offsetLeft: 0,
        clientWidth: 500
      };
      const dimensions = {
        width: 100,
        windowScroll: 0,
        height: 100,
        windowWidth: 500,
        windowHeight: 400
      };

      expect(PopOver.calculatePosition(position, dimensions, reduce)).toEqual({
        x: 16,
        y: 20
      });
    });

    it("should render viewport left and bottom on wide screen", () => {
      const position = {
        elBottom: 510,
        elTop: 500,
        mouseX: 5,
        offsetTop: 0,
        clientHeight: 1000,
        offsetLeft: 0,
        clientWidth: 10000
      };
      const dimensions = {
        width: 100,
        windowScroll: 100,
        height: 100,
        windowWidth: 1000,
        windowHeight: 400
      };

      expect(PopOver.calculatePosition(position, dimensions, reduce)).toEqual({
        x: 24,
        y: 390
      });
    });
  });

  it("popoverEnter should calculate position again and set it", () => {
    const setDimensionsMock = jest.fn();
    const calculatePositionMock = jest.fn(() => ({ x: 5, y: 10 }));
    const tree = renderer.create(<PopOver isVisible />).getInstance();

    tree.setDimensions = setDimensionsMock;
    PopOver.calculatePosition = calculatePositionMock;
    tree.myRef = {
      current: {
        style: {
          top: 0,
          left: 0
        }
      }
    };
    tree.popoverEnter();

    expect(setDimensionsMock).toHaveBeenCalledTimes(1);
    expect(calculatePositionMock).toHaveBeenCalledTimes(1);
    expect(tree.myRef.current.style.top).toEqual("10px");
    expect(tree.myRef.current.style.left).toEqual("5px");
  });

  it("popoverEnter should not calculate position again and set old pos values", () => {
    const setDimensionsMock = jest.fn();
    const calculatePositionMock = jest.fn(() => ({ x: 5, y: 10 }));
    const tree = renderer.create(<PopOver />).getInstance();

    tree.setDimensions = setDimensionsMock;
    PopOver.calculatePosition = calculatePositionMock;
    tree.myRef = {
      current: {
        style: {
          top: 0,
          left: 0
        }
      }
    };
    tree.pos = {
      x: 5,
      y: 10
    };
    tree.popoverEnter();

    expect(setDimensionsMock).toHaveBeenCalledTimes(0);
    expect(calculatePositionMock).toHaveBeenCalledTimes(0);
    expect(tree.myRef.current.style.top).toEqual("10px");
    expect(tree.myRef.current.style.left).toEqual("5px");
  });

  it("componentDidUpdate should calculate position again and set it", () => {
    const setDimensionsMock = jest.fn();
    const calculatePositionMock = jest.fn(() => ({ x: 5, y: 10 }));
    const position = {
      mouseX: 30,
      elTop: 20,
      elBottom: 40
    };
    const tree = renderer.create(<PopOver isVisible />).getInstance();

    tree.setDimensions = setDimensionsMock;
    PopOver.calculatePosition = calculatePositionMock;
    tree.myRef = {
      current: {
        style: {
          top: 0,
          left: 0
        }
      }
    };
    tree.componentDidUpdate({ position, isVisible: true });

    expect(setDimensionsMock).toHaveBeenCalledTimes(1);
    expect(calculatePositionMock).toHaveBeenCalledTimes(1);
    expect(tree.myRef.current.style.top).toEqual("10px");
    expect(tree.myRef.current.style.left).toEqual("5px");
  });

  it("componentDidUpdate should not do anything if not visible", () => {
    const setDimensionsMock = jest.fn();
    const calculatePositionMock = jest.fn(() => ({ x: 5, y: 10 }));
    const position = {
      mouseX: 30,
      elTop: 20,
      elBottom: 40
    };
    const tree = renderer
      .create(<PopOver isVisible position={position} />)
      .getInstance();

    tree.setDimensions = setDimensionsMock;
    PopOver.calculatePosition = calculatePositionMock;
    tree.myRef = {
      current: {
        style: {
          top: 0,
          left: 0
        }
      }
    };
    tree.componentDidUpdate({ position });

    expect(setDimensionsMock).toHaveBeenCalledTimes(0);
    expect(calculatePositionMock).toHaveBeenCalledTimes(0);
    expect(tree.myRef.current.style.top).toEqual(0);
    expect(tree.myRef.current.style.left).toEqual(0);
  });

  it("setDimensions should not call setState and return false", () => {
    const tree = renderer.create(<PopOver isVisible />).getInstance();

    tree.setDimensions();

    expect(tree.setDimensions()).toBeFalsy();
  });

  it("setDimensions should not call setState and return false when pop over dimensions are 0, 0 pop over isn ot visible", () => {
    const tree = renderer.create(<PopOver />).getInstance();

    tree.dimensions.width = 100;
    tree.dimensions.height = 100;
    tree.myRef = {
      current: {
        clientWidth: 0,
        clientHeight: 0
      }
    };
    tree.setDimensions();

    expect(tree.setDimensions()).toBeFalsy();
  });

  describe("getDimensionsFromEvent", () => {
    const event = {
      clientX: 100,
      currentTarget: {
        offsetTop: 20,
        clientHeight: 1000
      }
    };
    const wrapper = {
      offsetTop: 50,
      clientHeight: 200,
      offsetLeft: 100,
      clientWidth: 300
    };
    it("without wrapper", () => {
      expect(PopOver.getDimensionsFromEvent(event)).toEqual({
        mouseX: 100,
        elTop: 20,
        elBottom: 1020,
        offsetTop: 0,
        clientHeight: 100000,
        offsetLeft: 0,
        clientWidth: 100000
      });
    });

    it("plus wrapper", () => {
      expect(PopOver.getDimensionsFromEvent(event, wrapper)).toEqual({
        mouseX: 100,
        elTop: 20,
        elBottom: 1020,
        offsetTop: 50,
        clientHeight: 200,
        offsetLeft: 100,
        clientWidth: 300
      });
    });
  });

  describe("when define global window", () => {
    it("setDimensions should call setState and return true", () => {
      Object.defineProperty(
        global.window.document.documentElement,
        "clientHeight",
        {
          value: 1000,
          writable: true
        }
      );
      Object.defineProperty(
        global.window.document.documentElement,
        "clientWidth",
        {
          value: 1000,
          writable: true
        }
      );
      Object.defineProperty(
        global.window.document.documentElement,
        "scrollTop",
        {
          value: 100,
          writable: true
        }
      );
      const tree = renderer.create(<PopOver isVisible />).getInstance();

      tree.myRef = {
        current: {
          clientWidth: 200,
          clientHeight: 200
        }
      };

      expect(tree.setDimensions()).toBeTruthy();
      expect(tree.dimensions).toEqual({
        windowScroll: 100,
        windowWidth: 1000,
        windowHeight: 1000,
        width: 200,
        height: 200
      });
    });
  });
});
