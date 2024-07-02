//checkbox , radio
//const CustomInput = ({ label, name, type, register, required, errors,value }) => (
const CustomInput = (props) => {

    const {
        label,
        name,
        type,
        register,
        required,
        error,
        value
    } = props;

    //console.log(error);

    return (
        <>
            <label className={`custom-${type} ${error ? 'is-invalid' : ''}`}>
            {/* <label className={`custom-${type}`}> */}
                <input
                    type={type}
                    {...register(name, { required })}
                    value={value}
                />
                <span></span>
                <span>{label}</span>
            </label>
            {error?.type == 'required' && <small className="block mt-2 invalid-feedback">{label} is required</small>}
        </>
    )
};

export default CustomInput;