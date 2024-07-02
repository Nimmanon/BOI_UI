import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import FormTitle from "../../components/FormTitle";
import { useSelector } from "react-redux";
import CustomModal from "../../components/CustomModal";
import AdvanceProjectDelete from "./AdvanceProjectDelete";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";
import DatePicker from "../../components/DatePicker";

const AdvanceProjectView = () => {
  const [setDataSelected, setAction] = useOutletContext();

  const [data, setData] = useState();
  const [ownerList, setOwnerList] = useState([]);
  const [toOwnerList, setToOwnerList] = useState([]);
  const [objectiveList, setObjectiveList] = useState([]);
  const [projectList, setProjectList] = useState([]);

  const [textOwner, setTextOwner] = useState("");
  const [textToOwner, setTextToOwner] = useState("");
  const [textObjective, setTextObjective] = useState("");
  const [textProject, setTextProject] = useState("");

  const [boi, setBOI] = useState();
  const [owner, setOwner] = useState();
  const [objective, setObjective] = useState();
  const [project, setProject] = useState();
  const [date, setDate] = useState();
  const [showReason, setShowReason] = useState(false);
  const [canUpdate, setCanUpdate] = useState(true);

  const effectRan = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  let params = useParams();

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();

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
      setInitial();
      getOwner();
      getToOwner();
      getData();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  const getData = () => {
    if (params.id === undefined || params.id === null || params.id === 0)
      return;

    APIService.getById("Advance/GetById", params.id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getOwner = () => {
    APIService.getAll("Owner/GetCompany")
      .then((res) => {
        setOwnerList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getToOwner = () => {
    APIService.getAll("Owner/GetCoordinator")
      .then((res) => {
        setToOwnerList(res.data);
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

  useEffect(() => {
    setValue("Date", date);
  }, [date]);

  useEffect(() => {
    if (data === undefined || data === null) return;
    //console.log("Advance View data =>", data);

    verifyUpdate(data);
    setValue("Id", data?.Id);
    setValue("Date", data?.Date);
    setValue("DocumentNo", data?.DocumentNo);
    setValue("Requestor", data?.Requestor);
    setValue("Owner", data?.Owner);
    setValue("ToOwner", data?.ToOwner);
    setValue("BOI", data?.Objective?.BOI?.Name);
    setValue("Objective", data?.Objective);
    setValue("Project", data?.Project);
    setValue("Amount", data?.Amount);
    setValue("Remark", data?.Remark);
    setValue("Reason", data?.Reason);

    setTextOwner(data?.Owner?.Name);
    setTextToOwner(data?.ToOwner?.Name);
    setTextObjective(data?.Objective?.Name);
    setTextProject(data?.Project?.Name);
    setBOI(data?.Objective?.BOI);
    setDate(new Date(data?.Date));
    setObjective(data?.Objective);
    setOwner(data?.Owner);
    setProject(data?.Project);
  }, [data]);

  const verifyUpdate = (data) => {
    if (data?.IsActive === true) {
      setCanUpdate(true);
    } else {
      setCanUpdate(false);
    }
  };

  useEffect(() => {
    if (boi === undefined || owner === undefined) return;
    getObjective(owner);
  }, [boi, owner]);

  useEffect(() => {
    if (objective === undefined || objective === undefined) return;
    getProject(objective);
  }, [objective]);

  useEffect(() => {
    if (projectList === undefined || projectList?.length === 0) return;
    let [p] = projectList?.filter((x) => x.Id == project?.Id);
    setValue(
      "Budget",
      p?.Budget?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    setValue(
      "Withdraw",
      p?.Withdraw?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }, [projectList]);

 
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
    handleUpdateClick(value);
  };

  const handleUpdateClick = (data) => {
    //console.log("handleUpdateClick=> ", data);
    APIService.Put("Advance/Put", data)
      .then((res) => {
        if (res.status !== 200) return;
        UpdateStock(res.data?.stock);
      })
      .catch((err) => console.log(err));
  };

  const handleVoidConfirm = (val) => {
    let item = {};
    item.Id = data?.Id;
    item.InputBy = userId;
    item.Reason = val?.Remark;
    APIService.Post("Advance/Delete", item)
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
    setDataSelected();
    setAction("list");
  };

  return (
    <>
      <FormTitle action={"VIEW"} name={"Advance"} />
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

          {canUpdate && (
            <div className="ml-1">
              <div>
                <button type="submit" className="btn btn btn_primary uppercase">
                  <span className="la la-edit text-xl leading-none mr-1"></span>
                  Update Advance
                </button>
              </div>
            </div>
          )}
          {canUpdate && (
            <div className="ml-1">
              <div>
                <button
                  type="button"
                  className="btn btn btn_danger uppercase"
                  onClick={(e) => setShowReason(true)}
                >
                  <span className="la la-trash text-xl leading-none mr-1"></span>
                  Delete Advance
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      <CustomModal
        show={showReason}
        content={data}
        action={"confirm"}
        name={"Void Advance"}
        size={"2xl"}
        handleCancelClick={() => {
          setShowReason(false);
        }}
        form={
          <AdvanceProjectDelete data={data} onVoidClick={handleVoidConfirm} />
        }
      />
      <div className={`${showReason ? "overlay active" : ""}`}></div>
    </>
  );
};

export default AdvanceProjectView;
