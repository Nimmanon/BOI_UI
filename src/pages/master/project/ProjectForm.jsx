import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import FormTitle from "../../../components/FormTitle";
import FormInput from "../../../components/FormInput";
import APIService from "../../../services/APIService";
import Select from "../../../components/Select";

const ProjectForm = () => {
  const [, setAction] = useOutletContext();

  const [boiList, setBoiList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [typeList, setTypeList] = useState([]);

  const [textBoi, setTextBoi] = useState("");
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
      Boi: [],
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
      getBoi();
      getBank();
      getType();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  const getBoi = () => {
    APIService.getAll("Boi/Get")
      .then((res) => {
        setBoiList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getType = () => {
    APIService.getAll("Type/Get")
      .then((res) => {
        setTypeList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getBank = () => {
    APIService.getAll("Bank/Get")
      .then((res) => {
        setBankList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val === null ? setError(name, { type: "required" }) : clearErrors(name);
  };

  const onSubmit = (value) => {
    // value.Details = fileList;   
    console.log("onSubmit", value);
    let [type] = typeList?.filter(x=>x.Value===3);
    value.Owner = { 
      Id:0,     
      Type: type,
      Bank: value.Bank,
      Name: value.Name,
      Address: value.Address,      
      Branch: value.Branch,
      AccNo: value.AccNo
         
    };
    value.InputBy = Number(userId);
    handleSaveClick(value);
  };

  const handleSaveClick = (data) => {
    console.log("handleSaveClick=> ", data);
    APIService.Post("Project/Post", data)

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
    setTextBoi(null);
    setTextBank(null);
  };

  const handleBackClick = () => {
    navigate("/project");
    setAction("list");
  };

  return (
    <>
      <FormTitle action={"ADD NEW"} name={"Project"} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid lg:grid-cols-6 gap-3 mt-3">
          <div className="lg:col-span-2 xl:col-span-2">
            <div className="card p-3">
              <div className="grid lg:grid-cols-1 gap-1">
                {/* requestor */}
                <div className="mt-5">
                  <Select
                    list={boiList}
                    selectedText={textBoi}
                    onSelectItem={onSelectItem}
                    name="Boi"
                    label="Boi"
                    register={register}
                    type="text"
                    className={`form-control mt-5 `}
                    required
                    error={errors.Boi}
                    showErrMsg={false}
                  />
                </div>
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
                    //required
                    //error={errors.Address}
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
                    //required
                    //error={errors.Type}
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
                    //required
                    //error={errors.Branch}
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
                    //required
                    //error={errors.AccNo}
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
                Save Project
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

export default ProjectForm;
