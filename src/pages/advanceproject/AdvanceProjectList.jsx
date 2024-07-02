import { useEffect, useState, useRef } from "react";
import Panel from "../../components/Panel";
import Search from "../../components/Search";
import Table from "../../components/Table";
import APIService from "../../services/APIService";
import { useNavigate, useOutletContext } from "react-router-dom";

const AdvanceProjectList = () => {
  const [setDataSelected, setAction, setDataSearch, dataSearch] = useOutletContext();

  const [dataList, setDataList] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  const [search, setSearch] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [display, setDisplay] = useState(true);

  const navigate = useNavigate();
  const effectRan = useRef(false);

  const columnTable = [
    {
      label: "เลขที่เอกสาร",
      key: "DocumentNo",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "วันที่",
      key: "Advanceor",
      align: "left",
      format: "shotdate",
      export: true,
    },
    {
      label: "ผู้ขอเบิก",
      key: "Requestor",
      align: "left",
      format: "string",
      export: true,
    },  
    {
      label: "เบิกจาก",
      key: "Owner",
      align: "left",
      format: "string",
      export: true,
    },  
    {
      label: "จ่ายให้",
      key: "ToOwner",
      align: "left",
      format: "string",
      export: true,
    },   
    {
        label: "โครงการ",
        key: "Project",
        align: "left",
        format: "string",
        export: true,
      },   
    {
      label: "วัตถุประสงค์เพื่อ",
      key: "Objective",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "จำนวนเงิน (บาท)",
      key: "Amount",
      align: "right",
      format: "number",
      digit:2,
      export: true,     
    },   
    {
      label: "หมายเหตุ",
      key: "Remark",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "สถานะ",
      key: "IsActive",
      align: "center",
      format: "status",
      text: "Active,Voied",
      export: true,
    },
    {
      label: "",
      key: "button",
      align: "center",
      format: "",
      action: [
        //{ event: "edit", display: "display" },
        // { event: "delete", display: 'IsActive' },
        { event: "view", display: true },
      ],
    },
  ];

  const addNew = () => {
    navigate("/advanceproject/new");
    setAction("new");
  };

  const buttonTableClick = (act, value) => {
    if (!act) return;

    if (act === "view") {
      setDataSelected(value);
      setAction(act);
    }
  };

  const getData = (data) => {
    setIsLoading(true);
    setDataList([]);
    APIService.Post("Advance/GetBySearch", data)
      .then((res) => {
        setDataList(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (dataSearch === undefined) return;
    getData(dataSearch);
  }, [dataSearch]);

  useEffect(() => {
    getSearch(search);
  }, [dataList]);  

  const getSearch = (textSearch) => {
    if (!textSearch) {
      setDataTable(dataList);
    } else {
      let val = textSearch.toLowerCase();
      let items = dataList.filter(function (data) {
        return JSON.stringify(data).toLowerCase().includes(val);
      });
      setDataTable(items);
    }
  };

  const handleSearchClick = (data) => {
    setDataSearch(data);
  };

  return (
    <div>
      <Panel
        onAddNew={addNew}
        onSearchChange={getSearch}
        showAdd={true}
        showExport={true}
        showSearch={true}
        setViewStyle={"list"}
        //export csv file
        data={dataTable}
        headExport={columnTable}
        name={"Advance"}
      />
      <Search
        showperiod={true}       
        onSearchCliek={handleSearchClick}
        data={dataSearch}
      />
      <Table
        data={dataTable}
        column={columnTable}
        actionClick={buttonTableClick}
        tableStyle={"list"}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdvanceProjectList;
