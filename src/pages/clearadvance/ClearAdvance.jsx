import {
  Outlet,
  useLocation,
  useNavigate,
  //useOutletContext,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import moment from "moment";

const ClearAdvance = () => {
  const [action, setAction] = useState("list");
  const [dataSelected, setDataSelected] = useState();

  const [dataSearch, setDataSearch] = useState();

  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      // let current = new Date();
      // let fday = new Date(
      //   current.getFullYear(),
      //   current.getMonth(),
      //   1,
      //   0,
      //   0,
      //   0,
      //   0
      // );
      // let tday = new Date(
      //   current.getFullYear(),
      //   current.getMonth(),
      //   current.getDate(),
      //   0,
      //   0,
      //   0,
      //   0
      // );

      // let item = {};
      // item.Date = moment(fday).format("YYYY-MM-DD");
      // item.ToDate = moment(tday).format("YYYY-MM-DD");
      // //console.log("Advance loading...");
      // setDataSearch(item);

      //localStorage.removeItem('_Location');
      return () => (effectRan.current = true);
    }
  }, []);

  useEffect(() => {
    if (dataSelected === undefined || dataSelected === "") return;
    navigate(
      "/clearadvance/view/" + dataSelected?.JobId + "/" + dataSelected?.ProjectId
    );
  }, [dataSelected]);

  return (
    <div>
      <Outlet
        context={[setDataSelected, setAction, setDataSearch, dataSearch]}
      />
    </div>
  );
};

export default ClearAdvance;
