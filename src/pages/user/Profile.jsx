import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from "react-router-dom";
import Modal from "../../components/Modal";

import APIService from "../../services/APIService";
import { logoutUser } from "../../store/reducers/auth";
import ProfileChange from "./ProfileChange";
import PasswordChange from "./PasswordChange";

const Profile = () => {
    //modal
    const [show, setShow] = useState(false);
    const [content, setContent] = useState({ Id: 0, Name: '' });
    const [action, setAction] = useState('');
    const [activity, setActivity] = useState('');

    //from
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [group, setGroup] = useState();    
    const [groupName, setGroupName] = useState(""); 
    const [errConfirm, setConfirm] = useState("");
    const [textError, setTextError] = useState("");

    //system
    const [auth, setAuth] = useState(useSelector((state) => state.auth));
    const [userId, setUserId] = useState();
    const [usergroup, setUserGroup] = useState();

    const [dataselected, setDataSelected] = useState();

    const effectRan = useRef(false);
    const dispatch = useDispatch();

    const setInitial = async () => {
        if (auth === undefined) return;

        setUserId(atob(auth.Id));
        let group = JSON.parse(auth.Group);   
        setGroup(group?.Name?.toLowerCase());
        getData(atob(auth.Id));
    }

    useEffect(() => {
        if (effectRan.current == false) {
            setInitial();
            return () => effectRan.current = true
        }
    }, []);

    const getData = (userid) => {
        APIService.getById('Auth/GetById', userid)
            .then(res => {
                setDataSelected(...res.data);
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (dataselected === undefined) return;
        console.log(dataselected);
        setFirstName(dataselected?.FirstName);
        setLastName(dataselected?.LastName === null ? "" : dataselected?.LastName);
        setEmail(dataselected?.Email === null ? "" : dataselected?.Email);
        setUsername(dataselected?.Username);
        setGroup(dataselected?.Group);
        setGroupName(dataselected?.Group.Name);
    }, [dataselected]);

    const onChangeProfileClick = () => {
        setAction('edit');
        setActivity('cpf');
        setShow(true);
    }

    const onChangePasswordClick = () => {
        setAction('edit');
        setActivity('cpw');
        setShow(true);
    }

    const updateData = (newItem) => {
        newItem.Group = group;
        newItem.InputBy = userId;

        let method = '';
        if (activity === 'cpf') {
            method = 'Put';
        } else {
            method = 'Change';
            let valid = newItem.Password === newItem.ConfirmPassword ? '' : 'Password do not match';
            setConfirm(valid)
            if (valid !== '') return;
        }

        APIService.Put('Auth/' + method, newItem)
            .then(res => {                
                if (res.status !== 200) return;
                if (method === 'Change') {
                    dispatch(logoutUser());
                    Navigate('/');
                }else{
                    if(username.toLocaleUpperCase() !== res?.data?.Username.toLocaleUpperCase()){
                        dispatch(logoutUser());
                        Navigate('/');
                    }
                }
                setFirstName(res?.data?.FirstName);
                setLastName(res?.data?.LastName);
                setEmail(res?.data?.Email);
                setUsername(res?.data?.Username);
               
                setShow(false);
                setConfirm('');
            })
            .catch(err => {
                console.log(err);
                if (err?.response?.status === 400) {
                    setTextError(err?.response?.data);          
                  };
            })
    }

    const handledUpdateChange = (data) => {
        updateData(data);
    }

    const handledCancelClick = () => {
        setShow(false);
        setAction('');
        setActivity('');
    }

    return (
        <>
            <div className="grid xl:grid-cols-4 lg:grid-cols-4 gap-3 mt-3">
                <div className="flex flex-col xl:col-span-2 lg:col-span-2">
                    <div className='card p-3 gap-2'>
                        <div>
                            <h2>Profile</h2>
                        </div>
                        <div className="input-group mt-1">
                            <div className="input-addon input-addon-prepend input-group-item w-32">FirstName</div>
                            <input
                                name="FirstName"
                                type="text"
                                className="form-control input-group-item readOnly"
                                readOnly
                                value={firstName}
                            />
                        </div>
                        <div className="input-group mt-1">
                            <div className="input-addon input-addon-prepend input-group-item w-32">LastName</div>
                            <input
                                name="Name"
                                type="text"
                                className="form-control input-group-item readOnly"
                                readOnly
                                value={lastName}
                            />
                        </div>
                        <div className="input-group mt-1">
                            <div className="input-addon input-addon-prepend input-group-item w-32">Email</div>
                            <input
                                name="Name"
                                type="text"
                                className="form-control input-group-item readOnly"
                                readOnly
                                value={email}
                            />
                        </div>
                        <div className="input-group mt-1">
                            <div className="input-addon input-addon-prepend input-group-item w-32">Username</div>
                            <input
                                name="Username"
                                type="text"
                                className="form-control input-group-item readOnly"
                                readOnly
                                value={username}
                            />
                        </div>
                        <div className="input-group mt-1">
                            <div className="input-addon input-addon-prepend input-group-item w-32">Group</div>
                            <input
                                name="Group"
                                type="text"
                                className="form-control input-group-item readOnly"
                                readOnly
                                value={groupName}
                            />
                        </div>
                        <div className='mt-1'>
                            <button
                                type="submit"
                                className="btn btn_primary uppercase"
                                onClick={onChangeProfileClick}
                            >
                                Change Profile</button>
                            <button
                                type="submit"
                                className="btn btn_info uppercase ml-2"
                                onClick={onChangePasswordClick}
                            >
                                Change Password</button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={show}
                onCancelClick={handledCancelClick}
                //onSaveChange={handledSaveChange}
                onUpdateChange={handledUpdateChange}
                //onDeleteItem={handledDeleteItem}
                content={content}
                action={action}
                name={activity === 'cpf' ? 'Profile' : 'Password'}
                size={'xl'}
                form={
                    activity === 'cpf' ?
                        <ProfileChange data={dataselected} action={action} textError={textError}/> :
                        <PasswordChange data={dataselected} action={action} msgConfirm={errConfirm} />
                }
            />
            <div className={`${show ? 'overlay active' : ''}`}></div>
        </>
    );
}

export default Profile