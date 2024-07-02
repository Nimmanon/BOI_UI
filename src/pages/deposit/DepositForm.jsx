import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import APIService from "../../services/APIService";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import FormTitle from "../../components/FormTitle";
import DatePicker from "../../components/DatePicker";

const DepositForm = () => {
  const [, setAction] = useOutletContext();

  const [data, setData] = useState();
  const [boiList, setBOIList] = useState([]);
  const [ownerList, setOwnerList] = useState([]);
  const [objectiveList, setObjectiveList] = useState([]);

  const [textBOI, setTextBOI] = useState("");
  const [textOwner, setTextOwner] = useState("");
  const [textObjective, setTextObjective] = useState("");

  const [boi, setBOI] = useState();
  const [date, setDate] = useState();
  const [amount, setAmount] = useState();
  const [balance, setBalance] = useState();

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
      Date: "",
      Owner: [],
      BOI: [],
      Objective: [],
      Budget: "",
      Withdraw: "",
      Balance: "",
      Amount: "",
    },
  });

  useEffect(() => {
    if (effectRan.current === false) {
      reset();
      getOwner();
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

  useEffect(() => {
    if (boi === undefined || boi === null) return;
    getObjective(boi);
  }, [boi]);

  const getOwner = () => {
    APIService.getAll("Owner/GetCompany")
      .then((res) => {
        setOwnerList(res.data);
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

  const getObjective = (boi) => {
    APIService.getById("Objective/GetByBoiId", boi?.Id)
      .then((res) => {
        setObjectiveList(res.data);
      })
      .catch((err) => console.log(err));
  };

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

        var bal = Number(val?.Budget) - Number(val?.Withdraw);
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
        break;
    }
  };

  useEffect(() => {
    if (amount > balance) {
      setError("Amount", { type: "required" });
    } else {
      clearErrors("Amount");
    }
  }, [amount, balance]);

  const onSubmit = (value) => {
    if (amount === 0) {
      setError("Amount", { type: "required" });
      return;
    }

    value.BOI = boi;
    value.InputBy = Number(userId);
    handleSaveClick(value);
  };

  const handleSaveClick = (data) => {
    //console.log("handleSaveClick=> ", data);
    APIService.Post("Deposit/Post", data)
      .then((res) => {
        if (res.status !== 200) return;
        UpdateStock(res.data?.stock);
      })
      .catch((err) => console.log(err));
  };

  const UpdateStock = (data) => {
    APIService.Post("Stock/UpdateStockIn", data)
      .then((res) => {
        handleBackClick();
      })
      .catch((err) => console.log(err));
  };

  const handleBackClick = () => {
    navigate("/deposit");
    setAction("list");
  };

  const handleClearClick = () => {
    reset();
    setTextBOI("");
    setTextOwner("");
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
      <FormTitle action={"ADD NEW"} name={"Deposit"} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid lg:grid-cols-5 gap-3 mt-3">
          <div className="lg:col-span-2 xl:col-span-2">
            <div className="card p-3">
              <div className="grid lg:grid-cols-1 gap-1">
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
                    name="ReferenceNo"
                    label="เลขที่เอกสารอ้างอิง"
                    placeholder=""
                    register={register}
                    type="string"
                    //required
                    //error={errors.ReferenceNo}
                    showErrMsg={false}
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

          {balance > 0 && balance >= amount && (
            <div className="ml-1">
              <div>
                <button type="submit" className="btn btn btn_primary uppercase">
                  <span className="la la-save text-xl leading-none mr-1"></span>
                  Save Deposit
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
      </form>
    </>
  );
};

export default DepositForm;
