import { useForm } from "react-hook-form";
const ModalChild = ({
  name,
  size,
  show,
  action,
  content,
  form,
  showTitle = true,
  showFooter = true,
  Massage,
  title = "",
  handleCancelClick,
  onSaveClick,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onConfrimClick,
}) => {
  const methods = useForm();

  //console.log(action);
  const saveSubmit = () => {
    onSaveClick();
  };
  const addSubmit = () => {
    onAddClick();
  };
  const editSubmit = () => {
    onEditClick();
  };
  const deleteSubmit = () => {
    onDeleteClick();
  };
  const confirmSubmit = () => {
    onConfrimClick();
  };

  return (
    <>
      {/* <form onSubmit={onSubmit} autoComplete="off"> */}
      {/* animate__animated animate__fadeInDow */}
      <div
        className={`modal animate__animated ${
          show ? "animate__fadeInDown active" : "animate__fadeOutUp"
        }`}
      >
        <div className={`modal-dialog max-w-${size}`}>
          <div className="modal-content">
            <div className="modal-header">
              {showTitle && (
                <h3 className="modal-title uppercase">
                  {(action === "add" || action === "import") && (
                    <label>
                      {action} new {name} data
                    </label>
                  )}
                  {(action === "delete" ||
                    action === "edit" ||
                    action === "void") && <label>Confirm {action} data</label>}
                  {(action === "view" || action === "print") && (
                    <label>{action} data</label>
                  )}
                  {action === "page" && <label>{title}</label>}
                  {/* {(action === 'void') && <label>{title}</label>} */}
                </h3>
              )}
              <button
                onClick={handleCancelClick}
                className="close la la-times"
              />
            </div>

            {/* <div className="modal-body p-3"> */}
            <div className={`modal-body min-h-body-${size} pl-1 pr-1`}>
              {action === "delete" && (
                <div>
                  <h3>
                    <label>Are you sure want to delete this item?</label>
                  </h3>
                  <br />
                  {content?.Name !== undefined && content?.Name !== "" && (
                    <p>
                      <label>{content?.Name}</label>
                    </p>
                  )}
                  {content?.Description !== undefined &&
                    content?.Description !== "" && (
                      <p>
                        <label>{content?.Description}</label>
                      </p>
                    )}
                  {content?.Remark !== undefined && content?.Remark !== "" && (
                    <p>
                      <label>{content?.Remark}</label>
                    </p>
                  )}
                </div>
              )}
              {action === "confirm" && (
                <div>
                  <h3>
                    <label>{Massage}</label>
                  </h3>
                  <br />
                  {content?.Name !== undefined && content?.Name !== "" && (
                    <p>
                      <label>{content?.Name}</label>
                    </p>
                  )}
                  {content?.Description !== undefined &&
                    content?.Description !== "" && (
                      <p>
                        <label>{content?.Description}</label>
                      </p>
                    )}
                  {content?.Remark !== undefined && content?.Remark !== "" && (
                    <p>
                      <label>{content?.Remark}</label>
                    </p>
                  )}
                </div>
              )}
              {(action === "add" ||
                action === "new" ||
                action === "edit" ||
                action === "import" ||
                action === "view" ||
                action === "print" ||
                action === "void" ||
                action === "page") &&
                form}
            </div>
            {showFooter && (
              <div className="modal-footer">
                <div className="flex ml-auto mr-auto">
                  {action === "new" && (
                    <button
                      type="submit"
                      className="btn btn_outlined btn_primary uppercase"
                      onClick={saveSubmit}
                    >
                      Save Change
                    </button>
                  )}
                  {action === "add" && (
                    <button
                      type="submit"
                      className="btn btn_outlined btn_primary uppercase"
                      onClick={addSubmit}
                    >
                      Add Change
                    </button>
                  )}
                  {action === "edit" && (
                    <button
                      type="submit"
                      className="btn btn_info ml-2 mr-2 uppercase"
                      onClick={editSubmit}
                    >
                      Update Change
                    </button>
                  )}
                  {action === "delete" && (
                    <button
                      type="submit"
                      className="btn btn_danger ml-2 mr-2 uppercase"
                      onClick={deleteSubmit}
                    >
                      Confirm Delete
                    </button>
                  )}
                  {action === "confirm" && (
                    <button
                      type="submit"
                      className="btn btn_danger ml-2 mr-2 uppercase"
                      onClick={confirmSubmit}
                    >
                      Confirm Delete
                    </button>
                  )}
                  {action === "void" && (
                    <button
                      type="submit"
                      className="btn btn_danger ml-2 mr-2 uppercase"
                      onClick={confirmSubmit}
                    >
                      Confirm Void
                    </button>
                  )}
                  {action === "confirm" ||
                    (action === "void" && (
                      <button
                        type="submit"
                        className="btn btn_info ml-2 mr-2 uppercase"
                        onClick={handleCancelClick}
                      >
                        Back
                      </button>
                    ))}
                  {action !== "confirm" && (
                    <button
                      type="button"
                      className="btn btn_outlined btn_secondary ml-2 mr-2 uppercase"
                      onClick={handleCancelClick}
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* </form> */}
    </>
  );
};
export default ModalChild;
