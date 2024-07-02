import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import APIService from "../../services/APIService";
import loading from "../../assets/image/loading2.gif";
import { loginUser, logoutUser } from "../../store/reducers/auth";

const ChangePassword = () => {
    const [formValid, setFormValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [textInvalid, setTextInvalid] = useState('');

    const [IsShowOldPassword, setShowOldPassword] = useState(false);
    const [IsShowNewPassword, setShowNewPassword] = useState(false);
    const [IsShowConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [referCode, setReferCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //system
    const [auth, setAuth] = useState(useSelector((state) => state.auth));   
    const [userId, setUserId] = useState(atob(localStorage.getItem('_userid')));

    const effectRan = useRef(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        let credentials = { Id: userId, "ReferCode": referCode, "Password": newPassword };
        APIService.Put("Auth/FirstLogin", credentials)
            .then(res => {
                if (res.status === 200) {
                    dispatch(logoutUser());
                    navigate('/');
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
                setFormValid(false);
                setTextInvalid(err.response.data);
            })
    }

    useEffect(() => {
        //console.log(newPassword, confirmPassword);
        if (newPassword === undefined || newPassword === "" || newPassword === null ||
            confirmPassword === undefined || confirmPassword === "" || confirmPassword === null) {
            setPasswordValid(true);
            return;
        };

        var checkData = newPassword === confirmPassword
        setFormValid(checkData);
        setPasswordValid(checkData);
    }, [newPassword, confirmPassword])    

    return (
        <div className="container flex items-center justify-center mt-20 py-10">
            <div className="w-full md:w-1/2 xl:w-1/3">
                <div>
                    <h2 className="uppercase">Change Password</h2>
                </div>
                <form className="card mt-3 p-5 md:p-10" onSubmit={handleSubmit} autoComplete="off">
                    {textInvalid !== "" &&
                        <div className="mb-3 text-center">
                            <div>
                                <label className="block invalid-feedback">{textInvalid}<br /> กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง</label>
                            </div>
                        </div>
                    }                  
                    <div className="mb-5">
                        <label className="label block mb-2" htmlFor="password">รหัสอ้างอิง</label>
                        <label className="form-control-addon-within">
                            <input
                                type="text"
                                className="form-control border-none bg-yellow-100"
                                placeholder="รหัสอ้างอิง"
                                onChange={e => setReferCode(e.target.value)}
                                value={referCode}
                                autoComplete="off"
                            />                            
                        </label>
                    </div>
                    <div className="mb-5">
                        <label className="label block mb-2" htmlFor="password">รหัสผ่านใหม่</label>
                        <label className="form-control-addon-within">
                            <input
                                type={IsShowNewPassword ? "text" : "password"}
                                className="form-control border-none bg-yellow-100"
                                placeholder="รหัสผ่านใหม่"
                                onChange={e => setNewPassword(e.target.value)}
                                value={newPassword}
                                autoComplete="off"
                            />
                            <span className="flex items-center ltr:pr-4 rtl:pl-4">
                                <button
                                    type="button"
                                    className="btn btn-link text-gray-300 dark:text-gray-700 la la-eye text-xl leading-none"
                                    onClick={e => setShowNewPassword(!IsShowNewPassword)}
                                ></button>
                            </span>
                        </label>
                    </div>
                    <div className="mb-5">
                        <label className="label block mb-2" htmlFor="password">ยืนยันรหัสผ่านใหม่</label>
                        <label className="form-control-addon-within">
                            <input
                                type={IsShowConfirmPassword ? "text" : "password"}
                                className="form-control border-none bg-yellow-100"
                                placeholder="ยืนยันรหัสผ่านใหม่"
                                onChange={e => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                autoComplete="off"
                            />
                            <span className="flex items-center ltr:pr-4 rtl:pl-4">
                                <button
                                    type="button"
                                    className="btn btn-link text-gray-300 dark:text-gray-700 la la-eye text-xl leading-none"
                                    onClick={e => setShowConfirmPassword(!IsShowConfirmPassword)}
                                ></button>
                            </span>
                        </label>
                        {!passwordValid && <small className="block mt-2 invalid-feedback">รหัสผ่านใหม่ ไม่ตรงกัน</small>}
                    </div>
                    {
                        !isLoading &&
                        <div className="flex flex-col items-center">
                            <button
                                className="btn bg-primary ltr:ml-auto rtl:mr-auto uppercase"
                                type="submit"
                                disabled={!formValid}
                            >Change Password</button>
                        </div>
                    }
                    {
                        isLoading &&
                        < div className="flex justify-center">
                            <img src={loading} alt="loading..." />
                        </div>
                    }
                </form>
            </div >
        </div >
    );
}

export default ChangePassword;
