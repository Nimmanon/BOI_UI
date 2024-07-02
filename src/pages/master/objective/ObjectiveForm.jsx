import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import FormTitle from "../../../components/FormTitle";
import FormInput from "../../../components/FormInput";
import APIService from "../../../services/APIService";
import Select from "../../../components/Select";
import Table from "../../../components/Table";
import ObjectiveDetailForm from "./ObjectiveDetailForm";
import MassageBox from "../../../components/MassageBox";

const ObjectiveForm = () => {
  const [, setAction] = useOutletContext();

  const [boiList, setBoiList] = useState([]);  
  const [boiSelected, setBoiSelected] = useState();  
  const [textBoi, setTextBoi] = useState("");
  const [data, setData] = useState();
  const [dataList, setDataList] = useState([]);
  const [budget, setBudget] = useState(0);

  const [show, setShow] = useState(false);
  const [content, setContent] = useState();

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
      BOI: [],
      Name: "",
      Budget: "",
      Withdraw: "",
      Details: [],
    },
  });

  const column = [
    {
      label: "Project",
      key: "Project.Name",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "Budget",
      key: "Budget",
      align: "right",
      format: "number",
      digit: "2",
      export: true,
      total:true,
    }, 
    {
      label: "",
      key: "button",
      align: "center",
      format: "",
      action: [{ event: "delete", display: true }],
    },
  ];

  useEffect(() => {
    if (effectRan.current === false) {
      reset();
      setAction("new");
      setInitial();
      getBoi();      
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  useEffect(() => {
    if(dataList.length === 0){
      setBudget(0);
      setValue("Budget",0);
    }else{
      let total = 0;
      dataList?.forEach(x=>{
        total += x.Budget;
      })
      setBudget(total);
      setValue("Budget",total);
    }
  }, [dataList]);

  const getBoi = () => {
    APIService.getAll("Boi/Get")
      .then((res) => {
        setBoiList(res.data);
      })
      .catch((err) => console.log(err));
  };  

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val === null ? setError(name, { type: "required" }) : clearErrors(name);
    setBoiSelected(val);
  };

  const onSubmit = (value) => {
    value.Details = dataList;
    value.InputBy = Number(userId);
    handleSaveClick(value);
  };

  const handleAddClick = (item) => {
    setDataList((prevItem) => {
      return [item, ...prevItem];
    });
  };

  const buttonTableClick = (action, value) => {
    if (!action) return;
    setShow(true);
    setContent({ Id: value?.Project?.Id, Name: value?.Project?.Name });   
  };

  const handledDeleteItem = () => {
    let items = dataList.filter(x=>x.Project?.Id !== content?.Id);
    setDataList(items);
    setShow(false);
  };

  const handleSaveClick = (data) => {
    console.log("handleSaveClick=> ", data);
    APIService.Post("Objective/Post", data)

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
    setTextBoi("");
  };

  const handleBackClick = () => {
    navigate("/objective");
    setAction("list");
  };

  return (
    <>
      <FormTitle action={"ADD NEW"} name={"Objective"} />
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
                    name="BOI"
                    label="บัตรส่งเสริม(ฺBOI)"
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
                    name="Budget"
                    label="Budget"
                    placeholder=""
                    register={register}
                    type="number"
                    required
                    error={errors.Budget}
                    showErrMsg={false}
                    readonly={true}
                    value={budget}
                  />
                </div>
                {/* <div className="mt-5">
                  <FormInput
                    name="Withdraw"
                    label="Withdraw"
                    placeholder=""
                    register={register}
                    type="number"
                    required
                    error={errors.Withdraw}
                    showErrMsg={false}
                  />
                </div> */}
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
                    Save Objective
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
          </div>
          <div className="lg:col-span-4 xl:col-span-4">
            <div className="grid lg:grid-cols-2">
             <ObjectiveDetailForm onAddClick={handleAddClick} id={boiSelected?.Id}/>
            </div>

            <div className="mt-5">
              <Table
                data={dataList}
                column={column}
                actionClick={buttonTableClick}
                tableStyle={"list"}
                showPagging={false}
                showSammary={true}
              />
            </div>
          </div>
        </div>
      </form>

      <MassageBox
        show={show}
        action={"delete"}
        name={"Project"}
        content={content}
        size={"xl"}
        Massage={"Are you sure want to delete this item?"}
        handleCancelClick={() => {
          setShow(false);
        }}
        onDeleteClick={handledDeleteItem}
      />
      <div className={`${show ? "overlay active" : ""}`}></div>
    </>
  );
};
export default ObjectiveForm;
