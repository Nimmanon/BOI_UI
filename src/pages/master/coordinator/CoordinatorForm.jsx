import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import FormTitle from "../../../components/FormTitle";
import FormInput from "../../../components/FormInput";
import APIService from "../../../services/APIService";
import Select from "../../../components/Select";

const CoordinatorForm = () => {
    const [, setAction] = useOutletContext();
  
    const [bankList, setBankList] = useState([]);  
    
    const [textBank, setTextBank] = useState("");
  
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
        Bank: [],
        Name: "",
        Address: "",
        Bank: "",
        Branch: "",
        AccNo: "",
      },
    });
  
    useEffect(() => {
      if (effectRan.current === false) {
        reset();
        setAction("new");
        setInitial();       
        getBank();
        return () => (effectRan.current = true);
      }
    }, []);  
    
  
    const getBank = () => {
      APIService.getAll("Bank/Get")
        .then((res) => {
          setBankList(res.data);
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
      value.TypeValue = 2;
      value.InputBy = Number(userId);
      handleSaveClick(value);
    };
  
    const handleSaveClick = (data) => {
      //console.log("handleSaveClick=> ", data);
      APIService.Post("Owner/Post", data)
  
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
  
      setTextType(null);
      setTextBank(null);
    };
  
    const handleBackClick = () => {
      navigate("/coordinator");
      setAction("list");
    };
    return (
      <>
        <FormTitle action={"ADD NEW"} name={"Coordinator"} />
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="grid lg:grid-cols-6 gap-3 mt-3">
            <div className="lg:col-span-2 xl:col-span-2">
              <div className="card p-3">
                <div className="grid lg:grid-cols-1 gap-1">
                  {/* requestor */}
                  <div className="mt-5">
                    <FormInput
                      name="Name"
                      label="Name"
                      placeholder=""
                      register={register}
                      type="text"
                      required
                      error={errors.Name}
                      showErrMsg={false}
                    />
                  </div>
                  <div className="mt-5">
                    <FormInput
                      name="Address"
                      label="Address"
                      placeholder=""
                      register={register}
                      type="text"                      
                      error={errors.Address}
                      showErrMsg={false}
                    />
                  </div>
                  <div className="mt-5">
                    <Select
                      list={bankList}
                      selectedText={textBank}
                      onSelectItem={onSelectItem}
                      name="Bank"
                      label="Bank"
                      register={register}
                      type="text"
                      className={`form-control mt-5 `}                      
                      error={errors.Type}
                      showErrMsg={false}
                    />
                  </div>
                  <div className="mt-5">
                    <FormInput
                      name="Branch"
                      label="Branch"
                      placeholder=""
                      register={register}
                      type="text"                      
                      error={errors.Branch}
                      showErrMsg={false}
                    />
                  </div>
                  <div className="mt-5">
                    <FormInput
                      name="AccNo"
                      label="AccNo"
                      placeholder=""
                      register={register}
                      type="text"                      
                      error={errors.AccNo}
                      showErrMsg={false}
                    />
                  </div>                  
                </div>{" "}
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
                  Save Coordinator
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
  
export default CoordinatorForm;
