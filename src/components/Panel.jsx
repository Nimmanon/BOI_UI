import { useState, useEffect } from "react";
// import * as XLSX from 'xlsx';
// import Moment from 'moment';
import { Link, useOutletContext } from "react-router-dom";

import Breadcrumb from "../modules/main/breadcrumb/Breadcrumb";
import ExportExcel from "./ExportExcel";
//import DataFormat from './DataFormat';

const Panel = ({
  onAddNew,
  onAddImport,
  onSearchChange,
  showBreadcrumb = true,
  showAdd,
  showExport,
  showImport,
  showSearch,
  listView,
  rowView,
  columnView,
  setViewStyle,
  headExport,
  data,
  name,
}) => {
  const [ActivePath, ActivePage] = useOutletContext(); // <-- access context value
  const [search, setSearch] = useState("");
  const [activeButton, setActiveButton] = useState("");
  //const [fileName, setFileName] = useState('');

  const selectViewStyle = (val) => {
    setViewStyle(val);
    setActiveButton(val);
  };

  useEffect(() => {
    if (JSON.stringify(search) !== JSON.stringify(data)) {
      onSearchChange(search);
    }
  }, [search]);

  const handleHelpClick = () => {
    if (name === undefined || name === null) return;

    window.open("/help/preview?data=" + btoa(name), "_blank");
  };

  return (
    <>
      <section className="breadcrumb lg:flex justify-between">
        {
          showBreadcrumb &&
          <Breadcrumb />
        }
        <div className="flex flex-wrap gap-2 items-center ml-auto mr-auto lg:mt-0">
          {/* Layout */}
          <div className="flex gap-x-2">
            {listView && (
              <button
                onClick={() => selectViewStyle("list")}
                className={`btn btn-icon btn-icon_large btn_outlined ${activeButton === "list" || activeButton === ""
                    ? "btn_primary"
                    : "btn_secondary"
                  }`}
              >
                <span className="la la-bars" />
              </button>
            )}
            {rowView && (
              <button
                onClick={() => selectViewStyle("row")}
                className={`btn btn-icon btn-icon_large btn_outlined ${activeButton === "row" ? "btn_primary" : "btn_secondary"
                  }`}
              >
                <span className="la la-list" />
              </button>
            )}
            {columnView && (
              <button
                onClick={() => selectViewStyle("column")}
                className={`btn btn-icon btn-icon_large btn_outlined ${activeButton === "column" ? "btn_primary" : "btn_secondary"
                  }`}
              >
                <span className="la la-th-large" />
              </button>
            )}
          </div>
          {/* Search */}
          {showSearch && (
            <div className="flex flex-auto items-center">
              <label className="form-control-addon-within rounded-full bg-yellow-100">
                <input
                  type="text"
                  className="form-control border-none bg-yellow-100"
                  placeholder="Search"
                  onChange={(e) => {
                    e.preventDefault();
                    setSearch(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-link bg-yellow-100 text-primary text-xl leading-none la la-search mr-4 ml-4"
                  onClick={(e) => {
                    e.preventDefault();
                    onSearchChange(search);
                  }}
                />
              </label>
            </div>
          )}
          {/* Button */}
          <div className="flex gap-x-2">
            {showAdd && (
              <button onClick={onAddNew} className="btn btn_primary uppercase">
                <span className="la la-plus-circle text-xl leading-none mr-1"></span>
                Add New
              </button>
            )}
            {showImport && (
              <button
                onClick={onAddImport}
                className="btn btn_primary uppercase"
              >
                <span className="la la-file-import text-xl leading-none mr-1"></span>
                Import New
              </button>
            )}
            {
              showExport && (
                <ExportExcel headExport={headExport} data={data} name={name} />
              )
              // <button
              //     onClick={handleOnExport}
              //     className="btn btn_primary btn_outlined uppercase">
              //     <span className="la la-file-alt text-xl leading-none"></span>
              //     Export Data
              // </button>
            }
          </div>
          <div>
            <Link
              id={name}
              key={name}
              to={""}
              className="link"
              title="help"
              onClick={handleHelpClick}
            >
              <span className="icon la la-question-circle text-4xl" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Panel;
