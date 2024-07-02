import { useForm, FormProvider } from "react-hook-form";
const Modal = ({
    name,
    size,
    show,
    action,
    content,
    form,
    onCancelClick,
    onSaveChange,
    onUpdateChange,
    onDeleteItem,
    showTitle = true,
    // handleCancelClick,
    // //handleOKClick,
    // onSaveChange,
    // showTitle = true,
    //showFooter = true,
    //data
}) => {

    const methods = useForm();

    const onSubmit = (dataForm) => {
        switch (action) {
            case 'add':
                onSaveChange(dataForm);
                break;
            case 'edit':
                onUpdateChange(dataForm);
                break;
            case 'delete':
                onDeleteItem(dataForm);
                break;
            default:
        }
    }

    //console.log(action);
    // const onSubmit = (dataForm) => {
    //     onSaveChange(dataForm);
    //     //console.log('handleSaveChange model');
    // }

    return (
        <>
            {/* <form onSubmit={handleSubmit(onSubmit)} autoComplete="off"> */}
            <FormProvider {...methods} >
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    {/* animate__animated animate__fadeInDow */}
                    <div className={`modal animate__animated ${show ? 'animate__fadeInDown active' : 'animate__fadeOutUp'} pt-3`}>
                        <div className={`modal-dialog max-w-${size}`}>
                            <div className="modal-content">
                                {
                                    showTitle && <div className="modal-header">
                                        <h3 className="modal-title uppercase">
                                            {(action === 'add' || action === 'import') && <label>{action} new {name} data</label>}
                                            {(action === 'delete' || action === 'edit') && <label>Confirm {action} data</label>}
                                        </h3>
                                        <button onClick={onCancelClick} className="close la la-times" />
                                    </div>
                                }
                                <div className="modal-body p-3">
                                    {action === 'delete' && <div>
                                        <h3>
                                            <label>Are you sure want to delete this item?</label>
                                        </h3>
                                        <br />
                                        {content?.Name !== undefined && content?.Name !== "" && <p><label>{content?.Name}</label></p>}
                                        {content?.Description !== undefined && content?.Description !== "" && <p><label>{content?.Description}</label></p>}
                                        {content?.Remark != undefined && content?.Remark !== "" && <p><label>{content?.Remark}</label></p>}
                                    </div>}
                                    {(action === 'add' || action === 'edit' || action === "import") &&
                                        form
                                    }
                                </div>
                                <div className="modal-footer">
                                    <div className="flex ml-auto mr-auto">
                                        {action === 'add' &&
                                            <button
                                                type="submit"
                                                className="btn btn_outlined btn_primary uppercase"
                                            >Save Change</button>
                                        }
                                        {action === 'import' &&
                                            <button
                                                type="submit"
                                                className="btn btn_outlined btn_primary uppercase"
                                            >Import Data</button>
                                        }
                                        {action === 'edit' &&
                                            <button
                                                type="submit"
                                                className='btn btn_info ml-2 mr-2 uppercase'
                                            >Update Change</button>
                                        }
                                        {action === 'delete' &&
                                            <button
                                                type="submit"
                                                className='btn btn_danger ml-2 mr-2 uppercase'
                                            >Confirm Delete</button>
                                        }
                                        <button
                                            type="button"
                                            className="btn btn_outlined btn_secondary ml-2 mr-2 uppercase"
                                            onClick={onCancelClick}
                                        >Close</button>
                                    </div>
                                </div>
                                {/* {
                            showFooter &&
                            <div className="modal-footer">
                                <div className="flex ltr:ml-auto rtl:mr-auto">
                                    {action === 'delete' && <button
                                        onClick={handleOKClick}
                                        className='btn btn_danger ltr:ml-2 rtl:mr-2 uppercase'
                                    >{action}</button>}
                                </div>
                            </div>
                        } */}
                            </div>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </>
    );
}
export default Modal;