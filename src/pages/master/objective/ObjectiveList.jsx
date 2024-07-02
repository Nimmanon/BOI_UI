import { useEffect, useRef, useState } from "react";
import Panel from "../../../components/Panel";
import Table from "../../../components/Table";
import APIService from "../../../services/APIService";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import Search from "../../../components/Search";

const ObjectiveList = () => {
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
    },
    {
      label: "งบประมาณ",
      key: "Budget",
      align: "right",
      format: "number",
      digit: "2",
      export: true,
      filter: false,
      total:true
    },
    /*
    {
      label: "Active",
      key: "IsActive",
      align: "center",
      format: "status",
      text: "Active,Inactived",
      export: true,
    },
    {
      label: "",
      key: "button",
      align: "center",
      format: "",
      action: [{ event: "view", display: display }],
    },
    */
  ];

  // useEffect(() => {
  //   if (dataList?.length === 0) return;
  //   dataList.forEach((x) => {
  //     x.display = !x?.IsActive;
  //   });
  //   getSearch(search);
  // }, [dataList]);

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
    navigate("/objective/new");
    setAction("new");
  };

  const buttonTableClick = (act, value) => {
    if (!act) return;

    if (act === "view") {
      setDataSelected(value);
      setAction(act);
    }
  };

  // const getProject = (id) => {
  //   if(id === undefined) return;
  //   APIService.getAll("Project/GetByBOIId/" + id)
  //     .then((res) => {
  //       setProjectList(res.data);
  //       console.log("Project =>", res.data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  const getData = (data) => {
    setIsLoading(true);
    setDataList([]);
    setProjectTitle([]);
    //APIService.getAll("Objective/Get")
    APIService.postByObject("Objective/GetBySearch", data)
      .then((res) => {
        let data = res.data;
        setIsLoading(false);
        //console.log("Objective =>", data);

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
        total:true,
        columnOther : "Budget"
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

    //console.log(columnTable);

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
        name={"Objective"}
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
      />
    </div>
  );
};

export default ObjectiveList;
