import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { logoutUser } from "../store/reducers/auth";
import APIService from "./APIService";

const Verify = ({ children }) => {

    const [verified, setVerified] = useState();
    const [requestor, setRequestor] = useState();

    const effectRan = useRef(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (children === undefined) return;
        setRequestor(children?.type?.name.toLowerCase());
    }, [children]);

    useEffect(() => {
        if (requestor === undefined) return;
        getVerify();
    }, [requestor]);

    const getVerify = () => {
        //console.log("getVerify -> ", requestor, " time = ", new Date().toLocaleDateString(), " : ", new Date().toLocaleTimeString());
        if (atob(localStorage.getItem('Token')) !== undefined) {
            //console.log("Token => ",atob(localStorage.getItem('Token')));
            APIService.getByName("Auth/Verify", atob(localStorage.getItem('Token')))
                .then((res) => {
                    if (res.data !== "") {
                        //console.log('The token access success', res.data);
                        //console.log("requestor : ", requestor, ", time :", new Date().toLocaleDateString(), new Date().toLocaleTimeString(), ", status : Success");
                        setVerified(true);

                        //update token
                        localStorage.setItem('Token', btoa(res.data));
                    } else {
                        //console.log('The token is expired');
                        setVerified(false);
                        logout();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    if (err.status == 401) {
                        //console.log('Autherize fail');
                        setVerified(false);
                        logout();
                    }
                });
        } else {
            logout();
        }
    }

    const logout = () => {
        dispatch(logoutUser());
        navigate('/');
    }

    const render = () => {
        if (verified === undefined) return;
        return verified ? children : <Navigate to="/login" />;
    }

    return render()
}
export default Verify;