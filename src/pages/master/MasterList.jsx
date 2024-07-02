import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FormTitle from "../../components/FormTitle.jsx";

const MasterList = () => {
  const effectRan = useRef(false);
  const [topicList, setTopicList] = useState();
  const [pageList, setPageList] = useState();
  const [menuActive, setMenuActive] = useState();

  const navigate = useNavigate();

  const menulist = [
    {
      Id: 110,
      Type: "topic",
      Name: "",
      Description: "",
      Title: "Masters",
      Icon: "",
      Parents: 10,
      Seq: 10,
    },
    // {
    //   Id: 115,
    //   Type: "link",
    //   Name: "/supplier",
    //   Description: "",
    //   Title: "Suppliers",
    //   Icon: "la la-award text-5xl",
    //   Parents: 10,
    //   Seq: 30,
    //   Topic: 110,
    // },
    {
      Id: 120,
      Type: "link",
      Name: "/boi",
      Description: "",
      Title: "ข้อมูลบัตรส่งเสริม (BOI)",
      Icon: "la la-image text-5xl",
      Parents: 10,
      Seq: 40,
      Topic: 110,
    },
    {
      Id: 121,
      Type: "link",
      Name: "/project",
      Description: "",
      Title: "ข้อมูลโครงการ",
      Icon: "la la-image text-5xl",
      Parents: 10,
      Seq: 40,
      Topic: 110,
    },
    {
      Id: 125,
      Type: "link",
      Name: "/expensetype",
      Description: "",
      Title: "ประเภทค่าใช้จ่าย",
      Icon: "la la-tags text-5xl",
      Parents: 10,
      Seq: 60,
      Topic: 110,
    },
    {
      Id: 130,
      Type: "link",
      Name: "/coordinator",
      Description: "",
      Title: "ผู้ประสานงานโครงการ",
      Icon: "la la-home text-5xl",
      Parents: 10,
      Seq: 80,
      Topic: 110,
    },
    {
      Id: 135,
      Type: "link",
      Name: "/company",
      Description: "",
      Title: "บริษัท/มูลนิธิ",
      Icon: "la la-building text-5xl",
      Parents: 10,
      Seq: 110,
      Topic: 110,
    },
    // {
    //   Id: 140,
    //   Type: "link",
    //   Name: "/user",
    //   Description: "",
    //   Title: "User",
    //   Icon: "la la-user text-5xl",
    //   Parents: 10,
    //   Seq: 120,
    //   Topic: 110,
    // },
    // {
    //   Id: 145,
    //   Type: "link",
    //   Name: "/level",
    //   Description: "",
    //   Title: "Level",
    //   Icon: "la la-layer-group text-5xl",
    //   Parents: 10,
    //   Seq: 130,
    //   Topic: 110,
    // },
    {
      Id: 150,
      Type: "link",
      Name: "/objective",
      Description: "",
      Title: "วัตถุประสงค์โครงการ",
      Icon: "la la-calculator text-5xl",
      Parents: 10,
      Seq: 140,
      Topic: 110,
    },
    {
      Id: 155,
      Type: "link",
      Name: "/type",
      Description: "",
      Title: "ประเภท ผู้รับผิดชอบ",
      Icon: "la la-user text-5xl",
      Parents: 10,
      Seq: 150,
      Topic: 110,
    },
    // {
    //   Id: 160,
    //   Type: "link",
    //   Name: "/owner",
    //   Description: "",
    //   Title: "Owner",
    //   Icon: "la la-cubes text-5xl",
    //   Parents: 20,
    //   Seq: 160,
    //   Topic: 110,
    // },
    {
      Id: 165,
      Type: "link",
      Name: "/bank",
      Description: "",
      Title: "ข้อมูลธนาคาร",
      Icon: "la la-landmark text-5xl",
      Parents: 20,
      Seq: 170,
      Topic: 110,
    },
    // {
    //   Id: 175,
    //   Type: "link",
    //   Name: "/group",
    //   Description: "",
    //   Title: "Group",
    //   Icon: "la la-hdd text-5xl",
    //   Parents: 10,
    //   Seq: 150,
    //   Topic: 110,
    // },
  ];

  useEffect(() => {
    if (effectRan.current == false) {
      setData();
      return () => (effectRan.current = true);
    }
  }, []);

  useEffect(() => {
    if (menuActive === undefined) return;
    localStorage.setItem("_activeid", menuActive.Parents);
    const [parent] = topicList.filter((x) => x.Id === menuActive.Topic);
    localStorage.setItem("_path", parent.Title);
    localStorage.setItem("_page", menuActive.Title);
    navigate(menuActive.Name);
  }, [menuActive]);

  const compare = (a, b) => {
    if (a.Title < b.Title) {
      return -1;
    }
    if (a.Title > b.Title) {
      return 1;
    }
  };

  const setData = () => {
    if (menulist?.length === 0) return;

    const topic = menulist.filter((x) => x.Type === "topic");
    setTopicList(topic);

    const menu = menulist.filter((x) => x.Type === "link");
    setPageList(menu);
  };

  return (
    <>
      <h2>Master lists</h2>
      <div className="grid lg:grid-cols-1 gap-3 mt-3">
        {topicList !== undefined &&
          topicList !== null &&
          topicList?.length > 0 &&
          topicList?.map((item, index) => {
            {
              return (
                <div key={index}>
                  <div className="grid lg:grid-cols-7 gap-5 ml-3 mr-4 mt-5">
                    {pageList
                      .sort(compare)
                      .filter((x) => x.Topic === item.Id)
                      .map((m, mi) => {
                        return (
                          <div
                            className="link cursor-pointer text-center outline-div"
                            onClick={(e) => {
                              setMenuActive(m);
                            }}
                            key={m.Id}
                          >
                            <div className="uppercase mt-3 mb-5">
                              <h4>
                                <span className={m.Icon} />
                                <div>{m.Title}</div>
                              </h4>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            }
          })}
      </div>
    </>
  );
};

export default MasterList;
