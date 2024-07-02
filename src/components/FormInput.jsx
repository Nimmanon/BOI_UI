import { read } from "xlsx";

const FormInput = (props) => {
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
    onChange,
    placeholder,
    readonly = false,
    showErrMsg = true,
    align = "left",
    arrow = true,
    value
  } = props;

  return (
    <div>
      {label && <label>{`${label} ${required ? "*" : ""}`}</label>}
      <input
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
        min={min}
        value={value}
        type={type}
        className={`form-control ${error ? "is-invalid" : ""} 
        ${readonly ? "readOnly" : "bg-yellow-100"} 
        ${
          align === "right"
            ? "text-right"
            : align === "center"
            ? "text-center"
            : ""
        }
        ${!arrow ? "no-arrow" : ""}`}
        placeholder={placeholder === undefined ? `Input ` + label : placeholder}
        onChange={onChange}
        readOnly={readonly}
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
    </div>
  );
};

export default FormInput;
