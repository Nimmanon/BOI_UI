import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import APIService from "../services/APIService";
import basePath from "../services/basePath";

const AttachmentFile = ({ data, action, onFileSelect }) => {
    const [fileList, setFileList] = useState([]);
    const [filePath, setFilePath] = useState(basePath.previewUrl());
    const [error, setError] = useState();

    const effectRan = useRef(false);

    const { register, formState: { errors }, reset, setValue, clearErrors } = useForm({
        defaultValues: {
        }
    });

    useEffect(() => {
        console.log("Attachment data => ", data);
        if (data === undefined || data.length === 0) return;
        let items = [];
        data?.map(d => {
            let item = {};
            item.Id = d.Id;
            item.name = d.FileName;
            let fileType = data?.FileName?.split(".")[1];
            item.type = "image/" + fileType;
            items.push(item);
        });
        setFileList(items);
    }, [data]);

    const handleFileChange = (e) => {
        //console.log('handleFileChange=>', e?.target);       

        if (e !== undefined & e !== null) {
            let name = e?.target?.name;
            let [file] = e.target.files;

            //check size > 1MB
            if (file?.size > 1000000) {
                setError({ type: 'size' })
                return;
            }

            //check format image
            if (!["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(file?.type)) {
                setError({ type: 'format' })
                return;
            }

            //setValue(name, file)
            uploadFile(file);
        }
    };

    const uploadFile = (file) => {
        //console.log('uploadFile=>', name, file);       
        const formData = new FormData();
        let filename = file.name;
        formData.append('file', file, filename);

        APIService.Post('Upload/UploadFile', formData)
            .then(res => {
                if (res.status !== 200) return;

                var new_file = { name: file.name, type: file.type };
                if (file?.name !== res.data) {
                    //var new_file = new File([file], res.data); 
                    new_file = { name: res.data, type: file.type };
                }

                setFileList((prevItem) => {
                    return [...prevItem, new_file];
                });
            })
            .catch(err => console.log(err))
    }

    const handlePreview = (file) => {
        //console.log('handlePreviewFile=>', file);
        if (file === undefined || file === null) return;

        var filepath = basePath.previewUrl() + file?.name;
        window.open(filepath, "_blank");
    };

    const removeFileClick = (e, index) => {
        let [item] = fileList.filter((item, i) => i === index);
        //console.log('removeFileClick => ', item);

        APIService.Post('Upload/RemoveFile', item)
            .then(res => {
                if (res.status !== 200) return;
                //remove file in array           
                let items = fileList.filter((item, i) => i !== index);
                setFileList(items);

                //clear Error       
                if (error !== undefined) error.type = "";

            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        onFileSelect(fileList);
    }, [fileList]);

    return (
        <>
            {
                (fileList?.length < 3 && action !== "view") &&
                <div>
                    <label className="custom-file-upload">
                        <input type="file" style={{ display: 'none' }}
                            accept="image/*"
                            name="File"
                            className={`form-control multiple ${error?.type == 'required' ? 'is-invalid' : ''}`}
                            onChange={handleFileChange}
                        />
                        <i className="fa fa-cloud-upload" /> Browse Files
                    </label>
                    <label> {fileList?.length} files selected.</label>
                </div>
            }
            {error?.type == 'size' && <small className="block mt-2 invalid-feedback">รูปภาพต้องไม่เกิน 1 MB</small>}
            {error?.type == 'format' && <small className="block mt-2 invalid-feedback">เฉพาะไฟล์ jpg, jpeg, png, gif เท่านั้น</small>}

            <div className="grid lg:grid-cols-6 gap-3 mt-3">
                {
                    fileList?.map((item, index) =>
                        <div className={`flex flex-col ${action == 'view' ? 'lg:col-span-2 xl:col-span-2' : 'lg:col-span-2 xl:col-span-2'}`} key={index}>
                            <div className="card_row card_hoverable" style={{ flexDirection: 'inherit' }}>
                                <div>
                                    <div className="image">
                                        <div className="aspect-w-4 aspect-h-3">
                                            <img
                                                src={`${filePath + item.name}`}
                                                onClick={e => handlePreview(item)}
                                                style={{ cursor: 'pointer' }}
                                                title="preview"
                                            />
                                        </div>
                                        {
                                            action !== "view" &&
                                            <div>
                                                <button type="button" className="btn btn_danger btn-icon btn_outlined uppercase absolute top-0 right-0 rtl:left-0 mt-2 rtl:ml-1 mr-1 cursor-pointer">
                                                    <span className='la la-remove' title="remove" onClick={e => removeFileClick(e, index)} />
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default AttachmentFile;
