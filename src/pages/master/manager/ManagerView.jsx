import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import FormTitle from "../../../components/FormTitle";
import APIService from "../../../services/APIService";
import FormInput from "../../../components/FormInput";
import MassageBox from "../../../components/MassageBox";
import Select from "../../../components/Select";

const ManagerView = () => {
  const [setDataSelected, setAction] = useOutletContext();

  const [dataList, setDataList] = useState([]);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [typeList, setTypeList] = useState([]);
  const [bankList, setBankList] = useState([]);

  const [textType, setTextType] = useState("");
  const [textBank, setTextBank] = useState("");

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
      setInitial();
      getBank();
      getData();
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
  const getData = () => {
    if (params.id === undefined || params.id === null || params.id === 0)
      return;

    APIService.getById("Owner/GetById", params.id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  useEffect(() => {
    if (data === undefined || data === null) return;
    // console.log("Owner View data =>", data);
    setValue("Id", data?.Id);
    setValue("Name", data?.Name);
    setValue("Address", data?.Address);
    setValue("Bank", data?.Bank);
    setValue("Branch", data?.Branch);
    setValue("AccNo", data?.AccNo);
    setValue("Type", data?.Type);

    setTextBank(data?.Bank?.Name);
    setTextType(data?.Type?.Name);
  }, [data]);

  const handledDeleteItem = () => {
    var credential = { Id: data.Id, InputBy: userId };
    APIService.Post("Owner/Delete", credential)
      .then((res) => {
        if (res.status !== 200) return;
        setShow(false);
        handleBackClick();
      })
      .catch((err) => console.log(err));
  };

  const handleBackClick = () => {
    navigate("/manager");
    setDataSelected();
    setAction("list");
  };

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val === null ? setError(name, { type: "required" }) : clearErrors(name);
  };

  const onSubmit = (value) => {
    // console.log("onSubmit =>",value);
    // value.Details = fileList;
    value.InputBy = Number(userId);
    handleSaveClick(value);
  };

  const handleSaveClick = (data) => {
    //console.log("handleSaveClick=> ", data);
    APIService.Put("Owner/Put", data)
      .then((res) => {
        if (res.status !== 200) return;
        handleBackClick();
        // console.log("Request/Post", data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <FormTitle action={"VIEW"} name={"Manager"} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid lg:grid-cols-3 gap-2">
          <div className="grid lg:grid-cols-1">
            <div className="card p-3">
              <div>
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
                      required
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
                      required
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
                      required
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
                      required
                      error={errors.AccNo}
                      showErrMsg={false}
                    />
                  </div>
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="flex mt-2">
          <button
            type="submit"
            className="btn btn_primary uppercase "
            onClick={handleBackClick}
          >
            <span className="la la-chevron-circle-left text-xl leading-none mr-1 "></span>
            GO BACK
          </button>

          <button type="submit" className="btn btn_primary uppercase ml-2">
            Update Manager
          </button>

          <div className="ml-2">
            <div>
              <button
                type="button"
                className="btn btn_danger uppercase"
                onClick={() => {
                  setShow(true);
                }}
              >
                Delete Manager
              </button>
            </div>
          </div>
        </div>
      </form>

      <MassageBox
        show={show}
        action={"delete"}
        name={"Owner"}
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
export default ManagerView;
