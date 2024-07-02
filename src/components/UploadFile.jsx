import { useState, useEffect, useRef } from "react";
import APIService from "../services/APIService";

const UploadFile = (props) => {
    const {
        name,
        label,
        description,
        register,
        required,
        data,
        multiple = false,
        error,
        onFileChange,
        folderName,
    } = props;

    const [dataList, setDataList] = useState([]);
    const [errorType, setErrorType] = useState(false);
    const effectRan = useRef(false);

    //Constructor
    function File(fileBits, fileName, options) {
        fileBits = fileBits;
        fileName = fileName;
        options = options | undefined
    }

    useEffect(() => {
        //console.log('Upload data => ', name, data);
        if (data === undefined || data === null || data?.length === 0) {
            setDataList(null);
            return;
        }

        if (data?.src !== undefined || data?.action === "add" || data[0]?.src !== undefined || data[0]?.action === "add") return;

        if (multiple) {
            //multiple file                    
            data?.map((item) => {
                var credentials = { FolderName: folderName, FileName: item?.FileName };
                APIService.Post('Upload/GetFile', credentials)
                    .then(res => {
                        if (res.status !== 200) return;

                        if (res.data !== undefined) {
                            const file = new File([res.data?.Data], res.data?.Name, { type: res.data?.Type });
                            file.name = res.data?.Name;
                            file.src = "data:" + res.data?.Type + ";base64," + res.data?.Data;
                            file.action = "edit";

                            setDataList((prevItem) => {
                                return prevItem === null ? [file] : [file, ...prevItem];
                            });
                        }
                    })
            });
        } else {
            //single file
            var credentials = { FolderName: folderName, FileName: data?.FileName };
            APIService.Post('Upload/GetFile', credentials)
                .then(res => {
                    if (res.status !== 200) return;

                    if (res.data !== undefined) {
                        var file = new File([res.data?.Data], res.data?.Name, { type: res.data?.Type });
                        file.name = res.data?.Name;
                        file.src = "data:" + res.data?.Type + ";base64," + res.data?.Data;
                        file.action = "edit";

                        setDataList([]);
                        setDataList((prevItem) => {
                            return prevItem === null ? [file] : [file, ...prevItem];
                        });
                    }
                })
        }
    }, [data]);

    const handleFileChange = (e) => {
        if (e === undefined || e === null) return;
        let name = e?.target?.name;
        let file = e.target.files[0];
        file.src = URL.createObjectURL(file);
        file.action = "add";

        //check format 
        if (file === undefined) return;
        if (!["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(file?.type)) {
            setErrorType(true);
            return;
        }

        uploadFile(file);
    };

    const uploadFile = (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folderName", folderName);

        APIService.Post('Upload/UploadFile', formData)
            .then(res => {
                if (res.status !== 200) return;

                let newFile = file;
                if (file.name !== res.data) {
                    //change file name if exits
                    const fd = new FormData();
                    fd.append("file", file, res.data);

                    newFile = fd.get("file");
                    newFile.src = URL.createObjectURL(newFile);
                    newFile.action = "add";
                }

                setDataList((prevItem) => {
                    return prevItem === null ? [newFile] : [newFile, ...prevItem];
                });
            })
            .catch(err => console.log(err))
    }

    const handlePreviewClick = (file) => {
        if (file === undefined || file === null) return;

        if (file?.action === "edit") {
            const newWindow = window.open();
            const imageHtml = `<html style="height: 100%;">
                                    <head>
                                        <meta name="viewport" content="width=device-width, minimum-scale=0.1"></meta>
                                    </head>
                                    <body style="margin: 0px; background: #0e0e0e; height: 100%">
                                        <img src="${file?.src}" 
                                            style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;"
                                        />
                                    </body>
                                </html>`;
            newWindow.document.title = file?.name;
            newWindow.document.write(imageHtml);
        } else {
            window.open(file?.src, "_blank");
        }
    };

    const removeFileClick = (e, index) => {
        let [item] = dataList.filter((x, i) => i === index);
        let items = dataList.filter((item, i) => i !== index);
        setDataList(items);
    }

    useEffect(() => {
        //console.log('dataList', dataList);
        let value = (dataList === null) ? null : multiple ? dataList : dataList[0];
        onFileChange(value, name, multiple);
    }, [dataList]);

    return (
        <>
            <div>
                <label>&nbsp;{`${label} ${required ? '*' : ''}`}</label>
                {(description !== undefined && description !== null && description !== "") && <small className="mt-2"> ({description}) </small>}
            </div>
            {
                (multiple || (!multiple && (dataList?.length === 0 || dataList === null))) &&
                <div>
                    <label className="custom-file-upload">
                        <input
                            type="file"
                            name={name}
                            className={`form-control multiple`}
                            style={{ display: 'none' }}
                            {...register((name), {
                                required
                            })}
                            onChange={handleFileChange}
                        />
                        <i className="fa fa-cloud-upload" /> Browse Files
                    </label>
                    {multiple && <label> {dataList?.length} files selected.</label>}
                </div>
            }
            {error?.type == 'required' && <small className="block mt-2 invalid-feedback">{label} is required</small>}
            {errorType && <small className="block mt-2 invalid-feedback">เฉพาะไฟล์ jpg, jpeg, png, gif, pdf เท่านั้น</small>}


            {/* display image */}
            <div className="grid lg:grid-cols-3 gap-3 mt-3">
                {
                    dataList?.map((item, index) =>
                        <div className="flex flex-col lg:col-span-1 xl:col-span-1" key={index}>
                            <div className="image">
                                <div className="aspect-w-4 aspect-h-3" style={{ overflow: 'hidden' }}>
                                    <img
                                        src={item.src}
                                        style={{ cursor: 'pointer' }}
                                        onClick={e => handlePreviewClick(item)}
                                    />
                                    <button type="button"
                                        className="btn btn_danger btn-icon uppercase absolute top-0 right-0 rtl:left-0 mt-1 rtl:ml-1 mr-1 ml-1 cursor-pointer"
                                        style={{ padding: '1px', fontSize: '1rem', width: '1.25rem', height: '1.25rem', float: 'right' }}
                                    >
                                        <span className='la la-remove' title="remove" onClick={e => removeFileClick(e, index)} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default UploadFile;
