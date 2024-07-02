import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FormTitle from "../../../components/FormTitle";
import APIService from "../../../services/APIService";
import FormInput from "../../../components/FormInput";
import MassageBox from "../../../components/MassageBox";
import Select from "../../../components/Select";
import ObjectiveDetailForm from "./ObjectiveDetailForm";
import Table from "../../../components/Table";

const ObjectiveView = () => {
  const [setDataSelected, setAction] = useOutletContext();

  const [boiList, setBoiList] = useState([]);
  const [textBoi, setTextBoi] = useState("");
  const [data, setData] = useState();
  const [dataList, setDataList] = useState([]);
  const [isDetail, setIsDetail] = useState(false);

  const [budget, setBudget] = useState(0);

  const navigate = useNavigate();
  let params = useParams();

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));
  const [userId, setUserId] = useState();

  //MessageBox
  const [content, setContent] = useState();
  const [show, setShow] = useState(false);
  const effectRan = useRef(false);

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
      Boi: [],
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
      setInitial();
      getBoi();
      getData();
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

  const getData = () => {
    if (params.id === undefined || params.id === null || params.id === 0)
      return;

    APIService.getById("Objective/GetById", params.id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (data === undefined || data === null) return;
    //console.log("Project View data =>", data);
    setValue("Id", data?.Id);
    setValue("Boi", data?.BOI);
    setValue("Name", data?.Name);
    setValue("Budget", data?.Budget);
    setValue("Withdraw", data?.Withdraw);

    setBudget(data?.Budget);

    setTextBoi(data?.BOI?.Name);
    setDataList(data?.ObjectiveDetails);
  }, [data]);

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

  const handleAddClick = (item) => {
    setDataList((prevItem) => {
      return [item, ...prevItem];
    });

  };

  const buttonTableClick = (action, value) => {
    if (!action) return;
    setShow(true);
    setContent({ Id: value?.Project?.Id, Name: value?.Project?.Name });
    setIsDetail(true);
  };

  const handledDeleteItem = () => {
    if (isDetail) {
      let items = dataList.filter((x) => x.Project?.Id !== content?.Id);
      setDataList(items);
      setShow(false);
      setIsDetail(false);
    }else{
      handledDeleteClick();
    }   
  };

  const handledDeleteClick = () => {
    var credential = { Id: data.Id, InputBy: userId };
    APIService.Post("Objective/Delete", credential)
      .then((res) => {
        if (res.status !== 200) return;
        setShow(false);
        handleBackClick();
      })
      .catch((err) => console.log(err));
  };

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val === null ? setError(name, { type: "required" }) : clearErrors(name);
  };

  const onSubmit = (value) => {
    value.Details = dataList;
    value.InputBy = Number(userId);
    handleSaveClick(value);
  };

  const handleSaveClick = (data) => {
    //console.log("handleSaveClick=> ", data);
    APIService.Put("Objective/Put", data)
      .then((res) => {
        if (res.status !== 200) return;
        handleBackClick();
      })
      .catch((err) => console.log(err));
  };

  const handleBackClick = () => {
    navigate("/objective");
    setDataSelected();
    setAction("list");
  };

  return (
    <>
      <FormTitle action={"VIEW"} name={"Objective"} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid lg:grid-cols-5 gap-3 mt-3">
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
                    Update Objective
                  </button>
                </div>
              </div>
              <div className="ml-1">
                <div>
                  <button
                    type="button"
                    className="btn btn btn_danger uppercase"
                    onClick={(e) => setShow(true)}
                  >
                    Delete Objective
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 xl:col-span-3">
            <div className="grid lg:grid-cols-2">
              <ObjectiveDetailForm onAddClick={handleAddClick} />
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

export default ObjectiveView;
