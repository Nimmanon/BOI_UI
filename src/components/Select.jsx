import React from "react";
import Tippy from "@tippyjs/react";
import { useState, useEffect, useRef } from "react";

const Select = (props) => {
  const {
    list,
    label = "",
    name,
    type,
    register,
    required,
    error,
    onSelectItem,
    selectedText,
    placeholder,
    readOnly = false,
    //canSelected = true
    showErrMsg = true,
    showDesc = false,
    showValue = false,
  } = props;

  const searchInput = useRef(null);

  const [search, setSearch] = useState("");
  const [selectlist, setSelectlist] = useState(list);
  const [text, setText] = useState("");
  const [value, setValue] = useState();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    //if (list.length === 0) return;
    setSelectlist(list);
    //console.log(selected);
  }, [list]);

  useEffect(() => {        
    if (selectedText === undefined) return;
    setText(selectedText === null? "" : selectedText);
    //console.log("select selectedText => ",name, selectedText);
  }, [selectedText]);

  useEffect(() => {
    if (value === undefined) return;
    onSelectItem(value, name);
  }, [value]);

  useEffect(() => {
    const selectlist = list?.filter((x) =>
      x.Name.toLowerCase().includes(search.toLowerCase())
    );
    setSelectlist(selectlist);
  }, [search]);

  const getItemlist = (e) => {
    setText(e?.Name);
    setValue(e);
    if (e.Id === value?.Id) {
      onSelectItem(value, name);
    }
    setOpen(false);
  };

  const handleFocus = () => searchInput.current.focus();

  const handleClear = (e) => {
    handleFocus();
    setText("");
    setValue(null);
    onSelectItem(null, name);
  };

  return (
    <>
      <div className={`search-select ${label !== "" ? "mt-5" : ""}`}>
        {label !== "" && (
          <label>&nbsp;{`${label} ${required ? "*" : ""}`}</label>
        )}
        <Tippy
          theme="light-border"
          offset={[0, 8]}
          maxWidth="none"
          arrow={false}
          placement="bottom-start"
          trigger="click"
          interactive={true}
          allowHTML={true}
          animation="shift-toward-extreme"
          onAfterUpdate={(instance) => {
            if (!open) {
              instance.hide();
              setOpen(true);
            }
          }}
          content={
            <div className="max-h-screen p-3">
              <input
                type="text"
                ref={searchInput}
                className="form-control ltr:pl-2 rtl:pr-2"
                placeholder="Search..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />

              <div
                className={`search-select-menu ${
                  selectlist?.length >= 5 && !showDesc
                    ? "overflow-y-scroll"
                    : "max-h-fit"
                } ${
                  selectlist?.length >= 3 && showDesc
                    ? "overflow-y-scroll"
                    : "max-h-fit"
                }`}
              >
                {selectlist?.map((e) => {
                  return (
                    <div
                      key={e?.Id}
                      onClick={() => getItemlist(e)}
                      className="item cursor-pointer mt-1"
                    >
                      &nbsp;{e?.Name}
                      <br />
                      {showDesc && (
                        <label className="text-small">
                          &nbsp;&nbsp;&nbsp;{e?.Description}
                        </label>
                      )}
                      {showValue && (
                        <label className="text-small">
                          &nbsp;&nbsp;&nbsp;{e?.Value}
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          }
          //appendTo={() => document.body}
        >
          <label className="form-control-addon-within flex-row-reverse border-none">
            <input
              type={type}
              {...register(name, { required })}
              placeholder={placeholder}
              value={text}
              autoComplete="off"
              onClick={handleFocus}
              className={`form-control ${!readOnly ? "bg-yellow-100" : ""} ${
                readOnly ? "readOnly" : error ? "is-invalid" : ""
              }`}
            />
            <div
              className={`custom-select-icon la 
              ${text ? "la-times" : "la-caret-down"} cursor-pointer 
              ${label === "" ? "mt-1" : "mt-6"}`}
              onClick={handleClear}
            />
          </label>
        </Tippy>
      </div>
      {showErrMsg && error?.type == "required" && (
        <small className="block mt-2 invalid-feedback">
          {label} is required
        </small>
      )}
    </>
  );
};

export default Select;
