import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import APIService from "../../services/APIService";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import FormTitle from "../../components/FormTitle";
import DatePicker from "../../components/DatePicker";

const AdvanceProjectForm = () => {
  const [, setAction] = useOutletContext();

  const [data, setData] = useState();
  const [ownerList, setOwnerList] = useState([]);
  const [toOwnerList, setToOwnerList] = useState([]);
  const [boiList, setBOIList] = useState([]);
  const [objectiveList, setObjectiveList] = useState([]);
  const [projectList, setProjectList] = useState([]);

  const [textOwner, setTextOwner] = useState("");
  const [textToOwner, setTextToOwner] = useState("");
  const [textObjective, setTextObjective] = useState("");
  const [textProject, setTextProject] = useState("");

  const [boi, setBOI] = useState();
  const [owner, setOwner] = useState();
  const [date, setDate] = useState();

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
      DocumentNo: "",
      Date: "",
      Requestor: "",
      Owner: [],
      ToOwner: [],
      BOI: [],
      Objective: [],
      Project: [],
      Budget: "",
      Withdraw: "",
      Amount: "",
      Remark: "",
    },
  });

  useEffect(() => {
    if (effectRan.current === false) {
      reset();
      getOwner();
      getToOwner();
      getBOI();
      setAction("new");
      setInitial();

      let current = new Date();
      let date = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate(),
        0,
        0,
        0,
        0
      );
      setDate(date);
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  useEffect(() => {
    setValue("Date", date);
  }, [date]);

  const getOwner = () => {
    APIService.getAll("Owner/GetCoordinator")
      .then((res) => {
        setOwnerList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getToOwner = () => {
    APIService.getAll("Owner/GetProjectManager")
      .then((res) => {
        setToOwnerList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getBOI = () => {
    APIService.getAll("BOI/Get")
      .then((res) => {
        setBOIList(res.data);

        let [boi] = res.data?.filter((x) => x.Id === 1);
        setBOI(boi);
        setValue("BOI", boi?.Name);
      })
      .catch((err) => console.log(err));
  };

  const getObjective = (own) => {
    APIService.getAll("Stock/GetObjectiveByBOIOwner/" + boi?.Id + "/" + own?.Id)
      .then((res) => {
        setObjectiveList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getProject = (obj) => {
    APIService.getById("Project/GetProjectByObjectiveId", obj?.Id)
      .then((res) => {
        setProjectList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val === null ? setError(name, { type: "required" }) : clearErrors(name);

    switch (name?.toLowerCase()) {
      case "owner":
        setOwner(val);
        getObjective(val);
        break;
      case "objective":
        getProject(val);
        break;
      case "project":
        setValue(
          "Budget",
          val?.Budget?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        );
        setValue(
          "Withdraw",
          val?.Withdraw?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        );
        break;
    }
  };

  const onSubmit = (value) => {
    value.BOI = boi;
    value.InputBy = Number(userId);
    handleSaveClick(value);
  };

  const handleSaveClick = (data) => {
    //console.log("handleSaveClick=> ", data);
    APIService.Post("Advance/Post", data)
      .then((res) => {
        if (res.status !== 200) return;
        UpdateStock(res.data?.stock);
      })
      .catch((err) => console.log(err));
  };

  const UpdateStock = (data) => {
    APIService.Post("Stock/UpdateStockMove", data)
      .then((res) => {
        handleBackClick();
      })
      .catch((err) => console.log(err));
  };

  const handleBackClick = () => {
    navigate("/advanceproject");
    setAction("list");
  };

  const handleClearClick = () => {
    reset();
    setTextOwner("");
    setTextToOwner("");
    setTextObjective("");
    setTextProject("");
    getBOI();    
  };

  return (
    <>
      <FormTitle action={"ADD NEW"} name={"Advance"} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid lg:grid-cols-6 gap-3 mt-3">
          <div className="lg:col-span-4 md:col-span-4">
            <div className="card p-3">
              <div className="grid lg:grid-cols-2 gap-1">
                <div>
                  <FormInput
                    name="BOI"
                    label="บัตรส่งเสริม(ฺBOI)"
                    placeholder=""
                    register={register}
                    type="string"
                    readonly
                  />
                </div>
                <div>
                  <DatePicker
                    name="Date"
                    onChange={(dt) => setDate(dt)}
                    placeholder="Date"
                    label="วันที่"
                    showLabel={true}
                    format="d MMM yyyy"
                    value={date || ""}
                    required
                    error={date === null || date === undefined ? true : false}
                  />
                </div>
                <div className="mt-5">
                  <FormInput
                    name="DocumentNo"
                    label="เลขที่เอกสาร"
                    placeholder=""
                    register={register}
                    type="string"
                    required
                    error={errors.DocumentNo}
                    showErrMsg={false}
                  />
                </div>
                <div className="mt-5">
                  <FormInput
                    name="Requestor"
                    label="ผู้ขอเบิก"
                    placeholder=""
                    register={register}
                    type="string"
                    required
                    error={errors.Requestor}
                    showErrMsg={false}
                  />
                </div>
                <div>
                  <Select
                    list={ownerList}
                    selectedText={textOwner}
                    onSelectItem={onSelectItem}
                    name="Owner"
                    label="เบิกจาก"
                    register={register}
                    type="text"
                    className={`form-control mt-5 `}
                    required
                    error={errors.Owner}
                    showErrMsg={false}
                  />
                </div>
                <div>
                  <Select
                    list={toOwnerList}
                    selectedText={textToOwner}
                    onSelectItem={onSelectItem}
                    name="ToOwner"
                    label="จ่ายให้"
                    register={register}
                    type="text"
                    className={`form-control mt-5 `}
                    required
                    error={errors.ToOwner}
                    showErrMsg={false}
                  />
                </div>
                <div>
                  <Select
                    list={objectiveList}
                    selectedText={textObjective}
                    onSelectItem={onSelectItem}
                    name="Objective"
                    label="วัตถุประสงค์เพื่อ"
                    register={register}
                    type="text"
                    className={`form-control mt-5 `}
                    required
                    error={errors.Objective}
                    showErrMsg={false}
                  />
                </div>
                <div>
                  <Select
                    list={projectList}
                    selectedText={textProject}
                    onSelectItem={onSelectItem}
                    name="Project"
                    label="โครงการ"
                    register={register}
                    type="text"
                    className={`form-control mt-5 `}
                    required
                    error={errors.Project}
                    showErrMsg={false}
                  />
                </div>
                <div className="mt-5">
                  <FormInput
                    name="Budget"
                    label="งบประมาณ (บาท)"
                    placeholder=""
                    register={register}
                    type="string"
                    readonly
                  />
                </div>
                <div className="mt-5">
                  <FormInput
                    name="Withdraw"
                    label="เบิกไปแล้ว (บาท)"
                    placeholder=""
                    register={register}
                    type="string"
                    readonly
                  />
                </div>
                <div className="mt-5">
                  <FormInput
                    name="Amount"
                    label="จำนวนเงิน (บาท)"
                    placeholder=""
                    register={register}
                    type="number"
                    required
                    error={errors.Amount}
                    showErrMsg={false}
                  />
                </div>
                <div className="mt-5">
                  <FormInput
                    name="Remark"
                    label="หมายเหตุ"
                    placeholder=""
                    register={register}
                    type="string"
                  />
                </div>
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
                <span className="la la-save text-xl leading-none mr-1"></span>
                Save Advance
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
                <span className="la la-eraser text-xl leading-none mr-1"></span>
                Clear Form
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AdvanceProjectForm;
