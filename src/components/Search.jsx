import APIService from "../services/APIService";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "./Select";
import ExportExcel from "./ExportExcel";
import moment from "moment";
import DatePicker from "./DatePicker";
import FormInput from "./FormInput";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Search = ({
  showExport = false,
  data,
  headExport,
  name,
  showperiod = false,
  requiredperiod = false,
  showBOI = false,
  showObjective = false,
  showProject = false,
  showLocation = false,
  showStLocation = false,
  showCategory = false,
  showProduct = false,
  showyearmonth = false,
  onSearchCliek,
  showCalLoading = false,
  showcal = false,
  onCalculateClick,
  showStatus = false,
}) => {
  const [boiList, setBOIList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [allProjectList, setAllProjectList] = useState([]);
  const [objectiveList, setObjectiveList] = useState([]);
  const [allObjectiveList, setAllObjectiveList] = useState([]);

  const [statusList, setStatusList] = useState([]);

  const [objective, setObjective] = useState();
  const [owner, setOwner] = useState();
  const [boi, setBOI] = useState();
  const [project, setProject] = useState();

  let current = new Date();
  let fday = new Date(current.getFullYear(), current.getMonth(), 1, 0, 0, 0, 0);
  let tday = new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate(),
    0,
    0,
    0,
    0
  );

  const [date, setDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showToDate, setShowToDate] = useState("");

  const [dataSearch, setDataSearch] = useState();

  const [year, setYear] = useState(current.getFullYear());
  const [month, setMonth] = useState(current.getMonth() + 1);

  const effectRan = useRef(false);
  const ref = useRef();
  const ref2 = useRef();
  const loc = useLocation();

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();
  const [userGroup, setUserGroup] = useState();
  const [userProject, setUserProject] = useState();

  const {
    formState: { errors },
    register,
    setValue,
    getValues,
    handleSubmit,
  } = useForm({
    defaultValues: {
      Id: 0,
      Year: null,
      Month: null,
      Date: null,
      ToDate: null,
      Owner: null,
      Location: null,
      Objective: null,
      Project: null,
    },
  });

  useEffect(() => {
    if (effectRan.current === false) {
      setInitial();
      if (showObjective === true) getObjective();
      if (showBOI === true) getBOI();
      if (showProject === true) getProject();
      if (showperiod) {
        setDate(fday);
        setToDate(tday);
      }
      //console.log("search data start => ", showBOI, showProject);
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
    setUserGroup(JSON.parse(auth.Group));
    setUserProject(JSON.parse(auth.Project));
  };

  useEffect(() => {
    if (data === undefined) return;
    setDataSearch(data);
    //console.log("search data search => ",data)
  }, [data]);

  const getBOI = async () => {
    APIService.getAll("BOI/Get")
      .then((res) => {
        setBOIList(res.data);
        //console.log("search data get boi => ", res.data);
      })
      .catch((err) => console.log(err));
  };

  const getObjective = async () => {
    APIService.getAll("Objective/Get")
      .then((res) => {
        setAllObjectiveList(res.data);
        setObjectiveList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (
      userGroup === undefined ||
      userProject === undefined ||
      allObjectiveList?.length === 0
    )
      return;

    if (userGroup?.Name?.toLowerCase() === "user") {
      let objList = allObjectiveList.filter(
        (x) => x.BOIId === userProject?.BOI?.Id
      );
      setObjectiveList(objList);
    }
  }, [userGroup, userProject, allObjectiveList]);

  const getProject = async () => {
    //console.log("get location")
    APIService.getAll("Project/GetList")
      .then((res) => {
        setAllProjectList(res.data);
        setProjectList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const onSelectItem = async (e, name) => {
    setValue(name, e == null ? null : e);
    setFilter(name.toLowerCase(), e);
  };

  const setFilter = (filter, item) => {
    let objList = [];
    let projList = [];

    switch (filter) {
      case "boi":
        setBOI(item);
        //filter objective
        objList = allObjectiveList?.filter((x) => x.BOIId === item?.Id);
        setObjectiveList([]);
        objList?.forEach((obj) => {
          setObjectiveList((prevItem) => {
            return [...prevItem, obj];
          });
        });

        //filter project
        projList = allProjectList.filter((x) => x.BOI.Id === item?.Id);
        setProjectList([]);
        projList?.forEach((p) => {
          setProjectList((prevItem) => {
            return [...prevItem, p];
          });
        });

        break;
      case "project":
        setProject(item);
        //filter objective
        objList = allObjectiveList?.filter((x) => x.BOIId === boi?.Id);
        setObjectiveList([]);
        objList?.forEach((obj) => {
          setObjectiveList((prevItem) => {
            return [...prevItem, obj];
          });
        });
        break;
    }
  };

  const handelSearchClick = () => {
    if (
      showperiod &&
      requiredperiod &&
      (date === undefined ||
        date === null ||
        toDate === undefined ||
        toDate === null)
    ) {
      return;
    }

    let credentials = {};
    if (showperiod === true) {
      credentials.Date =
        date === null || date === undefined
          ? null
          : moment(date).format("YYYY-MM-DD");

      credentials.ToDate =
        toDate === null || toDate === undefined
          ? null
          : moment(toDate).format("YYYY-MM-DD");
    }

    if (showBOI === true) {
      credentials.BOI =
        getValues("BOI")?.length === 0 ? null : getValues("BOI");
    }

    if (showProject === true) {
      credentials.Project =
        getValues("Project")?.length === 0 ? null : getValues("Project");
    }

    if (showObjective === true) {
      credentials.Objective =
        getValues("Objective")?.length === 0 ? null : getValues("Objective");
    }

    if (showyearmonth === true) {
      credentials.Year = year === "" || year === 0 ? null : year;
      credentials.Month = month === "" || month === 0 ? null : month;
    }

    if (showStatus === true) {
      let [status] = statusList.filter((x) => x.Id === 0);
      credentials.Status =
        getValues("Status")?.length === 0 ? status : getValues("Status");
    }

    //console.log("search panel onSearchClick =>", credentials);
    onSearchCliek(credentials);
  };

  const handelCalculateClick = () => {
    let credentials = {};
    credentials.Year = year;
    credentials.Month = month;
    credentials.BOI = boi?.length === 0 ? null : boi;
    credentials.Objective = objective?.length === 0 ? null : objective;
    credentials.Owner = owner?.length === 0 ? null : owner;
    onCalculateClick(credentials);
  };

  return (
    <>
      <div className="card p-3 mb-1">
        <div className="grid lg:grid-cols-7 gap-1">
          {showperiod && (
            <div className="flex flex-row xl:col-span-1 lg:col-span-1 gap-1">
              <DatePicker
                onChange={(fdate) => setDate(fdate)}
                placeholder="วันที่"
                format="d-MMM-yy"
                value={date || ""}
                required={requiredperiod}
                error={
                  requiredperiod
                    ? date === null || date === undefined
                      ? true
                      : false
                    : false
                }
              />
              <DatePicker
                onChange={(tdate) => setToDate(tdate)}
                placeholder="ถึงวันที่"
                format="d-MMM-yy"
                value={toDate || ""}
                required={requiredperiod}
                error={
                  requiredperiod
                    ? toDate === null || toDate === undefined
                      ? true
                      : false
                    : false
                }
              />
            </div>
          )}

          {showyearmonth && (
            <div className="flex flex-row xl:col-span-1 lg:col-span-1 gap-1">
              <input
                type="number"
                className="form-control is-invalid mt-1 mb-1 bg-yellow-100"
                placeholder="เลือกปี"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value <= 0 ? 1 : e.target.value);
                }}
              />
              <input
                type="number"
                className="form-control is-invalid ml-1 mb-1 mt-1 bg-yellow-100"
                value={month}
                placeholder="เลือกเดือน"
                onChange={(e) => {
                  setMonth(
                    e.target.value <= 0
                      ? 0
                      : e.target.value >= 12
                      ? 12
                      : e.target.value
                  );
                }}
              />
            </div>
          )}

          {showBOI === true && (
            <div className="lg:col-span-2 md:col-span-2">
              <Select
                list={boiList}
                onSelectItem={onSelectItem}
                name="BOI"
                placeholder="เลือกบัตรส่งเสริม(BOI)"
                register={register}
                type="text"
              />
            </div>
          )}

          {showProject && (
            <div className="lg:col-span-2 md:col-span-2">
              <Select
                list={projectList}
                onSelectItem={onSelectItem}
                name="Project"
                placeholder="เลือกโครงการ"
                register={register}
                type="text"
              />
            </div>
          )}

          {showObjective && (
            <div className="lg:col-span-2 md:col-span-2">
              <Select
                list={objectiveList}
                onSelectItem={onSelectItem}
                name="Objective"
                placeholder="เลือกวัตถุประสงค์"
                register={register}
                type="text"
              />
            </div>
          )}

          <div className="flex flex-row xl:col-span-1 lg:col-span-1">
            <button
              type="submit"
              className="btn btn_primary mb-2"
              onClick={handelSearchClick}
              title="Search data"
            >
              <span className="la la-search" />
            </button>
            {showcal && (
              <button
                type="submit"
                className="btn btn_success mb-2 ml-1"
                onClick={handelCalculateClick}
                title="Calculate data"
              >
                {showCalLoading && (
                  <span className="la la-spinner la-spin" aria-hidden="true" />
                )}
                <span className="la la-redo-alt" />
              </button>
            )}
            {showExport && (
              <ExportExcel
                data={data}
                headExport={headExport}
                name={name}
                mini={true}
              />
            )}
          </div>
        </div>
        <div className="grid gap-1">
          <div className="flex mt-2">
            <div className="badge badge_info uppercase">
              SEARCH OPTION
              <span className="la la-angle-double-right text-gl"></span>
            </div>
            {dataSearch?.BOI !== undefined && dataSearch?.BOI !== null && (
              <div className="ml-2">
                <div className="badge badge_outlined badge_primary uppercase">
                  บัตรส่งเสริม : {dataSearch?.BOI?.Name}
                </div>
              </div>
            )}
            {dataSearch?.Project !== undefined &&
              dataSearch?.Project !== null && (
                <div className="ml-2">
                  <div className="badge badge_outlined badge_primary uppercase">
                    โครงการ : {dataSearch?.Project?.Name}
                  </div>
                </div>
              )}
            {dataSearch?.Objective !== undefined &&
              dataSearch?.Objective !== null && (
                <div className="ml-2">
                  <div className="badge badge_outlined badge_primary uppercase">
                    วัตถุประสงค์ : {dataSearch?.Objective?.Name}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
