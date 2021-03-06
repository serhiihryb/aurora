import React from "react";
import renderer from "react-test-renderer";
import "jest-styled-components";
import SearchInput from "../index";
import {
  StyledInput,
  StyledSearchIcon,
  Clear,
  Cancel,
  SearchSuggest
} from "../Search.styles";

describe("SearchSuggest", () => {
  it("should match snapshot", () => {
    const tree = renderer.create(<SearchSuggest />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe("SearchInput", () => {
  it("small should match snapshot", () => {
    const onChange = () => {};
    const onFocus = () => {};
    const onBlur = () => {};
    const searchIconSelect = () => {};
    const clearText = () => {};
    const cancelCallback = () => {};
    const tree = renderer
      .create(
        <SearchInput
          variant="small"
          placeholder="Search Demo"
          value="test"
          hasBackground
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          searchIconSelect={searchIconSelect}
          clearText={clearText}
          cancelCallback={cancelCallback}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("large should match snapshot", () => {
    const onChange = () => {};
    const tree = renderer
      .create(
        <SearchInput
          variant="large"
          placeholder="Search Demo"
          value=""
          hasBackground
          onChange={onChange}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("icon only should match snapshot", () => {
    const onChange = () => {};
    const tree = renderer
      .create(
        <SearchInput
          variant="large"
          placeholder="Search Demo"
          value=""
          isInputVisible={false}
          onChange={onChange}
          hasBackground
          isSuggestOpened
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should call onChagne", () => {
    const onChange = jest.fn();
    const element = renderer.create(
      <SearchInput
        variant="large"
        placeholder="Search Demo"
        value=""
        isInputVisible={false}
        onChange={onChange}
        hasBackground
      />
    );

    const input = element.root.findByType(StyledInput);
    input.props.onChange("test data");

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("test data");
  });

  it("when hasBackground inputFocused should change state and call onFocus func prop", () => {
    const onFocus = jest.fn();
    const setStateMock = jest.fn();
    const element = renderer.create(
      <SearchInput
        variant="large"
        placeholder="Search Demo"
        value=""
        isInputVisible={false}
        onFocus={onFocus}
        onChange={() => {}}
        hasBackground
      />
    );

    const instance = element.getInstance();
    instance.setState = setStateMock;
    instance.inputFocused();

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(setStateMock).toHaveBeenCalledTimes(1);
    expect(setStateMock).toHaveBeenCalledWith({
      isFocused: true
    });
  });

  it("when hasBackground on focus function should change state and call onFocus func prop", () => {
    const onFocus = jest.fn();
    const spyInputFocused = jest.spyOn(SearchInput.prototype, "inputFocused");
    const spySetState = jest.spyOn(SearchInput.prototype, "setState");
    const element = renderer.create(
      <SearchInput
        variant="large"
        placeholder="Search Demo"
        value=""
        isInputVisible={false}
        onFocus={onFocus}
        onChange={() => {}}
        hasBackground
      />
    );

    spySetState.mockClear();

    const input = element.root.findByType(StyledInput);
    input.props.onFocus("test data");

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(spyInputFocused).toHaveBeenCalledTimes(1);
    expect(spyInputFocused).toHaveBeenCalledWith("test data");
    expect(spySetState).toHaveBeenCalledTimes(1);
    expect(spySetState).toHaveBeenCalledWith({
      isFocused: true
    });
  });

  it("when hasBackground is false on focus function should not change state and call onFocus func prop", () => {
    const onFocus = jest.fn();
    const spyInputFocused = jest.spyOn(SearchInput.prototype, "inputFocused");
    const spySetState = jest.spyOn(SearchInput.prototype, "setState");
    const element = renderer.create(
      <SearchInput
        variant="large"
        placeholder="Search Demo"
        value=""
        isInputVisible={false}
        onChange={() => {}}
        onFocus={onFocus}
      />
    );

    spyInputFocused.mockClear();
    spySetState.mockClear();

    const input = element.root.findByType(StyledInput);
    input.props.onFocus("test data");

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(spyInputFocused).toHaveBeenCalledTimes(1);
    expect(spyInputFocused).toHaveBeenCalledWith("test data");
    expect(spySetState).toHaveBeenCalledTimes(0);
  });

  it("when hasBackground on focus function should change state and call onBlur func prop", () => {
    const onBlur = jest.fn();
    const spyInputBlur = jest.spyOn(SearchInput.prototype, "inputBlur");
    const spySetState = jest.spyOn(SearchInput.prototype, "setState");
    const element = renderer.create(
      <SearchInput
        variant="large"
        placeholder="Search Demo"
        value=""
        isInputVisible={false}
        onBlur={onBlur}
        onChange={() => {}}
        hasBackground
      />
    );

    spyInputBlur.mockClear();
    spySetState.mockClear();

    const input = element.root.findByType(StyledInput);
    input.props.onBlur("test data");

    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(spyInputBlur).toHaveBeenCalledTimes(1);
    expect(spyInputBlur).toHaveBeenCalledWith("test data");
    expect(spySetState).toHaveBeenCalledTimes(1);
    expect(spySetState).toHaveBeenCalledWith({
      isFocused: false
    });
  });

  it("when hasBackground is false on focus function should not change state and call onBlur func prop", () => {
    const onBlur = jest.fn();
    const spyInputBlur = jest.spyOn(SearchInput.prototype, "inputBlur");
    const spySetState = jest.spyOn(SearchInput.prototype, "setState");
    const element = renderer.create(
      <SearchInput
        variant="large"
        placeholder="Search Demo"
        value=""
        isInputVisible={false}
        onChange={() => {}}
        onBlur={onBlur}
      />
    );

    spyInputBlur.mockClear();
    spySetState.mockClear();

    const input = element.root.findByType(StyledInput);
    input.props.onBlur("test data");

    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(spyInputBlur).toHaveBeenCalledTimes(1);
    expect(spyInputBlur).toHaveBeenCalledWith("test data");
    expect(spySetState).toHaveBeenCalledTimes(0);
  });

  it("call searchIconSelect when search icon clicked", () => {
    const searchIconSelect = jest.fn();
    const element = renderer.create(
      <SearchInput
        variant="large"
        placeholder="Search Demo"
        value=""
        isInputVisible={false}
        onChange={() => {}}
        searchIconSelect={searchIconSelect}
      />
    );

    const el = element.root.findByType(StyledSearchIcon);
    el.props.onClick("test data");

    expect(searchIconSelect).toHaveBeenCalledTimes(1);
    expect(searchIconSelect).toHaveBeenCalledWith("test data");
  });

  it("call clearText when clear icon selected", () => {
    const clearText = jest.fn();
    const element = renderer.create(
      <SearchInput
        variant="large"
        placeholder="Search Demo"
        value=""
        isInputVisible={false}
        onChange={() => {}}
        clearText={clearText}
      />
    );

    const el = element.root.findByType(Clear);
    el.props.onClick("test data");

    expect(clearText).toHaveBeenCalledTimes(1);
    expect(clearText).toHaveBeenCalledWith("test data");
  });

  it("call cancelCallback when Cancel button selected", () => {
    const cancelCallback = jest.fn();
    const element = renderer.create(
      <SearchInput
        variant="large"
        placeholder="Search Demo"
        value=""
        isInputVisible={false}
        onChange={() => {}}
        cancelCallback={cancelCallback}
      />
    );

    const el = element.root.findByType(Cancel);
    el.props.onClick("test data");

    expect(cancelCallback).toHaveBeenCalledTimes(1);
    expect(cancelCallback).toHaveBeenCalledWith("test data");
  });
});
