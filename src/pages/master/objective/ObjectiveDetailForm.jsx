import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "../../../components/FormInput";
import APIService from "../../../services/APIService";
import Select from "../../../components/Select";

const ObjectiveDetailForm = ({ onAddClick, id }) => {
  const [projectList, setProjectList] = useState([]);
  const [textProject, setTextProject] = useState("");

  const effectRan = useRef(false);

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
      Project: null,
      Budget: "",
    },
  });

  useEffect(() => {
    if (effectRan.current === false) {
      reset();
      //getProject();
      return () => (effectRan.current = true);
    }
  }, []);

  useEffect(() => {
    getProject();
  }, [id]);

  const getProject = () => {
    setProjectList([]);
    if (id === undefined) return;
    APIService.getAll("Project/GetByBOIId/" + id)
      .then((res) => {
        setProjectList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const onSelectItem = (val, name) => {
    setValue(name, val == null ? null : val);
    val === null ? setError(name, { type: "required" }) : clearErrors(name);
    setTextProject(val?.Name);
  };

  const handleAddClick = () => {
    let item = {};
    item.Id=0;
    item.Project = getValues("Project");
    item.Budget = Number(getValues("Budget"));
    item.Withdraw = 0;
    onAddClick(item);
    clearForm();
  };

  const clearForm = () => {
    setValue("Project", null);
    setValue("Budget", "");
    clearErrors();
    setTextProject("");
  };

  return (
    <>
      <div className="card p-3">
        <div className="grid lg:grid-cols-1 gap-1">
          <div className="mt-5">
            <Select
              list={projectList}
              selectedText={textProject}
              onSelectItem={onSelectItem}
              name="Project"
              label="Project"
              register={register}
              type="text"
              className={`form-control mt-5 `}
              required
              error={errors.Project}
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
            />
          </div>
        </div>
        {getValues("Project") !== undefined &&
          getValues("Project") !== null && (
            <div className="mt-5">
              <div>
                <button
                  type="button"
                  className="btn btn btn_primary uppercase"
                  onClick={handleAddClick}
                >
                  Add Project
                </button>
              </div>
            </div>
          )}
      </div>
    </>
  );
};
export default ObjectiveDetailForm;
