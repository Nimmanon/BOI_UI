import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "../../components/FormInput";

const PasswordChange = ({ data, action, msgConfirm }) => {
    const [IsShowPassword, setShowPassword] = useState(false);

    const { formState: { errors }, register, reset, setValue } = useFormContext({
        defaultValues: {
            Id: 0,
            Password: "",
            ConfirmPassword: "",
        }
    });

    useEffect(() => {
        if (action === "add") {
            reset({
                Id: 0,
                Password: "",
                ConfirmPassword: "",
            });
        }
    }, []);

    useEffect(() => {
        //console.log(data);
        setValue("Id", data?.Id);
        setValue("Name", data?.Name);
        setValue("Username", data?.Username);
        setValue("Password", "");
        setValue("ConfirmPassword", "");
    }, [data]);

    const showPassword = () => {
        setShowPassword(!IsShowPassword);
    }

    return (
        <>
            <div>
                <FormInput
                    name="OldPassword"
                    label="Old Password"
                    register={register}
                    type={`${IsShowPassword ? 'text' : 'password'}`}
                    required
                    error={errors.OldPassword}
                />
            </div>
            <div className="mt-2">
                <FormInput
                    name="Password"
                    label="New Password"
                    register={register}
                    type={`${IsShowPassword ? 'text' : 'password'}`}
                    required
                    error={errors.Password}
                />
            </div>
            <div className="mt-2">
                <FormInput
                    name="ConfirmPassword"
                    label="Confirm New Password"
                    register={register}
                    type={`${IsShowPassword ? 'text' : 'password'}`}
                    required
                    error={errors.ConfirmPassword || msgConfirm !== ""}
                />
            </div>
            {console.log(msgConfirm)}
            {
                msgConfirm !== '' &&
                <div className="mt-2">
                    <label style={{ "color": "red" }}>{msgConfirm}</label>
                </div>
            }
            <div className="mt-2">
                <label className={`custom-checkbox`}>
                    <input type='checkbox' onClick={showPassword} />
                    <span></span>
                    <span>Show password</span>
                </label>
            </div>

        </>
    )
}

export default PasswordChange
