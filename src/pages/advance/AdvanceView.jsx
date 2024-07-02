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
import AdvanceDelete from "./AdvanceDelete";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";
import DatePicker from "../../components/DatePicker";

const AdvanceView = () => {
  const [setDataSelected, setAction] = useOutletContext();

  const [data, setData] = useState();
  const [boiList, setBOIList] = useState([]);
  const [ownerList, setOwnerList] = useState([]);
  const [toOwnerList, setToOwnerList] = useState([]);
  const [objectiveList, setObjectiveList] = useState([]);
  const [allProjectList, setAllProjectList] = useState([]);
  const [projectList, setProjectList] = useState([]);

  const [companyList, setCompanyList] = useState([]);
  const [coordinatorList, setCoordinatorList] = useState([]);

  const [textBOI, setTextBOI] = useState("");
  const [textOwner, setTextOwner] = useState("");
  const [textToOwner, setTextToOwner] = useState("");
  const [textObjective, setTextObjective] = useState("");

  const [boi, setBOI] = useState();
  const [owner, setOwner] = useState();
  const [toOwner, setToOwner] = useState();
  const [objective, setObjective] = useState();
  const [oldObjective, setOldObjective] = useState();
  const [project, setProject] = useState();
  const [date, setDate] = useState();
  const [type, setType] = useState("T1");
  const [balance, setBalance] = useState();
  const [budget, setBudget] = useState();
  const [withdraw, setWithdraw] = useState();
  const [amount, setAmount] = useState();
  const [remain, setRemain] = useState();

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
      BOI: [],
      DocumentNo: "",
      ReferenceNo: "",
      Date: "",
      Requestor: "",
      Owner: [],
      ToOwner: [],
      Objective: [],
      Budget: "",
      Withdraw: "",
      Amount: "",
      Remark: "",
    },
  });

  useEffect(() => {
    if (effectRan.current === false) {
      getBOI();
      getCompany();
      getCoordinator();
      getProjectAll();
      getData();
      setInitial();
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

  const getBOI = () => {
    APIService.getAll("BOI/Get")
      .then((res) => {
        setBOIList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getCompany = () => {
    APIService.getAll("Owner/GetCompany")
      .then((res) => {
        setCompanyList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getCoordinator = () => {
    APIService.getAll("Owner/GetCoordinator")
      .then((res) => {
        setCoordinatorList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getObjective = (own) => {
    if (boi === null || own === null || boi === undefined || own === undefined)
      return;
    APIService.getAll("Stock/GetObjectiveByBOIOwner/" + boi?.Id + "/" + own?.Id)
      .then((res) => {
        setObjectiveList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getProjectAll = () => {
    APIService.getAll("Project/GetList")
      .then((res) => {
        setAllProjectList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getBudgetProject = (obj) => {    
    if (obj === undefined || obj === null) return;
    APIService.getById("Job/GetProjectByObjectiveId", obj?.Id)
      .then((res) => {
        setProjectList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (
      objectiveList === undefined ||
      objectiveList?.length === 0 ||
      objective === undefined ||
      objective === null
    )
      return;

    if (type === "T2") {
      //จ่ายให้โครงการ
      getBudgetProject(objective);
    } else {
      //จ่ายให้ผู้ประสานงาน
      let [obj] = objectiveList?.filter((x) => x.Id == objective?.Id);
      setBudget(obj?.Budget);
      setValue(
        "Budget",
        obj?.Budget?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
      setWithdraw(obj?.Withdraw - amount);
      setValue(
        "Withdraw",
        obj?.Withdraw?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );

      if (objective?.Id !== oldObjective?.Id) {
        var amt = Number(obj?.Budget) - Number(obj?.Withdraw);
        setAmount(amt);
        setValue("Amount", numberComma(amt));

        setWithdraw(obj?.Withdraw - amt);
        var bal = Number(obj?.Budget) - Number(obj?.Withdraw) + amt;
        setBalance(bal);
      } else {
        setWithdraw(obj?.Withdraw - amount);
        var bal = Number(obj?.Budget) - Number(obj?.Withdraw) + amount;
        setBalance(bal);
      }
    }
  }, [objectiveList, objective]);

  useEffect(() => {
    if (
      projectList === undefined ||
      projectList?.length === 0 ||
      toOwner === undefined ||
      toOwner === null
    )
      return;
    
    let [p] = projectList?.filter((x) => x.OwnerId === toOwner?.Id);   
    setBudget(p?.Budget);
    setValue(
      "Budget",
      p?.Budget?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    //setWithdraw(p?.Withdraw);
    setWithdraw(p?.Withdraw - amount);
    setValue(
      "Withdraw",
      p?.Withdraw?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );

    // var bal = Number(p?.Budget) - Number(p?.Withdraw);
    // setBalance(bal);
    // setAmount(bal);
    // setValue(
    //   "Balance",
    //   bal?.toLocaleString(undefined, {
    //     minimumFractionDigits: 2,
    //     maximumFractionDigits: 2,
    //   })
    // );
    // setValue(
    //   "Remain",
    //   bal?.toLocaleString(undefined, {
    //     minimumFractionDigits: 2,
    //     maximumFractionDigits: 2,
    //   })
    // );
    //setValue("Amount", numberComma(bal));
  }, [projectList]);

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
    setValue("ReferenceNo", data?.ReferenceNo);
    setValue("Requestor", data?.Requestor);
    setValue("BOI", data?.Objective?.BOI);
    setValue("Owner", data?.Owner);
    setValue("ToOwner", data?.ToOwner);
    setValue("Objective", data?.Objective);
    setValue("Amount", numberComma(data?.Amount));
    setValue("Remark", data?.Remark);
    setValue("Reason", data?.Reason);

    setTextBOI(data?.Objective?.BOI?.Name);
    setTextOwner(data?.Owner?.Name);
    setTextToOwner(data?.ToOwner?.Name);
    setTextObjective(data?.Objective?.Name);
    setBOI(data?.Objective?.BOI);
    setDate(new Date(data?.Date));
    setObjective(data?.Objective);
    setOldObjective(data?.Objective);
    setOwner(data?.Owner);
    setToOwner(data?.ToOwner);
    setAmount(data?.Amount);
    setType(data?.Project !== null ? "T2" : "T1");
  }, [data]);

  useEffect(() => {
    if (boi === undefined || owner === undefined) return;
    getObjective(owner);
  }, [boi, owner]);

  const verifyUpdate = (data) => {
    if (data?.IsActive === true) {
      setCanUpdate(true);
    } else {
      setCanUpdate(false);
    }
  };

  useEffect(() => {
    var bal = Number(budget) - Number(withdraw);
    setBalance(bal);
    setValue(
      "Balance",
      bal?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    // setAmount(bal);
    // setValue("Amount", numberComma(bal));
  }, [budget]);

  useEffect(() => {    
    let wd = Number(withdraw) + Number(amount);    
    setValue(
      "Withdraw",
      wd?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );

    let remain = Number(budget) - Number(wd);
    setRemain(remain);
    setValue(
      "Remain",
      remain?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }, [budget, withdraw, amount]);

  useEffect(() => {
    if (
      type === "" ||
      type === undefined ||
      companyList?.length === 0 ||
      coordinatorList?.length === 0 ||
      allProjectList?.length === 0
    )
      return;

    let colist = [];
    coordinatorList.map((s) => {
      let item = {};
      item.Id = s.Id;
      item.Name = s.Name;
      item.Description = s.Bank + " / " + s.AccNo;
      colist.push(item);
    });

    if (type === "T2") {
      //Coordinator => Project Manager
      setOwnerList(colist);

      let tList = allProjectList
        .filter((x) => x.BOI.Id === boi?.Id)
        .map((s) => s.Owner);
      setToOwnerList(tList);
    } else {
      //company => Coordinator
      setOwnerList(companyList);
      setToOwnerList(colist);
    }
  }, [type, companyList, coordinatorList, allProjectList]);

  const clearDetail = () => {
    setValue("Owner", null);
    setValue("ToOwner", null);
    setValue("Objective", null);
    setValue("Budget", "");
    setValue("Withdraw", "");
    setValue("Remain", "");
    setValue("Amount", "");
    setValue("Remark", "");
    setTextOwner("");
    setTextToOwner("");
    setTextObjective("");
  };

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val === null ? setError(name, { type: "required" }) : clearErrors(name);

    switch (name?.toLowerCase()) {
      case "owner":
        setTextOwner(val?.Name);
        setOwner(val);
        setObjective(null);
        getObjective(val);
        break;
      case "toowner":
        setToOwner(val);
        setTextToOwner(val?.Name);
        break;
      case "objective":
        setValue("Budget", "");
        setValue("Withdraw", "");
        setValue("Remain", "");
        setValue("Amount", "");

        setObjective(val);
        setTextObjective(val?.Name);

        if (type === "T2") {
          //จ่ายให้โครงการ
          getBudgetProject(val);
        }
        break;
    }
  };

  const onSubmit = (value) => {
    if (amount === 0) {
      setError("Amount", { type: "required" });
      return;
    }

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
    navigate("/advance");
    setDataSelected();
    setAction("list");
  };

  const numberComma = (value) => {
    const rawValue = value?.toLocaleString()?.replace(/,/g, ""); // Remove existing commas
    const formattedValue = rawValue?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedValue;
  };

  const removeComma = (value) => {
    const rawValue = value?.toLocaleString()?.replace(/,/g, "");
    return rawValue;
  };

  return (
    <>
      <FormTitle action={"VIEW"} name={"Advance"} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid lg:grid-cols-6 xl:grid-cols-6 md:grid-cols-5 gap-3 mt-3">
          <div className="lg:col-span-3 xl:col-span-3 md:col-span-3">
            <div className="card p-3">
              <div className="grid lg:grid-cols-2 gap-1">
                <div>
                  <Select
                    list={boiList}
                    selectedText={textBOI}
                    onSelectItem={onSelectItem}
                    name="BOI"
                    label="บัตรส่งเสริม(ฺBOI)"
                    register={register}
                    type="text"
                    className={`form-control mt-5 `}
                    required
                    error={errors.BOI}
                    showErrMsg={false}
                    readOnly={!canUpdate}
                  />
                </div>
                <div className="mt-5">
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
                    readOnly={!canUpdate}
                  />
                </div>
                <div className="mt-5">
                  <FormInput
                    name="ReferenceNo"
                    label="เลขที่เอกสารอ้างอิง"
                    placeholder=""
                    register={register}
                    type="string"
                    //required
                    //error={errors.ReferenceNo}
                    showErrMsg={false}
                    readonly={!canUpdate}
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
                    readonly={!canUpdate}
                  />
                </div>
                <div className="mt-3 mb-2">
                  <div className="flex">
                    <label className="custom-radio">
                      <input
                        type="radio"
                        name="Type"
                        disabled={!canUpdate}
                        required
                        value="T1"
                        checked={type === "T1" ? true : false}
                        onChange={(e) => {
                          setType(e.target.value);
                          setValue(
                            "Type",
                            e.target.value === "T1" ? true : false
                          );
                          clearDetail();
                        }}
                      />
                      <span></span>
                      <span>จ่ายให้ผู้ประสานงาน</span>
                    </label>
                    <label className="custom-radio ml-5">
                      <input
                        type="radio"
                        name="Type"
                        disabled={!canUpdate}
                        required
                        value="T2"
                        checked={type === "T2" ? true : false}
                        onChange={(e) => {
                          setType(e.target.value);
                          setValue(
                            "Type",
                            e.target.value === "T1" ? true : false
                          );
                          clearDetail();
                        }}
                      />
                      <span></span>
                      <span>จ่ายให้โครงการ</span>
                    </label>
                  </div>
                </div>
              </div>
              {type !== "" && (
                <div className="grid lg:grid-cols-2 gap-1">
                  <div>
                    <Select
                      list={ownerList}
                      selectedText={textOwner}
                      onSelectItem={onSelectItem}
                      name="Owner"
                      label="เบิกจาก"
                      register={register}
                      type="text"
                      className="form-control"
                      required
                      error={errors.Owner}
                      showErrMsg={false}
                      readOnly={!canUpdate}
                      showDesc={type === "T2" ? true : false}
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
                      className="form-control"
                      required
                      error={errors.ToOwner}
                      showErrMsg={false}
                      readOnly={!canUpdate}
                      showDesc={type === "T2" ? true : false}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Select
                      list={objectiveList}
                      selectedText={textObjective}
                      onSelectItem={onSelectItem}
                      name="Objective"
                      label="วัตถุประสงค์เพื่อ"
                      register={register}
                      type="text"
                      className="form-control"
                      required
                      error={errors.Objective}
                      showErrMsg={false}
                      readOnly={!canUpdate}
                    />
                  </div>
                  <div className="mt-5">
                    <div className="grid lg:grid-cols-2 gap-1">
                      <div>
                        <FormInput
                          name="Budget"
                          label="วงเงินงบประมาณ (บาท)"
                          placeholder=""
                          register={register}
                          type="string"
                          align="right"
                          required
                          error={errors.Budget}
                          showErrMsg={false}
                          arrow={false}
                          onChange={(e) => {
                            setBudget(Number(removeComma(e.target.value)));
                            setValue("Budget", numberComma(e.target.value));
                          }}
                          readonly={type === "T2" ? false : true}
                        />
                      </div>
                      <div>
                        <FormInput
                          name="Withdraw"
                          label="วงเงินใช้ไป (บาท)"
                          placeholder=""
                          register={register}
                          type="string"
                          align="right"
                          readonly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="grid lg:grid-cols-2 gap-1">
                      <div>
                        <FormInput
                          name="Remain"
                          label="วงเงินคงเหลือ (บาท)"
                          placeholder=""
                          register={register}
                          type="string"
                          align="right"
                          readonly
                        />
                      </div>
                      <div>
                        <FormInput
                          name="Amount"
                          label="จำนวนเงิน (บาท)"
                          placeholder=""
                          register={register}
                          type="string"
                          align="right"
                          required
                          error={errors.Amount}
                          showErrMsg={false}
                          arrow={false}
                          onChange={(e) => {
                            clearErrors("Amount");
                            setAmount(Number(removeComma(e.target.value)));
                            setValue("Amount", numberComma(e.target.value));
                          }}
                        />
                        {amount > balance && (
                          <small className="block mt-2 invalid-feedback">
                            จำนวนเงินที่ต้องการมากกว่างบประมาณ
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 mt-5">
                    <FormInput
                      name="Remark"
                      label="หมายเหตุ"
                      placeholder=""
                      register={register}
                      type="string"
                      readonly={!canUpdate}
                    />
                  </div>
                  {!data?.IsActive && (
                    <div className="mt-5">
                      <FormInput
                        name="Reason"
                        label="สาเหตุการยกเลิก"
                        placeholder=""
                        register={register}
                        type="string"
                        readonly
                      />
                    </div>
                  )}
                </div>
              )}
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
              {canUpdate && amount > 0 && balance >= amount && (
                <div className="ml-1">
                  <div>
                    <button
                      type="submit"
                      className="btn btn btn_primary uppercase"
                    >
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
          </div>
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
        form={<AdvanceDelete data={data} onVoidClick={handleVoidConfirm} />}
      />
      <div className={`${showReason ? "overlay active" : ""}`}></div>
    </>
  );
};

export default AdvanceView;
