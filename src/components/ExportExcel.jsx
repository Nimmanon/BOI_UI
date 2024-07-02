import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Moment from "moment";

const ExportExcel = ({ data, headExport, name, mini = false }) => {
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setFileName(name + "_" + Moment().format("YYYY-MM-DD_HH:mm:ss"));
  }, [name]);

  const handleOnExport = () => {
    if (headExport) {
      let exportData = data.map((item) => {
        return selectColumn(item);
      });
      //console.log(exportData);

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, fileName + ".xlsx");
    }
  };

  const selectColumn = (item) => {
    const container = {};
    headExport
      .filter((x) => x.export === true)
      .forEach((column) => {
        let data = "";
        if (column.filter === true) {
          let [value] = item.Details.filter(
            (x) => Number(x.Id) === Number(column.key)
          );
          data = value[column.columnOther]; //value?.Budget;
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

        container[column.label] = setFormat(data, column.format, column.digit, column.text)
      });

    // headExport.filter(x => x.export === true)
    //     .forEach(val => {
    //         let data = (val.key.includes('.')) ?
    //             item[val.key.split('.')[0]] === null ? null : item[val.key.split('.')[0]][val.key.split('.')[1]]
    //             : item[val.key];

    //         container[val.label] = setFormat(data, val.format, val.digit, val.text)

    //     });
    return container;
  };

  const setFormat = (data, format, digit, text) => {
    if (data === undefined) return;
    //console.log("FormatCase => ", data, format, digit)
    switch (format) {
      case "number":
        return !isNaN(data)
          ? data?.toLocaleString(undefined, {
              minimumFractionDigits: digit,
              maximumFractionDigits: digit,
            })
          : data;
        break;
      case "textonum":
        return !isNaN(data)
          ? Number(data)?.toLocaleString(undefined, {
              minimumFractionDigits: digit,
              maximumFractionDigits: digit,
            })
          : data;
        break;
      case "string":
        return data;
        break;
      case "datetime":
        return data === null ? "" : Moment(data).format("DD/MM/YYYY HH:mm:ss");
        break;
      case "date":
        return data === null ? "" : Moment(data).format("DD/MM/YYYY");
        break;
      case "shotdate":
        return data === null ? "" : Moment(data).format("DD-MMM-YY");
        break;
      case "tag":
        return data === true ? text : "";
        break;
      case "status":
        return data === true ? text.split(",")[0] : text.split(",")[1];
        break;
    }
  };

  return (
    <div>
      {mini && (
        <button
          type="submit"
          className="btn btn_info mt-5 mb-2 ml-2"
          onClick={handleOnExport}
          title="Export excel data"
        >
          <span className="la la-file-export" />
        </button>
      )}
      {!mini && (
        <button
          onClick={handleOnExport}
          className="btn btn_primary btn_outlined uppercase"
        >
          <span className="la la-file-alt text-xl leading-none"></span>
          Export Data
        </button>
      )}
    </div>
  );
};

export default ExportExcel;
