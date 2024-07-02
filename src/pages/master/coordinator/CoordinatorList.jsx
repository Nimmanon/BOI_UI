import { useEffect, useRef, useState } from "react";
import Panel from "../../../components/Panel";
import Search from "../../../components/Search";
import Table from "../../../components/Table";
import APIService from "../../../services/APIService";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
const CoordinatorList = () => {
  const [setDataSelected, setAction, setDataSearch, dataSearch] =
    useOutletContext();

  const [dataList, setDataList] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  const [search, setSearch] = useState();
  //const [dataSearch, setDataSearch] = useState();
  const [display, setDisplay] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const effectRan = useRef(false);

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();

  const columnTable = [
    {
      label: "Name",
      key: "Name",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Address",
      key: "Address",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Bank",
      key: "Bank",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Branch",
      key: "Branch",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "AccNo",
      key: "AccNo",
      align: "left",
      format: "string",
      export: true,
    },

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
  ];

  useEffect(() => {
    if (dataList?.length === 0) return;
    dataList.forEach((x) => {
      x.display = !x?.IsActive;
    });
    getSearch(search);
  }, [dataList]);

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
    navigate("/coordinator/new");
    setAction("new");
  };

  const buttonTableClick = (act, value) => {
    if (!act) return;

    if (act === "view") {
      setDataSelected(value);
      setAction(act);
    }
  };

  const getData = () => {
    setIsLoading(true);
    APIService.getAll("Owner/GetCoordinator")
      .then((res) => {
        setDataList(res.data);
        setIsLoading(false);
        // console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (dataSearch === undefined) return;
    //console.log(dataSearch)
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
        name={"Owner"}
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

export default CoordinatorList;
