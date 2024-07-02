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
import FormInput from "../../components/FormInput";

const ManageBudgetView = () => {
  const [setDataSelected, setAction] = useOutletContext();

  const [data, setData] = useState();
  const [detailList, setDetailList] = useState([]);

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
      Budget: "",
      JobBudget: "",
      Balance: "",
    },
  });

  useEffect(() => {
    if (effectRan.current === false) {
      setInitial();
      getData();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  const getData = () => {
    if (
      params.boiid === undefined ||
      params.boiid === null ||
      params.boiid === 0 ||
      params.objid === undefined ||
      params.objid === null ||
      params.objid === 0
    )
      return;

    let item = {};
    item.BOI = { Id: params.boiid, Name: "" };
    item.Objective = { Id: params.objid, Name: "" };

    APIService.postByObject("Budget/GetBySearch", item)
      .then((res) => {
        let [data] = res.data;        
        setData(data);        
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (data === undefined || data === null) return;

    setValue("Id", data?.Id);
    setValue("BOI", data?.BOI);
    setValue("Name", data?.Name);
    setValue(
      "Budget",
      data?.Budget?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );

    data?.Details?.forEach((x) => {
      x.Balance = Number(x.Budget) - Number(x.JobBudget);
    });
    setDetailList(data?.Details);
  }, [data]);

  useEffect(() => {
    if (detailList === undefined || detailList?.length === 0) return;

    const sum = detailList?.reduce((accumulator, object) => {
      return accumulator + Number(removeComma(object.JobBudget));
    }, 0);

    setValue(
      "JobBudget",
      sum?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    setValue(
      "Balance",
      (data?.Budget - sum)?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }, [detailList]);

  const updateJobBudget = (item, value) => {
    let newdata = detailList?.map((p) =>
      p.Id === item?.Id
        ? {
            ...p,
            JobBudget: Number(removeComma(value)),
            Balance: p.Budget - Number(removeComma(value)),
          }
        : {
            ...p,
          }
    );
    setDetailList(newdata);
  };

  const onSubmit = () => {
    data.Details = detailList;
    data.InputBy = Number(userId);    
    handleUpdateClick(data);
  };

  const handleUpdateClick = (data) => {
    //console.log("handleUpdateClick=> ", data);
    APIService.Put("Budget/Put", data)
      .then((res) => {
        if (res.status !== 200) return;     
        handleBackClick();  
      })
      .catch((err) => console.log(err));
  };
 
  const handleBackClick = () => {
    navigate("/managebudget");
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
        <div className="grid lg:grid-cols-6 gap-3 mt-3">
          <div className="lg:col-span-2 xl:col-span-2">
            <div className="card p-3">
              <div className="grid lg:grid-cols-1 gap-1">
                <div className="mt-5">
                  <FormInput
                    name="BOI"
                    label="บัตรส่งเสริม(BOI)"
                    placeholder=""
                    register={register}
                    type="string"
                    readonly
                  />
                </div>
                <div className="mt-5">
                  <FormInput
                    name="Name"
                    label="วัตถุประสงค์"
                    placeholder=""
                    register={register}
                    type="string"
                    readonly
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
                    name="JobBudget"
                    label="งบประมาณปรับปรุง (บาท)"
                    placeholder=""
                    register={register}
                    type="string"
                    readonly
                  />
                </div>
                <div className="mt-5">
                  <FormInput
                    name="Balance"
                    label="ส่วนต่าง (บาท)"
                    placeholder=""
                    register={register}
                    type="string"
                    readonly
                  />
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
                  <button
                    type="submit"
                    className="btn btn btn_primary uppercase"
                  >
                    <span className="la la-edit text-xl leading-none mr-1"></span>
                    Update Budget
                  </button>
                </div>
              </div>
            </div>
          </div>

          {detailList?.map((item, index) => (
            <div className="lg:col-span-1 xl:col-span-1" key={index}>
              <div className="card p-3">
                <div className="grid lg:grid-cols-1 gap-1">
                  <div className="mt-5">
                    <div>โครงการ</div>
                    <textarea
                      type="text"
                      className="form-control input-group-item disabled"
                      defaultValue={item?.Name || ""}
                      disabled
                    />
                  </div>
                  <div className="mt-5">
                    <div>งบประมาณ (บาท)</div>
                    <input
                      type="text"
                      className="form-control input-group-item readOnly text-right"
                      defaultValue={
                        item?.Budget?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || ""
                      }
                    />
                  </div>
                  <div>
                    <div>งบประมาณปรับปรุง (บาท)</div>
                    <input
                      type="text"
                      className="form-control input-group-item bg-yellow-100 text-right"
                      value={numberComma(item?.JobBudget) || ""}
                      onChange={(e) => updateJobBudget(item, e?.target?.value)}
                    />
                  </div>
                  <div className="mt-5">
                    <div>ส่วนต่าง (บาท)</div>
                    <input
                      type="text"
                      className="form-control input-group-item readOnly text-right"
                      value={
                        item?.Balance?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || ""
                      }
                      onChange={(e) => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
    </>
  );
};

export default ManageBudgetView;
