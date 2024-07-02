import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import APIService from "../../services/APIService";

const Dashboard = () => {
  const [boiList, setBOIList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  //const [boiSelected, setฺฺBOISelected] = useState();

  const effectRan = useRef(false);
  const [level, setLevel] = useState();
  const [project, setProject] = useState();

  //system
  const [auth, setAuth] = useState(useSelector((state) => state.auth));

  useEffect(() => {
    if (effectRan.current === false) {
      setInitial();
      localStorage.removeItem("BOI");
      return () => (effectRan.current = true);
    }
  }, []);

  const setInitial = () => {
    if (auth === undefined) return;
    setLevel(JSON.parse(auth.Level));
    setProject(JSON.parse(auth.Project));
  };

  useEffect(() => {
    if (level === undefined) return;
    if (level?.Value === 0 || level?.Value === 1) {
      getBOI();
    }
  }, [level]);

  useEffect(() => {
    if (project === undefined || project === null) return;
    getByProject();
  }, [project]);

  const getBOI = () => {
    if (level === undefined) return;

    APIService.getAll("BOI/GetBOIByLevel/" + level?.Value)
      .then((res) => {
        setBOIList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getByProject = () => {

    APIService.getById("Project/GetById",project.Id)
      .then((res) => {
        setProjectList([res.data]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {/* {boiSelected !== undefined && (
        <section className="breadcrumb bg-yellow-100">
          <div>{boiSelected?.Name}</div>
        </section>
      )} */}

      <section className="breadcrumb">
        <h1>Dashboard</h1>
        <ul>
          {/* <li>
            <a href="#">Login</a>
          </li> */}
          <li className="divider la la-arrow-right"></li>
          <li>Dashboard</li>
        </ul>
      </section>
      <div className="grid lg:grid-cols-6 gap-5 mt-3">
        {boiList !== undefined && boiList !== null && boiList?.length > 0 && (
          <div className="lg:col-span-4 md:col-span-4">
            <div className="grid sm:grid-cols-4 gap-5">
              {boiList.map((item, index) => {
                {
                  return (
                    <div
                      key={index}
                      className="card cursor-pointer px-4 py-8 flex justify-center items-center text-center lg:transform hover:shadow-lg transition-transform duration-200"
                    >
                      <div>
                        <span className="text-primary text-5xl leading-none la la-campground" />
                        <p className="mt-2">{item?.Name}</p>
                        {/* <div className="text-primary mt-5 text-3xl leading-none">
                        18
                      </div> */}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
        {projectList !== undefined && projectList !== null && projectList?.length > 0 && (
          <div className="lg:col-span-4 md:col-span-4">
            <div className="grid sm:grid-cols-4 gap-5">
              {projectList.map((item, index) => {
                {
                  return (
                    <div
                      key={index}
                      className="card cursor-pointer px-4 py-8 flex justify-center items-center text-center lg:transform hover:shadow-lg transition-transform duration-200"
                    >
                      <div>
                        <span className="text-primary text-5xl leading-none la la-campground" />
                        <p className="mt-2">{item?.Name}</p>
                        {/* <div className="text-primary mt-5 text-3xl leading-none">
                        18
                      </div> */}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
        <div className="lg:col-span-2 md:col-span-2">
          <div className="card p-3 py-10">Manual</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
