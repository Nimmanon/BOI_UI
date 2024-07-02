const Textarea = (props) => {
  const {
    label,
    name,
    type,
    register,
    required,
    error,
    pattern,
    min,
    max,
    minLength,
    maxLength,
    row,
    onChange,
    readonly,
    showErrMsg = true,
  } = props;

  //console.log(error);

  return (
    <>
      <label>&nbsp;{`${label} ${required ? "*" : ""}`}</label>
      <textarea
        {...register(name, {
          required,
          pattern:
            pattern == "email"
              ? /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              : pattern == "phone"
              ? /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
              : "",
          minLength: minLength,
          maxLength: maxLength,
          min: min,
          max: max,
        })}
        type={type}
        className={`form-control  ${error ? "is-invalid" : ""} ${
          readonly ? "readOnly" : "bg-yellow-100"
        }`}
        //placeholder={`Input ` + label}
        rows={row}
        onChange={onChange}
      />
      {showErrMsg && (
        <>
          {error?.type == "required" && (
            <small className="block mt-2 invalid-feedback">
              {label} is required
            </small>
          )}
          {error?.type == "pattern" && (
            <small className="block mt-2 invalid-feedback">
              {label} pattern incorrect
            </small>
          )}
          {error?.type == "minLength" && (
            <small className="block mt-2 invalid-feedback">
              {label} mininum {minLength} digit
            </small>
          )}
          {error?.type == "maxLength" && (
            <small className="block mt-2 invalid-feedback">
              {label} maxinum {maxLength} digit
            </small>
          )}
          {error?.type == "min" && (
            <small className="block mt-2 invalid-feedback">
              {label} equal to or greater than {min}{" "}
            </small>
          )}
          {error?.type == "max" && (
            <small className="block mt-2 invalid-feedback">
              {label} equal to or less than {max}
            </small>
          )}
        </>
      )}
    </>
  );
};

export default Textarea;
