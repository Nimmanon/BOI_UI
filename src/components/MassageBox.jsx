import { useForm } from "react-hook-form";
const MassageBox = ({
    name,
    size,
    show,
    action,
    content,
    form,
    showTitle = true,
    Massage,
    handleCancelClick,
    onSaveClick,
    onAddClick,
    onEditClick,
    onDeleteClick,
    onVoidClick,
    onConfrimClick,
    onAcceptClick,
    onCreateClick
}) => {

    const methods = useForm();

    const saveSubmit = () => { onSaveClick(); }
    const addSubmit = () => { onAddClick(); }
    const editSubmit = () => { onEditClick(); }
    const deleteSubmit = () => { onDeleteClick(); }
    const voidSubmit = () => { onVoidClick(); }
    const confirmSubmit = () => { onConfrimClick(); }
    const acceptSubmit = () => { onAcceptClick(); }
    const createSubmit = () => { onCreateClick(); }

    return (
        <>
            <div className={`modal animate__animated ${show ? 'animate__fadeInDown active' : 'animate__fadeOutUp'} pt-3`}>
                <div className={`modal-dialog max-w-${size}`}>
                    <div className="modal-content">
                        {
                            showTitle && <div className="modal-header">
                                <h3 className="modal-title uppercase">
                                    {(action === 'add' || action === 'import') && <label>{action} new {name} data</label>}
                                    {(action === 'delete' || action === 'edit') && <label>Confirm {action} data</label>}
                                    {(action === 'confirm' || action === 'accept' || action === 'create') && <label>Confirm data</label>}
                                    {(action === 'warning') && <label>{action} !!!</label>}
                                </h3>
                                <button onClick={handleCancelClick} className="close la la-times" />
                            </div>
                        }
                        <div className="modal-body p-3">
                            {
                            (action === 'delete' || action === 'void') && 
                            <div>
                                <h3>
                                    <label>Are you sure want to {action} this item?</label>
                                </h3>
                                <br />
                                {content?.Name !== undefined && content?.Name !== "" && <p><label>{content?.Name}</label></p>}
                                {content?.Description !== undefined && content?.Description !== "" && <p><label>{content?.Description}</label></p>}
                                {content?.Remark != undefined && content?.Remark !== "" && <p><label>{content?.Remark}</label></p>}
                            </div>}
                            {(action === 'confirm' || action === 'accept' || action === 'create') && <div>
                                <h3>
                                    <label>{Massage}</label>
                                </h3>
                                <br />
                                {content?.Name !== undefined && content?.Name !== "" && <p><label>{content?.Name}</label></p>}
                                {content?.Description !== undefined && content?.Description !== "" && <p><label>{content?.Description}</label></p>}
                                {content?.Remark != undefined && content?.Remark !== "" && <p><label>{content?.Remark}</label></p>}
                            </div>}
                            {(action === 'add' || action === 'new' || action === 'edit' || action === "import") &&
                                form
                            }
                            {(action === 'warning') &&
                                <div>                                   
                                    {content?.Name !== undefined && content?.Name !== "" && <p><label>{content?.Name}</label></p>}
                                    {content?.Description !== undefined && content?.Description !== "" && <p><label>{content?.Description}</label></p>}
                                    <br />
                                    <h4>
                                        <label>{Massage}</label>
                                    </h4>                                   
                                </div>
                            }
                        </div>
                        <div className="modal-footer">
                            <div className="flex ml-auto mr-auto">
                                {action === 'new' &&
                                    <button
                                        type="submit"
                                        className="btn btn_outlined btn_primary uppercase"
                                        onClick={saveSubmit}
                                    >Save Change</button>
                                }
                                {action === 'add' &&
                                    <button
                                        type="submit"
                                        className="btn btn_outlined btn_primary uppercase"
                                        onClick={addSubmit}
                                    >Add Change</button>
                                }
                                {action === 'edit' &&
                                    <button
                                        type="submit"
                                        className='btn btn_info ml-2 mr-2 uppercase'
                                        onClick={editSubmit}
                                    >Update Change</button>
                                }
                                {action === 'delete' &&
                                    <button
                                        type="submit"
                                        className='btn btn_danger ml-2 mr-2 uppercase'
                                        onClick={deleteSubmit}
                                    >Confirm Delete</button>
                                }
                                {action === 'void' &&
                                    <button
                                        type="submit"
                                        className='btn btn_danger ml-2 mr-2 uppercase'
                                        onClick={voidSubmit}
                                    >Confirm Void</button>
                                }
                                {action === 'confirm' &&
                                    <button
                                        type="submit"
                                        className='btn btn_danger ml-2 mr-2 uppercase'
                                        onClick={confirmSubmit}
                                    >Confirm</button>
                                }
                                {action === 'accept' &&
                                    <button
                                        type="submit"
                                        className='btn btn_danger ml-2 mr-2 uppercase'
                                        onClick={acceptSubmit}
                                    >Accept</button>
                                }
                                {action === 'create' &&
                                    <button
                                        type="submit"
                                        className='btn btn_danger ml-2 mr-2 uppercase'
                                        onClick={createSubmit}
                                    >Create</button>
                                }
                                {(action === 'confirm' || action === 'accept' || action === 'create') &&
                                    <button
                                        type="submit"
                                        className='btn btn_info ml-2 mr-2 uppercase'
                                        onClick={handleCancelClick}
                                    >Back</button>
                                }
                                {action !== 'confirm' && action !== 'accept' && action !== 'create' &&
                                    <button
                                        type="button"
                                        className="btn btn_outlined btn_secondary ml-2 mr-2 uppercase"
                                        onClick={handleCancelClick}
                                    >Close</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default MassageBox;