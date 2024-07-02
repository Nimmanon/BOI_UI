import React from "react";
import Breadcrumb from "../modules/main/breadcrumb/Breadcrumb";
import { useOutletContext } from "react-router-dom";

const FormTitle = ({action,name}) => {

  const [ActivePath, ActivePage] = useOutletContext(); // <-- access context value
  return (
    <div>
      <section className="breadcrumb lg:flex justify-between">
        <Breadcrumb path={name} page={action} />
      </section>
    </div>
  );
};

export default FormTitle;
