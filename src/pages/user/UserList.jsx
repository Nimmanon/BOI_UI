import { useEffect, useRef, useState } from "react";
import Panel from "../../components/Panel";
import Search from "../../components/Search";
import Table from "../../components/Table";
import APIService from "../../services/APIService";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomModal from "../../components/CustomModal";
import MassageBox from "../../components/MassageBox";

const UserList = () => {
  const [setDataSelected, setAction, setDataSearch, dataSearch] =
    useOutletContext();

  const [dataList, setDataList] = useState([]);
  const [dataTable, setDataTable] = useState([]);  
  const [isLoading, setIsLoading] = useState(false);

  //modal
  const [show, setShow] = useState(false);
  const [content, setContent] = useState({ Id: 0, Name: "" });

  //MassageBox
  const [showMsb, setShowMsb] = useState(false);
  const [contentMsb, setContentMsb] = useState({ Id: 0, Name: "" });

  const [search, setSearch] = useState();
  const [display, setDisplay] = useState(true);

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const [usergroup, setUserGroup] = useState();

  const navigate = useNavigate();
  const effectRan = useRef(false);

  const column = [
    {
      label: "FirstName",
      key: "FirstName",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "LastName",
      key: "LastName",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Email",
      key: "Email",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Username",
      key: "Username",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Group",
      key: "GroupName",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Level",
      key: "LevelName",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Project",
      key: "ProjectName",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Status",
      key: "IsActive",
      align: "center",
      format: "status",
      text: "Active,Inactive",
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
    if (effectRan.current == false) {
      setInitial();
      getData();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;

    setUserId(atob(auth.Id));
    let group = btoa(JSON.stringify(auth.Group));
    setUserGroup(group?.Name?.toLowerCase());

    localStorage.setItem("_page", "Manage Account");
    localStorage.setItem("_path", localStorage.getItem("_page"));
  };  

  const addNew = () => {
    navigate("/user/new");
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
    APIService.getAll("Auth/GetAll")
      .then((res) => {
        //console.log(res.data);
        setDataList(res.data);
        setIsLoading(false);
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

  const handledSaveChange = (newItem) => {
    newItem.InputBy = userId;
    //send newItem to api
    APIService.Post("Auth/Register", newItem)
      .then((res) => {
        if (res.status !== 200) return;
        setDataList((prevItem) => {
          return [res.data, ...prevItem];
        });
        setShow(false);
        setAction("");
      })
      .catch((err) => console.log(err));
  };

  const handledUpdateChange = (newItem) => {
    //console.log(newItem);
    newItem.InputBy = userId;
    APIService.Put("Auth/Put", newItem)
      .then((res) => {
        if (res.status !== 200) return;
        //remove old array
        let items = dataList.filter((item) => item.Id !== content.Id);
        setDataList(items);
        setDataList((prevItem) => {
          return [res.data, ...prevItem];
        });
        setShow(false);
        setAction("");
      })
      .catch((err) => console.log(err));
  };

  const handledDeleteItem = () => {
    //delete data from api
    let credentials = { Id: contentMsb?.Id, InputBy: userId };
    APIService.postByObject("Auth/Delete", credentials)
      .then((res) => {
        if (res.status !== 200) return;
        //remove array
        let items = dataList.filter((item) => item.Id !== contentMsb.Id);
        setDataList(items);
        setDataList((prevItem) => {
          return [res.data, ...prevItem];
        });

        setShowMsb(false);
        setShow(false);
        setAction("");
      })
      .catch((err) => console.log(err));
  };

  const handleResetPassword = async () => {
    dataselected.InputBy = userId;

    APIService.Post("Auth/Reset", dataselected)
      .then((res) => {
        if (res.status !== 200) return;
        setShow(false);
        setAction("");
      })
      .catch((err) => console.log(err));
  };

  const handledCancelClick = () => {
    setShow(false);
    setAction("");
  };

  return (
    <>
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
        name={"User"}
      />

      <Table
        //subTable={true}
        data={dataTable}
        column={column}
        actionClick={buttonTableClick}
        tableStyle={"list"}
        isLoading={isLoading}
      />     

      <MassageBox
        show={showMsb}
        //action={action}
        name={"User"}
        content={contentMsb}
        size={"xl"}
        Massage={"Are you sure want to delete this user?"}
        handleCancelClick={() => {
          setShowMsb(false);
        }}
        onDeleteClick={handledDeleteItem}
      />
      <div className={`${showMsb ? "overlay active" : ""}`}></div>
    </>
  );
};

export default UserList;
