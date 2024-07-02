import FormInput from "../../components/FormInput";
import Select from "../../components/Select";
import FormTitle from "../../components/FormTitle";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";

const UserForm = () => {
  const [, setAction] = useOutletContext();

  const [groupList, setGroupList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [levelList, setLevelList] = useState([]);

  const [textGroup, setTextGroup] = useState("");
  const [textProject, setTextProject] = useState("");
  const [textLevel, setTextLevel] = useState("");

  const [data, setData] = useState();

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();

  const effectRan = useRef(false);
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    reset,
    setValue,
    setError,
    getValues,
    handleSubmit,
    clearErrors,
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
      reset();
      setAction("new");
      setInitial();
      getGroup();
      getLevel();
      getProject();
      return () => (effectRan.current = true);
    }
  }, []);

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

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val === null ? setError(name, { type: "required" }) : clearErrors(name);
  };

  const onSubmit = (value) => {
    // value.Details = fileList;
    value.Project =
      value.Project === "" || value.Project === undefined
        ? null
        : value.Project;
    value.InputBy = Number(userId);
    handleSaveClick(value);
  };

  const handleSaveClick = (data) => {
    //console.log("handleSaveClick=> ", data);
    APIService.Post("Auth/Register", data)

      .then((res) => {
        if (res.status !== 200) return;
        handleBackClick();
        //console.log("Level/Post", data);
      })
      .catch((err) => console.log(err));
  };

  const handleClearClick = () => {
    reset();
    clearErrors();

    setTextGroup(null);
    setTextLevel(null);
    setTextProject(null);
  };

  const handleBackClick = () => {
    navigate("/user");
    setAction("list");
  };

  return (
    <>
      <FormTitle action={"ADD NEW"} name={"User"} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid lg:grid-cols-6 gap-3 mt-3">
          <div className="lg:col-span-2 xl:col-span-2">
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
          <div>
            <button
              type="submit"
              className="btn btn btn_primary uppercase "
              onClick={handleBackClick}
            >
              <span className="la la-chevron-circle-left text-xl leading-none mr-1"></span>
              GO BACK
            </button>
          </div>

          <div className="ml-1">
            <div>
              <button type="submit" className="btn btn btn_primary uppercase">
                Save User
              </button>
            </div>
          </div>
          <div className="ml-1">
            <div>
              <button
                type="button"
                className="btn btn_outlined btn_secondary uppercase"
                onClick={handleClearClick}
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default UserForm;
