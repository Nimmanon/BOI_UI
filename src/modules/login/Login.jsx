import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import APIService from "../../services/APIService.jsx";
import { loginUser, logoutUser } from "../../store/reducers/auth.jsx";
import loading from "../../assets/image/loading2.gif";

const Login = () => {
  const [formValid, setFormValid] = useState(false);
  const [textInvalid, setTextInvalid] = useState("");

  const [IsShowPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current == false) {
      dispatch(logoutUser());
      return () => (effectRan.current = true);
    }
  }, []);

  const showPassword = () => setShowPassword(!IsShowPassword);

  const handleOnUsernameChange = (e) => setUsername(e.target.value);

  const handleOnPasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let credentials = { Username: Username, Password: Password };
    APIService.Post("Auth/Login", credentials)
      .then((res) => {
        if (res.status === 200) {
          const data = {
            Id: res.data?.Id,
            Name: res.data?.Name,
            User: res.data?.Username,
            Group: res.data?.Group,
            Level: res.data?.Level,
            Project: res.data?.Project,
            Token: res.data?.Token,
          };
          //console.log("Auth/Login",data);
          setIsLoading(false);

          if (res.data?.IsFirstLogin) {
            localStorage.setItem("_userid", btoa(res.data?.Id));
            localStorage.setItem("_refcode", btoa(res.data?.RefCode));
            navigate("/changepassword");
          } else {
            dispatch(loginUser(data));
            navigate("/");
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        //console.log(err);
        setFormValid(false);
        setTextInvalid(err.message);
      });

    //test
    // const data = {
    //   Id: 1,
    //   User: "admin",
    //   Token:
    //     "ZXlKaGJHY2lPaUpvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh5TURBeEx6QTBMM2h0YkdSemFXY3RiVzl5WlNOb2JXRmpMWE5vWVRVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpFMU5ESWlMQ0psZUhBaU9qRTNNREF4TlRRd01EQjkuZjVRcUdOdGxuMUtsQmxwS1ZtdUxpel91TElkekdLYi1aUjhvQWpkS1A1VmZmZFpVTkVDMmgxX1NTdnVObHgwY0ZvcGxDVG1SX1prOGFXeU8tSTE1bmc=",
    //   Group: 1,
    //   Name: "admin",
    // };

    // setIsLoading(false);
    // dispatch(loginUser(data));
    // navigate("/");
  };

  useEffect(() => {
    const checkData = Username.length > 0 && Password.length > 0;
    setFormValid(checkData);
  }, [Username, Password]);

  return (
    <div className="container flex items-center justify-center mt-20 py-10">
      <div className="w-full md:w-1/2 xl:w-1/3">
        <div className="mx-5 md:mx-10">
          {/* <h2 className="uppercase">ดีใจที่ได้พบคุณ!</h2> */}
          <h2 className="uppercase">เข้าสู่ระบบที่นี่</h2>
        </div>
        <form
          className="card mt-5 p-5 md:p-10"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="mb-3 text-center">
            <div>
              {textInvalid !== "" && (
                <label className="block invalid-feedback">
                  {textInvalid}
                  <br /> กรุณาเข้าสู่ระบบใหม่อีกครั้ง
                </label>
              )}
            </div>
          </div>
          <div className="mb-5">
            <label className="label block mb-2">ชื่อผู้ใช้</label>
            <input
              type="text"
              className="form-control bg-yellow-100"
              placeholder="ป้อนชื่อผู้ใช้"
              onChange={handleOnUsernameChange}
              value={Username}
              autoComplete="off"
            />
          </div>
          <div className="mb-5">
            <label className="label block mb-2" htmlFor="password">
              รหัสผ่าน
            </label>
            <label className="form-control-addon-within">
              <input
                type={IsShowPassword ? "text" : "password"}
                className="form-control border-none bg-yellow-100"
                placeholder="ป้อนรหัสผ่าน"
                onChange={handleOnPasswordChange}
                value={Password}
                autoComplete="off"
              />
              <span className="flex items-center ltr:pr-4 rtl:pl-4 bg-yellow-100">
                <button
                  type="button"
                  className="btn btn-link text-gray-300 dark:text-gray-700 la la-eye text-xl leading-none"
                  onClick={showPassword}
                ></button>
              </span>
            </label>
          </div>
          {!isLoading && (
            <div className="flex flex-col items-center">
              <button
                className="btn bg-primary ltr:ml-auto rtl:mr-auto uppercase"
                type="submit"
                disabled={!formValid}
              >
                Login
              </button>
            </div>
          )}
          {isLoading && (
            <div className="flex justify-center">
              <img src={loading} alt="loading..." />
            </div>
          )}
          {/* <div className="flex flex-col items-center mt-10">
                        <a href="" className="text-sm uppercase">ลืมรหัสผ่าน?</a>
                    </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
