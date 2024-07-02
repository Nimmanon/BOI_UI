import { useState, useEffect } from "react";

const FormFile = (props) => {
    const {
        label,
        description,
        name,
        register,
        required,
        error,
        multiple = false,
        data,
        onFileChange,
        onPreview,
        maxSize = 2 //2MB
    } = props;


    const [action, setAction] = useState();
    const [fileId, setFileId] = useState(0);
    const [file, setFileSelected] = useState();
    const [fileList, setFileList] = useState([]);

    const handleFileChange = (e) => {
        setAction('add');
        //if (e === undefined) return;
        //console.log('handleFileChange', e);
        let name = e?.target?.name;
        let [file] = e.target.files;

        if (multiple) {
            setFileList((prevItem) => {
                return [...prevItem, file];
            });
        } else {
            setFileSelected(file);
        }

        onFileChange('add', name, file);

        //clear Error
        if (error !== undefined) error.type = "";
    };

    const removeFileClick = (e, name, index) => {
        //console.log('removeFileClick =>', action, index);
        //if (e === undefined) return;

        if (multiple) {
            let [item] = fileList.filter((item, i) => i === index);
            item.IsActive = false;

            //remove file in array           
            let items = fileList.filter((item, i) => i !== index);
            setFileList(items);
        } else {
            onFileChange(action, name, null);
            setFileSelected(null);
        }

        //clear Error       
        if (error !== undefined) error.type = "";
    }

    useEffect(() => {
        //console.log('FileChange =>', action, data);
        if (data === undefined || data === null) return;

        if (action === 'add') {
            if (multiple) {
                setFileList(data);
            } else {
                //onFileChange('add', name, file);
                setFileSelected(data);
            }
        } else {
            if (multiple) {
                data.forEach(item => { item.name = item?.FileName });
                setFileList(data);
            } else {
                let typeList = ["jpg", "jpeg", "png", "gif"];
                let fileName = data?.FileName;
                let fileType = data?.FileName?.split(".")[1];
                let isImage = typeList.includes(fileType);

                let file = data;
                file.name = data?.FileName;
                file.type = (isImage === true) ? ("image/" + fileType) : ("document/" + fileType);

                onFileChange('edit', name, file);
                setFileSelected(file);
            }
        }

        setAction('');
    }, [data]);

    const handlePreview = async (e) => {
        if (e?.length === 0) return;
        onPreview(e);
    }

    return (
        <>
            <div>
                <label>&nbsp;{`${label} ${required ? '*' : ''}`}</label>
                {(description !== undefined && description !== null && description !== "") && <small className="mt-2"> ({description}) </small>}
            </div>
            <div className={`${multiple ? '' : 'form-upload'}`}>
                <label className="custom-file-upload">
                    <input type="file" style={{ display: 'none' }}
                        {...register(name,
                            {
                                required,
                                // validate: {
                                //     lessThan10MB: (files) => files[0]?.size < 1000000 || "Max 1MB",
                                //     acceptedFormats: (files) =>
                                //       ["image/jpeg", "image/png", "image/gif"].includes(files[0]?.type) ||
                                //       "Only PNG, JPEG e GIF",
                                //   },
                            })
                        }
                        accept="image/*"
                        name={name}
                        className={`form-control ${multiple ? 'multiple' : error?.type == 'required' ? 'is-invalid' : ''}`}
                        onChange={e => handleFileChange(e)}
                        onClick={e => setAction('add')}
                    />
                    <i className="fa fa-cloud-upload" /> {multiple ? 'เรียกดูไฟล์' : 'เลือกไฟล์'}
                </label>
                {multiple && <label> {fileList?.filter(x => x.IsActive !== false).length} files selected.</label>}
                {
                    !multiple &&
                    <label className="mt-2 p-2 cursor-pointer label-on-hover" onClick={e => handlePreview(file)}>{file?.name}</label>
                }
                {
                    (!multiple && file !== null && file !== undefined) &&
                    <button /*className="btn btn_sm btn_outline btn_danger"*/ style={{ padding: '1px', float: 'right' }}>
                        <i className="la la-remove text-red-500 cursor-pointer label-on-hover" style={{ fontSize: '19px' }} title="remove" onClick={e => removeFileClick(e, name, 0)} />
                    </button>
                }

                {
                    multiple &&
                    <div /*className="form-upload mt-2"*/>
                        {
                            fileList?.filter(x => x.IsActive !== false)?.map((item, index) =>
                                <div className="badge badge_outlined badge_secondary mt-2 ml-2 cursor-pointer" style={{ fontSize: '14px' }} key={index}>
                                    <label className="cursor-pointer label-on-hover" onClick={e => handlePreview(item)}>{item?.name}</label>
                                    <i className="la la-remove text-red-500 ml-3 cursor-pointer" style={{ fontSize: '14px' }} title="remove" onClick={e => removeFileClick(e, name, index)} />
                                </div>

                                // <div key={index} className="form-upload-multiple mt-1">
                                //     <div>
                                //         <button /*className="btn btn_sm btn_danger"*/ style={{ padding: '1px', float: 'right' }}>
                                //             <i className="la la-remove text-red-500 cursor-pointer" title="remove" onClick={e => removeFileClick(e, name, index)} />
                                //         </button>
                                //         <label className="cursor-pointer mt-2 p-2 label-on-hover" onClick={e => handlePreview(item)}>{item?.name}</label>                                       
                                //     </div>                                   
                                // </div>
                            )
                        }
                    </div>
                }
            </div>
            {error?.type == 'required' && <small className="block mt-2 invalid-feedback">{label} is required.</small>}
            {error?.type == 'size' && <small className="block mt-2 invalid-feedback">{label} is size more than {maxSize}MB.</small>}
            {error?.type == 'format' && <small className="block mt-2 invalid-feedback">เฉพาะไฟล์ jpg, jpeg, png, gif เท่านั้น</small>}
        </>
    )
};

export default FormFile;