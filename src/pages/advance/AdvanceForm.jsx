import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import APIService from "../../services/APIService";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import FormTitle from "../../components/FormTitle";
import DatePicker from "../../components/DatePicker";

const AdvanceForm = () => {
  const [, setAction] = useOutletContext();

  const [data, setData] = useState();
  const [ownerList, setOwnerList] = useState([]);
  const [toOwnerList, setToOwnerList] = useState([]);
  const [boiList, setBOIList] = useState([]);
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
  const [date, setDate] = useState();
  const [budget, setBudget] = useState();
  const [withdraw, setWithdraw] = useState();
  const [amount, setAmount] = useState();
  const [balance, setBalance] = useState();
  const [type, setType] = useState("T1");
  const [project, setProject] = useState();

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
      ReferenceNo: "",
      DocumentNo: "",
      Date: "",
      Requestor: "",
      Owner: [],
      ToOwner: [],
      BOI: [],
      Objective: [],
      Budget: "",
      Withdraw: "",
      Balance: "",
      Amount: "",
      Remark: "",
    },
  });

  useEffect(() => {
    if (effectRan.current === false) {
      reset();
      getCompany();
      getCoordinator();
      getBOI();
      getProjectAll();
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
      type === "" ||
      type === undefined ||
      companyList?.length === 0 ||
      coordinatorList?.length === 0 ||
      allProjectList?.length === 0
    )
      return;

    clearDetail();

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

  useEffect(() => {
    if (amount > balance) {
      setError("Amount", { type: "required" });
    } else {
      clearErrors("Amount");
    }
  }, [amount, balance]);

  const clearDetail = () => {
    setTextOwner("");
    setTextToOwner("");
    setTextObjective("");
    setValue("Budget", "");
    setValue("Withdraw", "");
    setValue("Balance", "");
    setValue("Amount", "");
  };

  useEffect(() => {
    if (projectList === undefined || projectList?.length === 0) return;

    let [p] = projectList?.filter((x) => x.OwnerId == toOwner?.Id);
    setBudget(p?.Budget);
    setValue(
      "Budget",
      p?.Budget?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    setWithdraw(p?.Withdraw);
    setValue(
      "Withdraw",
      p?.Withdraw?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    var bal = Number(p?.Budget) - Number(p?.Withdraw);
    setBalance(bal);
    setAmount(bal);
    setValue(
      "Balance",
      bal?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    setValue("Amount", numberComma(bal));
  }, [projectList]);

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
    setAmount(bal);
    setValue("Amount", numberComma(bal));
  }, [budget]);

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val === null ? setError(name, { type: "required" }) : clearErrors(name);

    if (val === null) {
      setValue("Budget", "");
      setValue("Withdraw", "");
      setValue("Balance", "");
      setValue("Amount", "");
      setBudget(0);
      setWithdraw(0);
      setBalance(0);
      setAmount(0);
    }

    switch (name?.toLowerCase()) {
      case "boi":
        setBOI(val);
        setTextBOI(val?.Name);
        setTextOwner("");
        setTextToOwner("");
        setTextObjective("");
        break;
      case "owner":
        setTextOwner(val?.Name);
        setOwner(val);
        getObjective(val);
        break;
      case "toowner":
        setTextToOwner(val?.Name);
        setToOwner(val);
        break;
      case "objective":
        setTextObjective(val?.Name);
        if (type === "T2") {
          //จ่ายให้โครงการ
          getBudgetProject(val);
        } else {
          //จ่ายให้ผู้ประสานงาน
          setBudget(val === null ? 0 : val?.Budget);
          setWithdraw(val === null ? 0 : val?.Withdraw);
          var bal =
            Number(val === null ? 0 : val?.Budget) -
            Number(val === null ? 0 : val?.Withdraw);
          setBalance(bal);
          setAmount(bal);

          if (val !== null) {
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
            setValue(
              "Balance",
              bal?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            );
            setValue("Amount", numberComma(bal));
          }
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
    value.Project = null;
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
    navigate("/advance");
    setAction("list");
  };

  const handleClearClick = () => {
    reset();
    setTextOwner("");
    setTextToOwner("");
    setTextObjective("");
    getBOI();
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
      <FormTitle action={"ADD NEW"} name={"Advance"} />
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
                    //showErrMsg={false}
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
                <div className="mt-3 mb-2">
                  <div className="flex">
                    <label className="custom-radio">
                      <input
                        type="radio"
                        name="Type"
                        required
                        value="T1"
                        checked={type === "T1" ? true : false}
                        onChange={(e) => {
                          setType(e.target.value);
                          setValue(
                            "Type",
                            e.target.value === "T1" ? true : false
                          );
                        }}
                      />
                      <span></span>
                      <span>จ่ายให้ผู้ประสานงาน</span>
                    </label>
                    <label className="custom-radio ml-5">
                      <input
                        type="radio"
                        name="Type"
                        required
                        value="T2"
                        checked={type === "T2" ? true : false}
                        onChange={(e) => {
                          setType(e.target.value);
                          setValue(
                            "Type",
                            e.target.value === "T1" ? true : false
                          );
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
                      showDesc={type === "T1" ? true : false}
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
                    />
                  </div>
                  <div className="mt-5">
                    <div className="grid lg:grid-cols-2 gap-1">
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
                  <div className="mt-5">
                    <div className="grid lg:grid-cols-2 gap-1">
                      <div>
                        <FormInput
                          name="Balance"
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
                            setAmount(Number(removeComma(e.target.value)));
                            setValue("Amount", numberComma(e.target.value));
                            clearErrors("Amount");
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
                    />
                  </div>
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
              {balance > 0 && balance >= amount && (
                <div className="ml-1">
                  <div>
                    <button
                      type="submit"
                      className="btn btn btn_primary uppercase"
                    >
                      <span className="la la-save text-xl leading-none mr-1"></span>
                      Save Advance
                    </button>
                  </div>
                </div>
              )}
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
          </div>
        </div>
      </form>
    </>
  );
};

export default AdvanceForm;
