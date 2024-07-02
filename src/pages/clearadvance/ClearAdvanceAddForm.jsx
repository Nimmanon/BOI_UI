import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "../../components/Select";
import FormInput from "../../components/FormInput";
import DatePicker from "../../components/DatePicker";
import AttachmentForm from "../attachment/AttachmentForm";

const ClearAdvanceAddForm = ({ action, data, onAddItem }) => {
  const [setDataSelected, setAction] = useOutletContext();

  const [typeList, setTypeList] = useState([]);
  const [textType, setTextType] = useState("");

  const [fileList, setFileList] = useState([]);

  const [date, setDate] = useState();
  const [type, setType] = useState();
  const [amount, setAmount] = useState(0);
  const [vat, setVat] = useState(0);
  const [wht, setWht] = useState(0);

  const effectRan = useRef(false);

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
      ExpenseType: [],
      Date: "",
      Description: "",
      ReferenceNo: "",
      VAT: "",
      WT: "",
      Amount: "",
      Total: "",
      Remark: "",
      Details: [],
    },
  });

  useEffect(() => {
    if (effectRan.current === false) {
      reset();
      getType();
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

  const getType = () => {
    APIService.getAll("ExpenseType/Get")
      .then((res) => {
        setTypeList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val === null ? setError(name, { type: "required" }) : clearErrors(name);
    setTextType(val?.Name);
    setType(val);
  };

  useEffect(() => {
    if (type === undefined || type === null) return;

    if (type?.Value === 1) {
      //ค่าวัสดุ
      setValue("VAT", Number(type?.Rate));
      setVat(Number(type?.Rate));
      setValue("WT", 0);
    } else {
      //ค่าแรง
      setValue("WT", Number(type?.Rate));
      setWht(Number(type?.Rate));
      setValue("VAT", 0);
    }
  }, [type]);

  useEffect(() => {
    let total = 0;
    let vt = 0;
    let wt = 0;
    if (type?.Value === 1) {
      //ค่าวัสดุ
      vt = amount * (vat / 100);
      total = amount + vt;
    } else {
      //ค่าแรง
      wt = amount * (wht / 100);
      total = amount + wt;
    }

    setValue(
      "VatAMT",
      vt?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );

    setValue(
      "WtAMT",
      wt?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );

    setValue(
      "Total",
      total?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }, [amount, vat, wht]);

  const onSubmit = (value) => {
    if (amount === 0) {
      setError("Amount", { type: "required" });
      return;
    }

    value.JobId = data?.JobId;
    value.ProjectId = data?.ProjectId;
    value.Details = fileList;
    value.InputBy = Number(userId);
    handleSaveClick(value);
  };

  const handleSaveClick = (data) => {
    //console.log("handleSaveClick=> ", data);
    APIService.Post("Reference/Post", data)
      .then((res) => {
        if (res.status !== 200) return;
        UpdateStock(res.data);
      })
      .catch((err) => console.log(err));
  };

  const UpdateStock = (data) => {
    //console.log('UpdateStock=>',data?.stock);
    APIService.Post("Stock/UpdateStockMove", data?.stock)
      .then((res) => {
        onAddItem(data?.result);
      })
      .catch((err) => console.log(err));
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

  const handleFileSelected = (items) => {
    setFileList(items);
    setValue("Files", items);
  };

  const handleClearClick = () => {
    reset();
    setType();
    setAmount(0);
    setVat(0);
    setWht(0);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid lg:grid-cols-2 xl:grid-cols-2 md:grid-cols-2 gap-3 p-3">
          <div className="lg:grid-cols-1 gap-1 card p-3">
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
            <div>
              <Select
                list={typeList}
                selectedText={textType}
                onSelectItem={onSelectItem}
                name="ExpenseType"
                label="ประเภท"
                register={register}
                type="text"
                className={`form-control mt-5 `}
                required
                error={errors.ExpenseType}
                showErrMsg={false}
              />
            </div>
            <div className="mt-5">
              <FormInput
                name="Description"
                label="รายการ"
                placeholder=""
                register={register}
                type="string"
                required
                error={errors.Description}
                showErrMsg={false}
              />
            </div>
            <div className="mt-5">
              <FormInput
                name="ReferenceNo"
                label="เลขที่เอกสารอ้างอิง"
                placeholder=""
                register={register}
                type="string"
                showErrMsg={false}
              />
            </div>
            <div className="mt-5">
              <div className="grid lg:grid-cols-4 gap-1">
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
                </div>
                {type?.Value === 1 && (
                  <>
                    <div>
                      <FormInput
                        name="VAT"
                        label="ภาษีมูลค่าเพิ่ม (%)"
                        placeholder=""
                        register={register}
                        type="string"
                        align="right"
                        required
                        error={errors.VAT}
                        showErrMsg={false}
                        arrow={false}
                        onChange={(e) => {
                          setVat(Number(removeComma(e.target.value)));
                          setValue("VAT", numberComma(e.target.value));
                          clearErrors("VAT");
                        }}
                      />
                    </div>
                    <div>
                      <FormInput
                        name="VatAMT"
                        label="ภาษีมูลค่าเพิ่ม (บาท)"
                        placeholder=""
                        register={register}
                        type="string"
                        align="right"
                        readonly
                      />
                    </div>
                  </>
                )}
                {type?.Value === 2 && (
                  <>
                    <div>
                      <FormInput
                        name="WT"
                        label="ภาษีหัก ณ ที่จ่าย (%)"
                        placeholder=""
                        register={register}
                        type="string"
                        align="right"
                        required
                        error={errors.WT}
                        showErrMsg={false}
                        arrow={false}
                        onChange={(e) => {
                          setWht(Number(removeComma(e.target.value)));
                          setValue("WT", numberComma(e.target.value));
                          clearErrors("WT");
                        }}
                      />
                    </div>
                    <div>
                      <FormInput
                        name="WtAMT"
                        label="ภาษีหัก ณ ที่จ่าย (บาท)"
                        placeholder=""
                        register={register}
                        type="string"
                        align="right"
                        readonly
                      />
                    </div>
                  </>
                )}
                <div>
                  <FormInput
                    name="Total"
                    label="รวมเป็นเงิน (บาท)"
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
              <FormInput
                name="Remark"
                label="หมายเหตุ"
                placeholder=""
                register={register}
                type="string"
              />
            </div>
          </div>
          <div className="lg:grid-cols-1 gap-1">
            <div className="">
              <AttachmentForm
                showDesc={true}
                onFileSelect={handleFileSelected}
              />
            </div>
          </div>
        </div>
        <div className="flex mt-5 ml-3 mb-5">
          <button type="submit" className="btn btn btn_primary uppercase">
            <span className="la la-save text-xl leading-none mr-1"></span>
            Save Data
          </button>
          <button
            type="button"
            className="btn btn_outlined btn_secondary uppercase ml-2"
            onClick={handleClearClick}
          >
            <span className="la la-eraser text-xl leading-none mr-1"></span>
            Clear Form
          </button>
        </div>
      </form>
    </>
  );
};

export default ClearAdvanceAddForm;
