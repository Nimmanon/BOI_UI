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
import DepositDelete from "./DepositDelete";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";
import DatePicker from "../../components/DatePicker";

const DepositView = () => {
  const [setDataSelected, setAction] = useOutletContext();

  const [data, setData] = useState();
  const [boiList, setBOIList] = useState([]);
  const [ownerList, setOwnerList] = useState([]);
  const [objectiveList, setObjectiveList] = useState([]);

  const [textBOI, setTextBOI] = useState("");
  const [textOwner, setTextOwner] = useState("");
  const [textObjective, setTextObjective] = useState("");

  const [boi, setBOI] = useState();
  const [date, setDate] = useState();
  const [objective, setObjective] = useState();
  const [oldObjective, setOldObjective] = useState();
  const [amount, setAmount] = useState();
  const [balance, setBalance] = useState();
  const [budget, setBudget] = useState();
  const [withdraw, setWithdraw] = useState();
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
      DocumentNo: "",
      ReferenceNo: "",
      Date: "",
      Owner: [],
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
      setInitial();
      getBOI();
      getOwner();
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

    APIService.getById("Deposit/GetById", params.id)
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

  const getOwner = () => {
    APIService.getAll("Owner/GetCompany")
      .then((res) => {
        setOwnerList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getObjective = (boi) => {
    APIService.getById("Objective/GetByBoiId", boi?.Id)
      .then((res) => {
        setObjectiveList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setValue("Date", date);
  }, [date]);

  useEffect(() => {
    if (boi === undefined || boi === null) return;
    getObjective(boi);
  }, [boi]);

  useEffect(() => {
    if (data === undefined || data === null) return;
    verifyUpdate(data);
  }, [data]);

  const verifyUpdate = (data) => {
    if (data?.IsActive === true) {
      setCanUpdate(true);
    } else {
      setCanUpdate(false);
    }
  };

  useEffect(() => {
    if (data === undefined || data === null) return;
    //console.log("Deposit View data =>", data);
    setValue("Id", data?.Id);
    setValue("DocumentNo", data?.DocumentNo);
    setValue("ReferenceNo", data?.ReferenceNo);
    setValue("Date", data?.Date);
    setValue("Owner", data?.Owner);
    setValue("BOI", data?.Objective?.BOI);
    setValue("Objective", data?.Objective);
    setValue("Budget", numberComma(data?.Objective?.Budget));
    setValue("Withdraw", numberComma(data?.Objective?.Withdraw));
    setValue("Amount", numberComma(data?.Amount));

    setValue("Remark", data?.Remark);
    setValue("Reason", data?.Reason);

    setTextBOI(data?.Objective?.BOI?.Name);
    setTextOwner(data?.Owner?.Name);
    setTextObjective(data?.Objective?.Name);
    setBOI(data?.Objective?.BOI);
    setDate(new Date(data?.Date));
    setObjective(data?.Objective);
    setOldObjective(data?.Objective);

    setBudget(data?.Objective?.Budget);
    setWithdraw(data?.Objective?.Withdraw - data?.Amount);
    var bal =
      Number(data?.Objective?.Budget) -
      Number(data?.Objective?.Withdraw) +
      data?.Amount;
    setBalance(bal);
    setAmount(data?.Amount);
  }, [data, canUpdate]);

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
      objectiveList === undefined ||
      objectiveList?.length === 0 ||
      objective === undefined ||
      objective === null
    )
      return;

    let [obj] = objectiveList?.filter((x) => x.Id == objective?.Id);
    setValue(
      "Budget",
      obj?.Budget?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    setValue(
      "Withdraw",
      obj?.Withdraw?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    setBudget(obj?.Budget);

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
  }, [objectiveList, objective]);

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val === null ? setError(name, { type: "required" }) : clearErrors(name);

    switch (name?.toLowerCase()) {
      case "boi":
        setTextBOI(val?.Name);
        setBOI(val);
        break;
      case "owner":
        setTextOwner(val?.Name);
        break;
      case "objective":
        setObjective(val);
        setTextObjective(val?.Name);
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
    APIService.Put("Deposit/Put", data)
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
    APIService.Post("Deposit/Delete", item)
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
    navigate("/deposit");
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
      <FormTitle action={"VIEW"} name={"Deposit"} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid lg:grid-cols-5 gap-3 mt-3">
          <div className="lg:col-span-2 xl:col-span-2">
            <div className="card p-3">
              <div className="grid lg:grid-cols-1 gap-1">
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
                    readonly
                  />
                </div>
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
                <div>
                  <Select
                    list={ownerList}
                    selectedText={textOwner}
                    onSelectItem={onSelectItem}
                    name="Owner"
                    label="บริษัท/มูลนิธิ"
                    register={register}
                    type="text"
                    className={`form-control mt-5 `}
                    required
                    error={errors.Owner}
                    showErrMsg={false}
                    readOnly={!canUpdate}
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
                        readonly
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
                <div className="mt-5">
                  <FormInput
                    name="Remark"
                    label="หมายเหตุ"
                    placeholder=""
                    register={register}
                    type="string"
                    readonly={!canUpdate}
                  />
                </div>
                {!canUpdate && (
                  <div className="mt-5">
                    <FormInput
                      name="Reason"
                      label="สาเหตุการยกเลิก"
                      placeholder=""
                      register={register}
                      type="string"
                      readonly={true}
                    />
                  </div>
                )}
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

          {canUpdate && amount > 0 && balance >= amount && (
            <div className="ml-1">
              <div>
                <button type="submit" className="btn btn btn_primary uppercase">
                  <span className="la la-edit text-xl leading-none mr-1"></span>
                  Update Deposit
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
                  Delete Deposit
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
        name={"Void Deposit"}
        size={"2xl"}
        handleCancelClick={() => {
          setShowReason(false);
        }}
        form={<DepositDelete data={data} onVoidClick={handleVoidConfirm} />}
      />
      <div className={`${showReason ? "overlay active" : ""}`}></div>
    </>
  );
};

export default DepositView;
