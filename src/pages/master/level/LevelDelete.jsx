import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

const LevelDelete = ({ data, onVoidClick }) => {

    const [reason, setReason] = useState(null);
    const [errReason, setErrReason] = useState(false);
  
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
        Reason: null,
      },
    });
  
    const handleVoid = () => {
      if (reason === null || reason === "" || reason === undefined) {
        setErrReason(true);
        return;
      }
  
      let data = {};
      data.Remark = reason;
      onVoidClick(data);
    };

    return (
        <>
          <div className="grid lg:grid-cols-1 gap-2 mt-3">
            <div className="flex flex-col lg:col-span-2 xl:col-span-2">
              <div className="p-2 mt-1">
                <h4>ชื่อที่ต้องการลบ : {data?.Name}</h4>
    
                {/* <textarea
                  type="text"
                  name="Reason"
                  rows={5}
                  className={`form-control mt-1 bg-yellow-100 ${
                    errReason ? "is-invalid" : ""
                  }`}
                  placeholder="หมายเหตุ"
                  onChange={(e) => {
                    e.preventDefault();
                    setReason(e.target.value);
                    setErrReason(false);
                  }}
                  value={reason || ""}
                /> */}
    
                <div className="flex mt-1">
                  <button
                    type="button"
                    className="btn btn_outlined btn_danger ml-2 mr-2 uppercase"
                    onClick={handleVoid}
                  >
                    Confirm Void
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    };

export default LevelDelete