import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import Panel from "../../components/Panel";
import Search from "../../components/Search";
import Table from "../../components/Table";
import APIService from "../../services/APIService";

const ManageBudgetList = () => {
  const [setDataSelected, setAction, setDataSearch, dataSearch] =
    useOutletContext();

  const [dataList, setDataList] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [projectTitle, setProjectTitle] = useState([]);

  const [search, setSearch] = useState();
  //const [dataSearch, setDataSearch] = useState();
  const [display, setDisplay] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [column, setColumn] = useState([]);

  const navigate = useNavigate();
  const effectRan = useRef(false);

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();

  const columnTable = [
    {
      label: "วัตถุประสงค์",
      key: "Name",
      align: "left",
      format: "string",
      export: true,
      filter: false,
      rowspan: 2,
    },
    {
      label: "งบประมาณ",
      key: "Budget",
      align: "right",
      format: "number",
      digit: "2",
      export: true,
      filter: false,
      total: true,
      rowspan: 2,
    },
    {
      label: "งบประมาณโครงการ",
      key: "",
      align: "center",
      format: "string",
      export: true,
      type: "topic",
      colspan: 3,
    },
    {
      label: "งบประมาณโครงการ(ปรับปรุง)",
      key: "",
      align: "center",
      format: "string",
      export: true,
      type: "topic",
      colspan: 3,
      class: "bg-sky-200",
    },
  ];

  useEffect(() => {
    if (effectRan.current == false) {
      //getData();
      setInitial();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  const addNew = () => {
    navigate("/ManageBudget/new");
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
    setProjectTitle([]);

    APIService.postByObject("Budget/GetBySearch", data)
      .then((res) => {
        let data = res.data;
        setIsLoading(false);
        //console.log("Budget =>", data);

        let projectList = [];
        data?.forEach((item) => {
          item.Details?.forEach((x) => {
            if (!projectList.some((w) => w.Id === x.Id)) {
              let p = {};
              p.Id = x.Id;
              p.Name = x.Name;
              projectList.push(p);
            }
          });
        });

        setProjectTitle(projectList);
        setDataList(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (dataSearch === undefined) return;
    //console.log("dataSearch => ",dataSearch)
    //getProject(dataSearch?.BOI?.Id);
    getData(dataSearch);
  }, [dataSearch]);

  useEffect(() => {
    getSearch(search);
  }, [dataList]);

  useEffect(() => {
    if (projectTitle?.length === 0) return;

    projectTitle?.forEach((x) => {
      let col = {
        label: x.Name,
        key: x.Id.toString(),
        align: "right",
        format: "number",
        digit: "2",
        export: true,
        filter: true,
        total: true,
        columnOther: "Budget",
        checkDiff : "DiffBudget",
        colorDiff : "warning"
      };

      columnTable.push(col);
    });

    projectTitle?.forEach((x, index) => {
      let col = {
        label: x.Name,
        key: x.Id.toString(),
        align: "right",
        format: "number",
        digit: "2",
        export: true,
        filter: true,
        total: true,
        columnOther: "JobBudget",
        class: "bg-sky-200",
      };

      columnTable.push(col);
    });

    let col = {
      label: "",
      key: "button",
      align: "center",
      format: "",
      action: [{ event: "view", display: display }],
    };

    columnTable.push(col);

    setColumn(columnTable);
  }, [projectTitle]);

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
        headExport={column}
        name={"ManageBudget"}
      />
      <Search
        showBOI={true}
        showObjective={true}
        onSearchCliek={handleSearchClick}
        data={dataSearch}
      />

      <Table
        data={dataTable}
        column={column}
        actionClick={buttonTableClick}
        tableStyle={"list"}
        isLoading={isLoading}
        showSammary={true}
        showBorder={true}
      />
    </div>
  );
};

export default ManageBudgetList;
