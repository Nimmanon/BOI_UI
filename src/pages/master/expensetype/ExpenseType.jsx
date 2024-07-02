import {
    Outlet,
    useLocation,
    useNavigate,
    //useOutletContext,
  } from "react-router-dom";
  import { useEffect, useRef, useState } from "react";

const ExpenseType = () => {
    const [action, setAction] = useState("list");
    const [dataSelected, setDataSelected] = useState();
  
    const [dataSearch, setDataSearch] = useState();
  
    const navigate = useNavigate();
    const location = useLocation();
    const effectRan = useRef(false);
  
    useEffect(() => {
      if (effectRan.current === false) {
        let item = {};
        //console.log("issue loading...");
        setDataSearch(item);
  
        //localStorage.removeItem('_Location');
        return () => (effectRan.current = true);
      }
    }, []);
  
    useEffect(() => {
      if (dataSelected === undefined || dataSelected === "") return;
      navigate("/expensetype/view/" + dataSelected?.Id);
    }, [dataSelected]);
  
    return (
      <div>
        <Outlet
          context={[setDataSelected, setAction, setDataSearch, dataSearch]}
        />
      </div>
    );
  };

export default ExpenseType;
