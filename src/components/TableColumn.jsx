import { useEffect, useState } from "react";
import Format from "./Format";

const TableColumn = ({
  tableStyle = "list",
  showCard = true,
  column,
  data,
  checkClick,
  radioClick,
  actionClick,
  allCheckClick,
  subTable,
}) => {
  const [dataList, setDataList] = useState();
  const [dataTable, setDataTable] = useState();
  const [columnTable, setColumnTable] = useState();

  //select row
  const [active, setActive] = useState();

  useEffect(() => {
    if (data?.length === 0) return;
    setDataList(data);
  }, [data]);

  useEffect(() => {
    if (dataList === undefined) return;
    //createColumnTable();
    //console.log("table => column => ",column)
  }, [dataList]);

  //   useEffect(() => {
  //     if (columnTable === undefined) return;
  //     console.log("columnTable => ", columnTable);
  //   }, [columnTable]);

  //   const createColumnTable = () => {
  //     let projectList = [];
  //     dataList?.forEach((item) => {
  //       item.Details?.forEach((x) => {
  //         if (!projectList.some((w) => w.Id === x.Id)) {
  //           let p = {};
  //           p.Id = x.Id;
  //           p.Name = x.Name;
  //           projectList.push(p);
  //         }
  //       });
  //     });

  //     let tmpColumn = ([] = column);
  //     projectList?.forEach((x) => {
  //       let col = {
  //         label: x.Name,
  //         key: x.Id,
  //         align: "right",
  //         format: "number",
  //         digit: "2",
  //         export: true,
  //       };

  //       tmpColumn.push(col);
  //     });
  //     console.log("column => ", tmpColumn);
  //     setColumnTable(tmpColumn);
  //   };

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
      <div className="card p-3">
        <div className="overflow-x-auto">
          <table className="table table-auto w-full">
            <thead>
              <tr>
                {column?.map((item, index) => (
                  <TableHeadItem
                    key={index}
                    item={item}
                    clickSort={sortOrders}
                    allClick={handleAllCheckClick}
                    data={dataList}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {dataList?.map((item, index) => (
                <TableRow
                  eventClick={actionClick}
                  eventCheckClick={checkClick}
                  eventRadioClick={radioClick}
                  subTable={subTable}
                  key={index}
                  item={item}
                  column={column}
                  index={index}
                  active={active === index}
                  onSelectedRow={() => {
                    setActiveRow(index);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TableHeadItem = ({ item, clickSort, allClick, data }) => {
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    if (item?.key !== "check") return;

    if (data?.filter((x) => x.Check === true).length === 0) {
      setCheckAll(false);
    }
  }, [data]);

  return (
    <th
      style={{ textAlign: item.align, cursor: "pointer" }}
      className="uppercase"
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
          active ? "hoverTable" : ""
        }`}
        onClick={onSelectedRow}
      >
        {column?.map((col, index) => {
          return (
            <td
              className={`cursor-pointer ${
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

const ActionCase = ({ item, column, buttonClick, checkClick, radioClick }) => {
    let data ="";
    if(column.filter === true){
        let [value] = item.Details.filter(x=>x.Id === column.key);
        data = value?.Budget;
    }else{
        data = item[column.key];
    }
    return (
    <>
        <Format
          data={data}
          format={column.format}
          digit={column.digit}
          text={column.text}
        />
        
      {column?.description && <p>{item[column.description]}</p>}
    </>
  );
};

export default TableColumn;
