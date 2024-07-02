import moment from "moment";
import React from "react";
import { useEffect } from "react";

const Format = ({ data, format, digit, text, style }) => {
  useEffect(() => {
    if (data === undefined || data === "" || data === null) return;
    //console.log("data => ", data, " format => ", format);
  }, [data]);

  switch (format) {
    case "number":
      let value = data?.toLocaleString(undefined, {
        minimumFractionDigits: digit,
        maximumFractionDigits: digit,
      });
      return style !== "" ? (
        <div className={`badge badge_${style} text-sm font-bold`}>{value}</div>
      ) : (
        value
      );
      //   return data?.toLocaleString(undefined, {
      //     minimumFractionDigits: digit,
      //     maximumFractionDigits: digit,
      //   });
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
      return style !== "" ? (
        <div className={`badge badge_${style}`}>{data}</div>
      ) : (
        data
      );
      break;
    case "datetime":
      return data === null ? null : moment(data).format("DD/MM/YYYY HH:mm:ss");
      break;
    case "date":
      return data === null ? null : moment(data).format("DD/MM/YYYY");
      break;
    case "shotdate":
      return data === null ? null : moment(data).format("DD-MMM-YY");
      break;
    case "shotdatetime":
      return data === null ? null : moment(data).format("DD-MMM-YY HH:mm");
      break;
    case "tag":
      return <div className="badge badge_info">{data}</div>;
      break;
    case "status":
      return (
        <div
          className={`badge ${data === true ? "badge_info" : "badge_warning"}`}
        >
          {data === true ? text.split(",")[0] : text.split(",")[1]}
        </div>
      );
      break;
    case "progress":
      return (
        <div
          className={`badge ${
            data === 0
              ? "badge_warning"
              : data === 1
              ? "badge_success"
              : "badge_info"
          }`}
        >
          {data === 0
            ? text.split(",")[0]
            : data === 1
            ? text.split(",")[1]
            : text.split(",")[2]}
        </div>
      );
      break;
    case "boolean":
      return data?.toLocaleString();
      break;
  }
};

export default Format;
