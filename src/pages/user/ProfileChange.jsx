import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "../../components/FormInput";

const ProfileChange = ({ data, action, textError }) => {
    //const effectRan = useRef(false);

    const { formState: { errors }, register, reset, setValue } = useFormContext({
        defaultValues: {
            Id: 0,
            FirstName: "",
            LastName: "",
            Email: "",
        }
    });

    useEffect(() => {
        //console.log('Profile Change')
        if (action === "add") {
            reset({
                Id: 0,
                FirstName: "",
                LastName: "",
                Email: "",
            });
        }
    }, []);

    useEffect(() => {
        //console.log(data);
        setValue("Id", data?.Id);
        setValue("FirstName", data?.FirstName);
        setValue("LastName", data?.LastName);
        setValue("Email", data?.Email);
    }, [data]);

    return (
        <>
            <div>
                <FormInput
                    name="FirstName"
                    label="FirstName"
                    register={register}
                    type="text"
                    required
                    error={errors.FirstName}
                />
            </div>
            <div className="mt-2">
                <FormInput
                    name="LastName"
                    label="LastName"
                    register={register}
                    type="text"
                    required
                    error={errors.LastName}
                />
            </div>
            <div className="mt-2">
                <FormInput
                    name="Email"
                    label="Email"
                    register={register}
                    type="text"
                    required
                    error={errors.Email}
                />
                <small className="block mt-2 invalid-feedback">{textError}</small>
            </div>
        </>
    )
}

export default ProfileChange
