import { useState, useEffect, useRef } from "react";
import Pagination from "./Pagination";
import loading from "../../src/assets/image/loading2.gif";
import Format from "./Format";

let PageSize = 10;

//const Table = React.forwardRef(({ data, column,actionClick }, ref) => {
const Table = ({
  subTable,
  data,
  column,
  actionClick,
  tableStyle,
  isLoading,
  showPagging = true,
  showPaggingButton = true,
  checkClick,
  radioClick,
  showSammary = false,
  dataTotal,
  allCheckClick,
  showCard = true,
  showSelectedRow = false,
  showBorder = false,
}) => {
  const [columnpage, setColumnpage] = useState(PageSize);
  const [currentPage, setCurrentPage] = useState(1);

  //sort
  const [sortReverse, setSortReverse] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [totalList, setTotalList] = useState([]);

  //select row
  const [active, setActive] = useState();

  useEffect(() => {
    //if (data.length === 0) return;
    if (JSON.stringify(dataList) !== JSON.stringify(data)) {
      getData();
      //console.log("Table effect data => ", data);
      if (showSammary) setTotalList(SummaryColumn(data, column, dataTotal));
    }
    // if (showSammary)
    //     setTotalList(SummaryColumn(data, column));
    //console.log(column.length)
  }, [data]);

  useEffect(() => {
    getData();
  }, [columnpage]);

  useEffect(() => {
    getData();
  }, [currentPage]);

  const getData = () => {
    if (showPagging === true) {
      if (data.length == 0) {
        setDataList([]);
      } else {
        const list = data?.slice(
          (currentPage - 1) * columnpage,
          (currentPage - 1) * columnpage + columnpage
        );
        setDataList(list);
      }
    } else {
      setDataList(data);
    }
  };

  const goPreviousClick = () => {
    if (currentPage == 1) return;
    setCurrentPage(currentPage - 1);
  };

  const goNextClick = () => {
    if (Math.ceil(data?.length / columnpage) == currentPage) return;
    setCurrentPage(currentPage + 1);
  };

  const goFirstPage = () => {
    setCurrentPage(1);
  };

  const goLastPage = () => {
    setCurrentPage(Math.ceil(data?.length / columnpage));
  };

  const sortOrders = (property) => {
    //his.sortIcon = this.sortReverse == true ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc';

    setSortReverse(!sortReverse);
    data?.sort(dynamicSort(property));
    getData();
  };

  const dynamicSort = (property) => {
    let sortOrder = -1;

    if (property.includes(".")) {
      property = property.split(".")[0];
    }

    if (sortReverse) {
      sortOrder = 1;
    }

    return function (a, b) {
      let result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  };

  const handleAllCheckClick = (e) => {
    allCheckClick(e);
  };

  const setActiveRow = (index) => {
    setActive(index);
  };

  return (
    <div>
      {tableStyle === "list" && (
        <div className={`${showCard ? "card p-4" : "p-2"}`}>
          <div className="overflow-x-auto">
            <table
              className={`table table-auto w-full ${
                showBorder ? "table_bordered" : ""
              }`}
            >
              {/* table_striped */}
              <thead>
                {/*                 
                <tr>
                  {column
                    ?.filter((x) => x.type === "topic")
                    ?.map((item, index) => (
                      <th
                        colSpan={item.colspan}
                        rowSpan={item.rowspan}
                        key={index}
                        className={item.class}
                      >
                        {item.label}
                      </th>
                    ))}
                </tr> 
                */}

                {/* <tr> */}
                {/* {column
                    //.filter((x) => x.type !== "topic")
                    .map((item, index) => ( */}
                <TableHeadItem
                  //key={index}
                  //item={item}
                  column={column}
                  clickSort={sortOrders}
                  allClick={handleAllCheckClick}
                  data={dataList}
                />
                {/* ))} */}
                {/* </tr> */}
              </thead>
              <tbody>
                {dataList.length === 0
                  ? !isLoading && (
                      <tr>
                        <td
                          className="text-center font-semibold"
                          colSpan={column.length}
                        >
                          <strong className="text-red-500">
                            Data not found !!!
                          </strong>
                        </td>
                      </tr>
                    )
                  : dataList.map((item, index) => (
                      <TableRow
                        eventClick={actionClick}
                        eventCheckClick={checkClick}
                        eventRadioClick={radioClick}
                        subTable={subTable}
                        key={index}
                        item={item}
                        column={column.filter((x) => x.type !== "topic")}
                        index={index}
                        active={active === index}
                        onSelectedRow={() => {
                          setActiveRow(index);
                        }}
                      />
                    ))}
              </tbody>
              {isLoading && (
                <tfoot>
                  <tr>
                    <td colSpan={column.length}>
                      <div className="flex justify-center">
                        <img src={loading} alt="loading..." />
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
              {showSammary && (
                <thead>
                  <tr>
                    <TableSummary
                      data={totalList}
                      column={column.filter(
                        (x) => x.type !== "topic" //&& x.total === true
                      )}
                    />
                    {/* {column
                      .filter((x) => x.type !== "topic")
                      .map((item, index) => (
                        <TableSummary
                          key={index}
                          item={item}
                          data={totalList}
                        />
                      ))} */}
                  </tr>
                </thead>
              )}
            </table>
          </div>
        </div>
      )}
      {tableStyle === "row" && (
        <div className="flex flex-col gap-y-5">
          <div className="card card_row card_hoverable">
            <div>
              <div className="image">
                <div className="aspect-w-4 aspect-h-3">
                  <img src="assets/images/potato.jpg" />
                </div>
                <div className="badge badge_outlined badge_secondary uppercase absolute top-0 right-0 rtl:left-0 mt-2 mr-2 rtl:ml-2">
                  Draft
                </div>
              </div>
            </div>
            <div className="header">
              <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h5>
              <p>
                Nunc et tincidunt tortor. Integer pellentesque bibendum neque,
                ultricies semper neque vulputate congue. Nunc fringilla mi sed
                nisi finibus vulputate. Nunc eu risus velit.
              </p>
            </div>
            <div className="body">
              <h6 className="uppercase">Views</h6>
              <p>100</p>
              <h6 className="uppercase mt-4 lg:mt-auto">Date Created</h6>
              <p>December 15, 2019</p>
            </div>
            <div className="actions">
              <div className="dropdown -ml-3 rtl:-mr-3 lg:ml-auto lg:rtl:mr-auto">
                <button className="btn-link" data-toggle="dropdown-menu">
                  <span className="la la-ellipsis-v text-4xl leading-none" />
                </button>
                <div className="dropdown-menu">
                  <a href="#">Dropdown Action</a>
                  <a href="#">Link</a>
                  <hr />
                  <a href="#">Something Else</a>
                </div>
              </div>
              <a
                href="#"
                className="btn btn-icon btn_outlined btn_secondary mt-auto ml-auto rtl:mr-auto lg:ml-0 lg:rtl:mr-0"
              >
                <span className="la la-pen-fancy" />
              </a>
              <a
                href="#"
                className="btn btn-icon btn_outlined btn_danger lg:mt-2 ml-2 rtl:mr-2 lg:ml-0 lg:rtl:mr-0"
              >
                <span className="la la-trash-alt" />
              </a>
            </div>
          </div>
        </div>
      )}
      {showPagging && (
        <div className="mt-2">
          <Pagination
            page={currentPage}
            totalpage={Math.ceil(data?.length / columnpage)}
            columnpage={columnpage}
            onPreviousClick={goPreviousClick}
            onNextClick={goNextClick}
            onFirstPageClick={goFirstPage}
            onLastPageClick={goLastPage}
            onPageChange={(page) => setColumnpage(page)}
            showColumnpage={showPaggingButton}
          />
        </div>
      )}
    </div>
  );
};

const TableHeadItem = ({ column, clickSort, allClick, data }) => {
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    //if (item?.key !== "check") return;

    if (data?.filter((x) => x.Check === true).length === 0) {
      setCheckAll(false);
    }
  }, [data]);

  return (
    <>
      {/* rowspan & topic-colspan */}
      <tr>
        {column
          .filter((x) => x.rowspan > 1)
          .map((item, index) => (
            <th
              key={index}
              rowSpan={item.rowspan}
              className={`uppercase ${
                item.class !== undefined ? item.class : ""
              }`}
            >
              {item.label}
            </th>
          ))}
        {column
          .filter((x) => x.type === "topic")
          .map((item, index) => (
            <th
              key={index}
              colSpan={item.colspan}
              className={`uppercase ${
                item.class !== undefined ? item.class : ""
              }`}
            >
              {item.label}
            </th>
          ))}
      </tr>
      <tr>
        {column
          .filter((x) => x.type !== "topic" && !x.rowspan)
          .map((item, index) => (
            <th
              key={index}
              style={{ textAlign: item.align, cursor: "pointer" }}
              className={`uppercase ${
                item.class !== undefined ? item.class : ""
              }`}
              onClick={() => clickSort(item.key)}
            >
              {item.key === "check" ? (
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    name="check"
                    //value={checkAll}
                    checked={checkAll}
                    onChange={(e) => {
                      setCheckAll(!checkAll);
                      allClick(!checkAll);
                    }}
                  />
                  <span></span>
                </label>
              ) : (
                item.label
              )}
            </th>
          ))}
      </tr>
    </>
  );
};

const TableRow = ({
  subTable,
  item,
  column,
  eventClick,
  eventCheckClick,
  eventRadioClick,
  index,
  active,
  onSelectedRow,
}) => {
  return (
    <>
      <tr
        key={index}
        className={`${index % 2 === 0 ? "even" : "odd"} ${
          active ? "hoverTable z-50" : ""
        }`}
        onClick={onSelectedRow}
      >
        {column?.map((col, index) => {
          return (
            <td
              className={`cursor-pointer ${col.class} ${
                col.align === "center" ? "text-center" : `text-${col.align}`
              } ${col.key !== "button" ? (subTable ? `align-top` : ``) : ``}`}
              key={index}
            >
              <ActionCase
                buttonClick={eventClick}
                checkClick={eventCheckClick}
                radioClick={eventRadioClick}
                item={item}
                column={col}
              />
            </td>
          );
        })}
      </tr>
    </>
  );
};

const TableSummary = ({ data, column }) => {
  const [dataList, setDataList] = useState();
  useEffect(() => {
    if (data?.length === 0) return;
    setDataList(data);
  }, [data]);

  // useEffect(() => {
  //   if (dataList === undefined) return;
  //   console.log(dataList);
  // }, [dataList]);

  return (
    <>
      {dataList !== undefined &&
        column.map((x, index) => {
          return (
            <th
              key={index}
              style={{ textAlign: x.align, color: "#0284c7", paddingRight: 4 }}
              //className="uppercase"
              className={`uppercase ${x.class !== undefined ? x.class : ""}`}
            >
              {x.total === true
                ? dataList[x.key]
                  ? dataList[x.key]?.toLocaleString(undefined, {
                      minimumFractionDigits: x.digit,
                      maximumFractionDigits: x.digit,
                    })
                  : dataList[
                      (x.columnOther + "." + x.key).toLocaleLowerCase()
                    ]?.toLocaleString(undefined, {
                      minimumFractionDigits: x.digit,
                      maximumFractionDigits: x.digit,
                    })
                : ""}
            </th>
          );
        })}
      {/* <th
        style={{ textAlign: item.align, color: "#0284c7", paddingRight: 4 }}
        className="uppercase"
      >
        {item.total
          ? data[item.key]?.toLocaleString(undefined, {
              minimumFractionDigits: item.digit,
              maximumFractionDigits: item.digit,
            })
          : ""}
      </th> */}
    </>
  );
};

const ActionCase = ({ item, column, buttonClick, checkClick, radioClick }) => {
  let col = column.key.toLowerCase();
  switch (col) {
    case "button":
      {
        return column.action.map((Item, index) => {
          switch (Item.event) {
            case "add":
              //console.log("edit => ",item[Item.display])
              return (
                (Item.display === true || item[Item.display] === false) && (
                  <span key={index}>
                    <button
                      type="button"
                      className="btn btn-icon btn_outlined btn_primary mr-1 cursor-pointer"
                      title={`${Item.event}`}
                      onClick={() => buttonClick(Item.event, item)}
                    >
                      <span className="la la-plus-square" />
                    </button>
                  </span>
                )
              );
              break;
            case "edit":
              //console.log("edit => ",Item.display, item[Item.display])
              return (
                (Item.display === true || item[Item.display] === false) && (
                  <span key={index}>
                    <button
                      type="button"
                      className="btn btn-icon btn_outlined btn_primary mr-1 cursor-pointer"
                      title={`${Item.event}`}
                      onClick={() => buttonClick(Item.event, item)}
                    >
                      <span className="la la-pen-fancy" />
                    </button>
                  </span>
                )
              );
              break;
            case "view":
              return (
                <span key={index}>
                  <button
                    type="button"
                    className="btn btn-icon btn_outlined btn_primary mr-1 cursor-pointer"
                    title={`${Item.event}`}
                    onClick={() => buttonClick(Item.event, item)}
                  >
                    <span className="la la-window-restore" />
                  </button>
                </span>
              );
              break;
            case "print":
              return (
                <span key={index}>
                  <button
                    type="button"
                    className="btn btn-icon btn_outlined btn_primary mr-1 cursor-pointer"
                    title={`${Item.event}`}
                    onClick={() => buttonClick(Item.event, item)}
                  >
                    <span className="la la-print" />
                  </button>
                </span>
              );
              break;
            case "delete":
              //console.log("delete => ",Item.display,item[Item.display])
              return (
                (Item.display === true || item[Item.display] === false) && (
                  <span key={index}>
                    <button
                      type="button"
                      className="btn btn-icon btn_outlined btn_danger mr-1 cursor-pointer"
                      title={`${Item.event}`}
                      onClick={() => buttonClick(Item.event, item)}
                    >
                      <span className="la la-trash-alt" />
                    </button>
                  </span>
                )
              );
              break;
            case "export":
              return (
                <span key={index}>
                  <button
                    type="button"
                    className="btn btn-icon btn_outlined btn_primary mr-1 cursor-pointer"
                    title={`${Item.event}`}
                    onClick={() => buttonClick(Item.event, item)}
                  >
                    <span className="la la-file-alt text-xl leading-none" />
                  </button>
                </span>
              );
              break;
          }
        });
      }
      break;
    case "check":
      {
        //console.log("table check => ", checked, checkItem);
        return (
          item.display && (
            <label className="custom-checkbox">
              <input
                type="checkbox"
                name="check"
                checked={item?.Check}
                onChange={() => {
                  checkClick(item);
                }}
              />
              <span></span>
            </label>
          )
        );
      }
      break;
    case "radio":
      {
        return (
          <label className="custom-radio">
            <input
              type="radio"
              name="radio"
              checked={item?.Checked}
              //value={item.Id}
              //className="custom-control-input"
              onChange={() => radioClick(item)}
            />
            <span></span>
          </label>
        );
      }
      break;
    default:
      let data = "";
      let style = "";
      if (column.filter === true) {
        let [value] = item.Details.filter(
          (x) => Number(x.Id) === Number(column.key)
        );
        data = value[column.columnOther];
        //console.log(data)
        if (column?.checkDiff) {
          if (value[column.checkDiff] !== 0) {
            //console.log(column.checkDiff,value[column.checkDiff]);
            style = column.colorDiff;
          }
        }
        //console.log("value => ",value,column)
      } else {
        if (column.key.includes(".")) {
          data =
            item[column.key.split(".")[0]] === null
              ? null
              : item[column.key.split(".")[0]][column.key.split(".")[1]];
        } else {
          data = item[column.key];
        }
      }
      return (
        <>
          <Format
            data={data}
            format={column.format}
            digit={column.digit}
            text={column.text}
            style={style}
          />
          {column?.description && <p>{item[column.description]}</p>}
        </>
      );
      break;
  }
};

const SummaryColumn = (data, column, dataTotal) => {
  let col = column.filter((x) => x.total === true && x.type !== "topic");
  const datalist = dataTotal === undefined ? data : dataTotal;

  const output = datalist.reduce((acc, item) => {
    col.forEach((x) => {
      if (x.filter === true) {
        let [d] = item.Details.filter((w) => Number(w.Id) === Number(x.key));
        let keygen = (
          x.columnOther +
          "." +
          d.Id.toString()
        ).toLocaleLowerCase();
        acc[keygen] = (acc[keygen] || 0) + d[x.columnOther];
      } else {
        acc[x.key] = (acc[x.key] || 0) + item[x.key];
      }
    });

    acc.ClientName = "Total";
    return acc;
  }, {});
  return output;
};

const ButtonCase = () => {};
export default Table;
