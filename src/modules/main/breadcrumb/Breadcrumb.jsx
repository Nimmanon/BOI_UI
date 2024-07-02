import { useEffect, useState } from "react";

const Breadcrumb = () => {
  //const { path, page, linkpage } = props;
  //console.log(path, page, linkpage)

  const [_path, setPath] = useState("");
  const [_page, setPage] = useState("");
  const [_linkpage, setLinkPage] = useState("");

  useEffect(() => {
    setPath(localStorage.getItem("_path"));
    setPage(localStorage.getItem("_page"));
    setLinkPage(localStorage.getItem("_linkpage"));
  }, []);

  return (
    <div>
      {/* <section className="breadcrumb"> */}
      <h2>{_page ? _page : "Dashboard"}</h2>
      {_page !== _path && (
        <ul className="mt-0 mr-1">
          <li className="font-bold">
            <a
              href={_linkpage}
              onClick={(e) => localStorage.setItem("_page", _path)}
            >
              {_path}
            </a>
          </li>
          <li className="divider la la-arrow-right"></li>
          <li>{_page}</li>
        </ul>
      )}
      
      {/* </section> */}
    </div>
  );
};

export default Breadcrumb;
