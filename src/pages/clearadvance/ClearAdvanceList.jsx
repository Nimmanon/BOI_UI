import { useEffect, useState, useRef } from "react";
import Panel from "../../components/Panel";
import Search from "../../components/Search";
import Table from "../../components/Table";
import APIService from "../../services/APIService";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";

const ClearAdvanceList = () => {
  const [setDataSelected, setAction, setDataSearch, dataSearch] =
    useOutletContext();

  const [dataList, setDataList] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  const [column, setColumn] = useState([]);

  const [search, setSearch] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const effectRan = useRef(false);

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const [group, setGroup] = useState();
  const [project, setProject] = useState();

  let columnTable = [
    {
      label: "บัตรส่งเสริม(ฺBOI)",
      key: "BOI",
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
      label: "วงเงิน(บาท)",
      key: "Budget",
      align: "right",
      format: "number",
      digit: 2,
      export: true,
      total: true,
    },
    {
      label: "เบิกแล้ว(บาท)",
      key: "Withdraw",
      align: "right",
      format: "number",
      digit: 2,
      export: true,
      total: true,
    },
    {
      label: "เคลียร์แล้ว(บาท)",
      key: "Advance",
      align: "right",
      format: "number",
      digit: 2,
      export: true,
      total: true,
      class: "bg-sky-300",
    },
    {
      label: "ค้างเคลียร์(บาท)",
      key: "Balance",
      align: "right",
      format: "number",
      digit: 2,
      export: true,
      total: true,
      class: "bg-sky-300",
    },
    {
      label: "",
      key: "button",
      align: "center",
      format: "",
      action: [
        { event: "view", display: true },
        // { event: "add", display: true },
      ],
    },
  ];

  useEffect(() => {
    if (effectRan.current === false) {
      setInitial();
      setColumn(columnTable);
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
    setGroup(JSON.parse(auth.Group));
    setProject(JSON.parse(auth.Project));
  };

  useEffect(() => {
    if (project === undefined) return;
    if (group?.Name?.toLowerCase() === "user") {
      columnTable = columnTable.filter(
        (x) =>
          x.key.toLowerCase() !== "boi" && x.key.toLowerCase() !== "project"
      );

      setColumn(columnTable);

      let data = {};
      data.BOI = project.BOI;
      data.Project = project;
      getData(data);
    }
  }, [project]);

  const buttonTableClick = (act, value) => {
    if (!act) return;

    if (act === "view") {
      setDataSelected(value);
      setAction("new");
    }
  };

  const getData = (data) => {
    setIsLoading(true);
    setDataList([]);

    if (group?.Name?.toLowerCase() === "user") {
      data.Project = project;
    }

    APIService.postByObject("Job/GetBySearch", data)
      .then((res) => {
        setDataList(res.data);
        //console.log(res.data);
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
        // onAddNew={addNew}
        onSearchChange={getSearch}
        // showAdd={true}
        showExport={true}
        showSearch={true}
        setViewStyle={"list"}
        //export csv file
        data={column}
        headExport={columnTable}
        name={"Advance"}
      />

      {group?.Name && (
        <Search
          showBOI={group?.Name?.toLowerCase() === "admin" ? true : false}
          showProject={group?.Name?.toLowerCase() === "admin" ? true : false}
          showObjective={true}
          onSearchCliek={handleSearchClick}
          data={dataSearch}
        />
      )}
      {column.length !== 0 && (
        <Table
          data={dataTable}
          column={column}
          actionClick={buttonTableClick}
          tableStyle={"list"}
          isLoading={isLoading}
          showSammary={true}
        />
      )}
    </div>
  );
};

export default ClearAdvanceList;
