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
import Table from "../../components/Table";
import ClearAdvanceAddForm from "./ClearAdvanceAddForm";
import CustomModal from "../../components/CustomModal";
import ClearAdvanceViewForm from "./ClearAdvanceViewForm";
import JobViewData from "../job/JobViewData";
import MassageBox from "../../components/MassageBox";

const ClearAdvanceForm = () => {
  const [setDataSelected, setAction] = useOutletContext();

  const [data, setData] = useState();
  const [dataList, setDataList] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [date, setDate] = useState();

  const [show, setShow] = useState(false);
  const [showMsgBox, setShowMsgBox] = useState(false);

  const [action, setAct] = useState("");
  const [editData, setEditData] = useState();
  const [content, setContent] = useState();

  const [search, setSearch] = useState("");

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
    defaultValues: {},
  });

  const columnTable = [
    {
      label: "ประเภท",
      key: "ExpenseType",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "วันที่",
      key: "Date",
      align: "left",
      format: "shotdate",
      export: true,
    },
    {
      label: "รายการ",
      key: "Description",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "เลขที่เอกสารอ้างอิง",
      key: "ReferenceNo",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "จำนวนเงิน (บาท)",
      key: "Amount",
      align: "right",
      format: "number",
      digit: 2,
      export: true,
      total: true,
    },
    {
      label: "ภาษีมูลค่าเพิ่ม (บาท)",
      key: "VAT",
      align: "right",
      format: "number",
      digit: 2,
      export: true,
      total: true,
    },
    {
      label: "ภาษีหัก ณ ที่จ่าย (บาท)",
      key: "WT",
      align: "right",
      format: "number",
      digit: 2,
      export: true,
      total: true,
    },
    {
      label: "รวมเป็นเงิน (บาท)",
      key: "Total",
      align: "right",
      format: "number",
      digit: 2,
      export: true,
      total: true,
    },
    {
      label: "หมายเหตุ",
      key: "Remark",
      align: "left",
      format: "string",
      export: true,
    },
    {
      label: "",
      key: "button",
      align: "center",
      format: "",
      action: [
        { event: "edit", display: true },
        { event: "delete", display: true },
      ],
    },
  ];

  useEffect(() => {
    if (effectRan.current === false) {
      getJobData();
      getData();
      setInitial();
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setUserId(atob(auth.Id));
  };

  const getJobData = () => {
    if (
      params.id === undefined ||
      params.id === null ||
      params.id === 0 ||
      params.pid === undefined ||
      params.pid === null ||
      params.pid === 0
    )
      return;

    APIService.getAll("Job/GetByJobProject/" + params.id + "/" + params.pid)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getData = () => {
    APIService.getAll(
      "Reference/GetByJobProject/" + params.id + "/" + params.pid
    )
      .then((res) => {
        setDataList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const addNew = () => {
    setShow(true);
    setAct("new");
  };

  const handleAddItem = (item) => {
    setDataList((prevItem) => {
      return [item, ...prevItem];
    });
    setShow(false);
    setAct("");
    getJobData();
  };

  const buttonTableClick = (act, value) => {
    if (!act) return;
    value.JobId = params.id;
    value.ProjectId = params.pid;
    setEditData(value);

    if (act === "edit") {
      setAct(act);
      setShow(true);
    } else {
      setShowMsgBox(true);
      setContent({
        Id: value?.Id,
        Name:
          value?.Description +
          " จำนวนเงิน " +
          value?.Amount?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) +
          " บาท",
      });
    }
  };

  const handleUpdateItem = (item) => {
    //remove old
    let items = dataList.filter((x) => x.Id !== editData?.Id);
    setDataList(items);

    setDataList((prevItem) => {
      return [item, ...prevItem];
    });
    setShow(false);
    setAct("");
    getJobData();
  };

  const handledDeleteItem = () => {
    let item = {};
    item.Id = editData?.Id;
    item.InputBy = Number(userId);

    APIService.Post("Reference/Delete", item)
      .then((res) => {
        if (res.status !== 200) return;
        UpdateStock(res.data?.stock);
      })
      .catch((err) => console.log(err));
  };

  const UpdateStock = (item) => {
    APIService.Post("Stock/UpdateStockMove", item)
      .then((res) => {
        //remove array
        let items = dataList.filter((x) => x.Id !== content.Id);
        setDataList(items);
        setShowMsgBox(false);
        setAct("");
        getJobData();
      })
      .catch((err) => console.log(err));
  };

  const handleBackClick = () => {
    navigate("/clearadvance");
    setAction("list");
  };

  useEffect(() => {
    if (JSON.stringify(search) !== JSON.stringify(data)) {
      getSearch(search);
    }
  }, [search]);

  useEffect(() => {
    getSearch(search);
  }, [dataList]);

  const getSearch = (textSearch) => {
    if (!textSearch) {
      setDataTable(dataList);
    } else {
      let val = textSearch.toLowerCase();
      let items = dataList.filter(function (data) {
        return JSON.stringify(data).toLowerCase().includes(val);
      });
      setDataTable(items);
    }
  };

  return (
    <>
      {/* <FormTitle action={"VIEW"} name={"Advance"} /> */}
      <div className="grid lg:grid-cols-4 xl:grid-cols-4 md:grid-cols-4 gap-3 mt-3">
        <div className="lg:col-span-1 xl:col-span-1 md:col-span-1">
          <JobViewData dataSelected={data} />
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
          </div>
        </div>
        <div className="lg:col-span-3 xl:col-span-3 md:col-span-3">
          <section className="breadcrumb lg:flex justify-between">
            <div>
              <h3>รายการเคลียร์เงินทดลองจ่าย</h3>
            </div>
            <div className="flex flex-wrap gap-2 items-center ml-auto mr-auto lg:mt-0">
              {/* Search */}
              <div className="flex flex-auto items-center">
                <label className="form-control-addon-within rounded-full bg-yellow-100">
                  <input
                    type="text"
                    className="form-control border-none bg-yellow-100"
                    placeholder="Search"
                    onChange={(e) => {
                      e.preventDefault();
                      setSearch(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-link bg-yellow-100 text-primary text-xl leading-none la la-search mr-4 ml-4"
                    onClick={(e) => {
                      e.preventDefault();
                      onSearchChange(search);
                    }}
                  />
                </label>
              </div>
              {data?.Withdraw > 0 && (
                <div className="flex gap-x-2">
                  <button
                    onClick={addNew}
                    className="btn btn_primary uppercase"
                  >
                    <span className="la la-plus-circle text-xl leading-none mr-1"></span>
                    Add New
                  </button>
                </div>
              )}
              {/* <div>
                <Link
                  id={name}
                  key={name}
                  to={""}
                  className="link"
                  title="help"
                  onClick={handleHelpClick}
                >
                  <span className="icon la la-question-circle text-4xl" />
                </Link>
              </div> */}
            </div>
          </section>
          <div className="mt-5">
            <Table
              data={dataTable}
              column={columnTable}
              actionClick={buttonTableClick}
              tableStyle={"list"}
              showSammary={true}
            />
          </div>
        </div>
      </div>

      <CustomModal
        show={show}
        content={data}
        action={"add"}
        name={"Clear Advance"}
        size={"9xl"}
        handleCancelClick={(e) => {
          setShow(false);
          setAct("");
        }}
        form={
          action === "new" ? (
            <ClearAdvanceAddForm
              action={action}
              data={data}
              onAddItem={handleAddItem}
            />
          ) : (
            <ClearAdvanceViewForm
              action={action}
              dataSelected={editData}
              onUpdateItem={handleUpdateItem}
            />
          )
        }
      />
      <div className={`${show ? "overlay active" : ""}`}></div>

      <MassageBox
        show={showMsgBox}
        action={"delete"}
        name={"Clear Advance"}
        content={content}
        size={"xl"}
        Massage={"Are you sure want to delete this item?"}
        handleCancelClick={() => {
          setShowMsgBox(false);
        }}
        onDeleteClick={handledDeleteItem}
      />
      <div className={`${showMsgBox ? "overlay active" : ""}`}></div>
    </>
  );
};

export default ClearAdvanceForm;
