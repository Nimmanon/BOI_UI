import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const JobViewData = ({ dataSelected }) => {
  const [date, setDate] = useState();
  const [data, setData] = useState();
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
    defaultValues: {},
  });

  useEffect(() => {
    setValue("Date", date);
  }, [date]);

  useEffect(() => {    
    setData(dataSelected);
  }, [dataSelected]);  

  return (
    <>
      <div className="grid lg:grid-cols-1 card p-3">
        <div className="input-group mt-1">
          <div className="input-addon input-addon-prepend input-group-item w-48">
            บัตรส่งเสริม(BOI)
          </div>
          <input
            type="text"
            className="form-control input-group-item readOnly"
            defaultValue={data?.BOI || ""}
          />
        </div>
        <div className="input-group mt-1">
          <div className="input-addon input-addon-prepend input-group-item w-48">
            โครงการ
          </div>
          <input
            type="text"
            className="form-control input-group-item readOnly"
            defaultValue={data?.Owner || ""}
          />
        </div>
        <div className="input-group mt-1">
          <div className="input-addon input-addon-prepend input-group-item w-48">
            วัตถุประสงค์
          </div>
          <input
            type="text"
            className="form-control input-group-item readOnly"
            defaultValue={data?.Objective || ""}
          />
        </div>
        <div className="input-group mt-1">
          <div className="input-addon input-addon-prepend input-group-item w-48">
            วงเงิน (บาท)
          </div>
          <input
            type="text"
            className="form-control input-group-item readOnly"
            defaultValue={
              data?.Budget?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || ""
            }
          />
        </div>
        <div className="input-group mt-1">
          <div className="input-addon input-addon-prepend input-group-item w-48">
            เบิกแล้ว (บาท)
          </div>
          <input
            type="text"
            className="form-control input-group-item readOnly"
            defaultValue={
              data?.Withdraw?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || ""
            }
          />
        </div>
        <div className="input-group mt-1">
          <div className="input-addon input-addon-prepend input-group-item w-48">
            เคลียร์แล้ว (บาท)
          </div>
          <input
            type="text"
            className="form-control input-group-item readOnly"
            defaultValue={
              data?.Advance?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || ""
            }
          />
        </div>
        <div className="input-group mt-1">
          <div className="input-addon input-addon-prepend input-group-item w-48">
            ค้างเคลียร์ (บาท)
          </div>
          <input
            type="text"
            className="form-control input-group-item readOnly"
            defaultValue={
              data?.Balance?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || ""
            }
          />
        </div>
      </div>
    </>
  );
};

export default JobViewData;
