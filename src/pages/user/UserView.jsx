import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FormTitle from "../../components/FormTitle";
import APIService from "../../services/APIService";
import FormInput from "../../components/FormInput";
import MassageBox from "../../components/MassageBox";
import Select from "../../components/Select";
const UserView = () => {
  const [groupList, setGroupList] = useState([]);
  const [groupSelected, setGroupSelected] = useState();
  const [projectList, setProjectList] = useState([]);
  const [levelList, setLevelList] = useState([]);

  const [textGroup, setTextGroup] = useState("");
  const [textProject, setTextProject] = useState("");
  const [textLevel, setTextLevel] = useState("");

  const [setDataSelected, setAction] = useOutletContext();

  const [dataList, setDataList] = useState([]);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showReason, setShowReason] = useState(false);
  //const [canUpdate, setCanUpdate] = useState(true);

  const navigate = useNavigate();
  let params = useParams();

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();

  //MessageBox
  const [content, setContent] = useState();
  const [show, setShow] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const effectRan = useRef(false);

  const {
    register,
    formState: { errors },
    reset,
    getValues,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({
    defaultValues: {
      Id: 0,
      FirstName: "",
      LastName: "",
      Email: "",
      Username: "",
      Password: "",
      Group: null,
      Level: null,
      Project: null,
    },
  });

  useEffect(() => {
    if (effectRan.current === false) {
      setInitial();
      getData();
      getGroup();
      getLevel();
      getProject();
      return () => (effectRan.current = true);
    }
  }, []);

  const getData = () => {
    //แปลงจาก aray เป็น object
    if (params.id === undefined || params.id === null || params.id === 0)
      return;
    APIService.getById("Auth/GetById", params.id)
      .then((res) => {
        let [Auth] = res.data;
        setData(Auth);
        // console.log(Auth);
        console.log();
      })
      .catch((err) => console.log(err));
  };

  const getGroup = () => {
    APIService.getAll("Group/Get")
      .then((res) => {
        setGroupList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getLevel = () => {
    APIService.getAll("Level/Get")
      .then((res) => {
        setLevelList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getProject = () => {
    APIService.getAll("Project/Get")
      .then((res) => {
        setProjectList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  useEffect(() => {
    if (data === undefined || data === null) return;
    //console.log("User View data =>", data);
    setValue("Id", data?.Id);
    setValue("Name", data?.Name);
    setValue("Group", data?.Group);
    setValue("FirstName", data?.FirstName);
    setValue("LastName", data?.LastName);
    setValue("Level", data?.Level);
    setValue("Email", data?.Email);
    setValue("Username", data?.Username);
    setValue("Project", data?.Project);

    setTextGroup(data?.Group?.Name);
    setTextProject(data?.Project?.Name);
    setTextLevel(data?.Level?.Name);
  }, [data]);

  const handledDeleteItem = () => {
    var credential = { Id: data.Id, InputBy: userId };
    APIService.Post("Auth/Delete", credential)
      .then((res) => {
        if (res.status !== 200) return;
        setShow(false);
        handleBackClick();
      })
      .catch((err) => console.log(err));
  };

  const onSelectItem = async (e, name) => {
    setValue(name, e);
    e == null ? setError(name, { group: "required" }) : clearErrors(name);

    switch (name) {
      case "Group":
        setValue("Group", e);
        setGroupSelected(e);
        break;
      case "Project":
        setValue("Project", e);
        break;
      case "Level":
        setValue("Level", e);
        break;
    }
  };

  const onSubmit = (value) => {
    value.Project =
      value.Project === "" || value.Project === undefined
        ? null
        : value.Project;
    // console.log("onSubmit =>",value);
    // value.Details = fileList;
    value.InputBy = Number(userId);
    handleSaveClick(value);
  };

  const handleSaveClick = (data) => {
    //console.log("handleSaveClick=>Update ", data);
    APIService.Put("Auth/Put", data)
      .then((res) => {
        if (res.status !== 200) return;
        handleBackClick();
        // console.log("Request/Post", data);
      })
      .catch((err) => console.log(err));
  };

  const handleResetPassword = async () => {
    data.Email = getValues("Email");
    data.InputBy = userId;

    APIService.Post("Auth/Reset", data)
      .then((res) => {
        if (res.status !== 200) return;
        handleBackClick();
        setShowReset(false);        
      })
      .catch((err) => console.log(err));
  };

  const handleBackClick = () => {
    navigate("/user");    
    setAction("list");
  };

  return (
    <>
      <FormTitle action={"VIEW"} name={"User"} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid lg:grid-cols-3 gap-2">
          <div className="grid lg:grid-cols-1">
            <div className="card p-3">
              <div>
                <Select
                  list={groupList}
                  selectedText={textGroup}
                  onSelectItem={onSelectItem}
                  name="Group"
                  label="Group"
                  register={register}
                  type="text"
                  required
                  error={errors?.Group}
                />
              </div>
              <div>
                <Select
                  list={levelList}
                  selectedText={textLevel}
                  onSelectItem={onSelectItem}
                  name="Level"
                  label="Level"
                  register={register}
                  type="text"
                  required
                  error={errors?.Level}
                />
              </div>

              <div>
                <Select
                  list={projectList}
                  selectedText={textProject}
                  onSelectItem={onSelectItem}
                  name="Project"
                  label="Project"
                  register={register}
                  type="text"
                  error={errors?.Project}
                />
              </div>
              <div className="mt-5">
                <FormInput
                  name="FirstName"
                  label="FirstName"
                  register={register}
                  type="text"
                  required
                  error={errors.FirstName}
                />
              </div>
              <div className="mt-5">
                <FormInput
                  name="LastName"
                  label="LastName"
                  register={register}
                  type="text"
                  error={errors.LastName}
                />
              </div>

              <div className="mt-5">
                <FormInput
                  name="Email"
                  label="Email"
                  register={register}
                  type="text"
                />
              </div>
              <div className="mt-5">
                <FormInput
                  name="Username"
                  label="Username"
                  register={register}
                  type="text"
                  required
                  error={errors.Username}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex mt-2">
          <button
            type="submit"
            className="btn btn_primary uppercase "
            onClick={handleBackClick}
          >
            <span className="la la-chevron-circle-left text-xl leading-none mr-1 "></span>
            GO BACK
          </button>

          <button type="submit" className="btn btn_primary uppercase ml-2">
            Update User
          </button>
          <button
            type="button"
            className="btn btn_warning uppercase ml-2"
            onClick={() => setShowReset(true)}
          >
            Reset Password
          </button>

          <div className="ml-2">
            <div>
              <button
                type="button"
                className="btn btn_danger uppercase"
                onClick={() => setShow(true)}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      </form>

      <MassageBox
        show={show}
        action={"delete"}
        name={"User"}
        content={content}
        size={"xl"}
        Massage={"Are you sure want to delete this item?"}
        handleCancelClick={() => {
          setShow(false);
        }}
        onDeleteClick={handledDeleteItem}
      />
      <div className={`${show ? "overlay active" : ""}`}></div>

      <MassageBox
        show={showReset}
        action="confirm"
        name={"User"}
        size={"xl"}
        Massage={"Are you sure want to reset password this user?"}
        handleCancelClick={() => setShowReset(false)}
        onConfrimClick={handleResetPassword}
      />
      <div className={`${showReset ? "overlay active" : ""}`}></div>
    </>
  );
};
export default UserView;
