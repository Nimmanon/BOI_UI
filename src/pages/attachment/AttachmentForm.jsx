import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import APIService from "../../services/APIService";
import basePath from "../../services/basePath";
import Textarea from "../../components/Textarea";

const AttachmentForm = ({
  data,
  action,
  onFileSelect,
  showDesc = false,
  maxImage = 3,
  multiple = true,
}) => {
  const [file, setFile] = useState();
  const [fileList, setFileList] = useState([]);
  const [filePath, setFilePath] = useState(basePath.previewUrl());
  const [error, setError] = useState();

  const effectRan = useRef(false);

  const {
    register,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
    getValues,
  } = useForm({
    defaultValues: {
      Remark: "",
    },
  });

  useEffect(() => {
    if (data === undefined || data?.length === 0) return;
    //console.log("Attachment form data => ", data);

    let items = [];
    data?.map((d) => {
      let item = {};
      item.Id = d.Id;
      item.name = d.Name;
      let fileType = d?.Name?.split(".")[1];
      item.type = d?.Name?.includes("jpg", "jpeg", "gif", "png")
        ? "image/" + fileType
        : "application/" + fileType;
      item.filetype = fileType;
      item.Remark = d?.Remark;
      items.push(item);
    });
    setFileList(items);
  }, [data]);

  const handleFileChange = (e) => {
    //console.log('handleFileChange=>', e);
    setError();

    if ((e !== undefined) & (e !== null)) {
      let name = e?.target?.name;
      let [file] = e.target.files;

      //check size > 1MB
      if (file?.size > 1000000) {
        setError({ type: "size" });
        return;
      }

      //check format
      if (
        ![
          "image/jpg",
          "image/jpeg",
          "image/png",
          "image/gif",
          "application/pdf",
          "application/xls",
          "application/xlsx",
          "application/doc",
          "application/docx",
          "application/ppt",
          "application/pptx",
        ].includes(file?.type)
      ) {
        setError({ type: "format" });
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
    formData.append("file", file, filename);

    APIService.Post("Upload/UploadFile", formData)
      .then((res) => {
        if (res.status !== 200) return;

        var new_file = {
          name: file.name,
          type: file.type,
          filetype: file.type.split("/")[1],
        };

        if (file?.name !== res.data) {
          new_file = {
            name: res.data,
            type: file.type,
            filetype: file.type.split("/")[1],
          };
        }

        if (showDesc) {
          setFile(new_file);
        } else {
          setFileList((prevItem) => {
            return [...prevItem, new_file];
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const handleAddClick = () => {
    file.Remark = getValues("Remark");
    setFileList((prevItem) => {
      return [...prevItem, file];
    });
    setFile();
    setValue("Remark", "");
  };

  const handlePreview = (file) => {
    if (file === undefined || file === null) return;

    var filepath = basePath.previewUrl() + file?.name;
    window.open(filepath, "_blank");
  };

  const removeFileClick = (e, index) => {
    let [item] = fileList.filter((item, i) => i === index);

    let items = fileList.filter((item, i) => i !== index);
    setFileList(items);

    //clear Error
    if (error !== undefined) error.type = "";
  };

  useEffect(() => {
    //console.log('AttachmentForm fileList =>',fileList);
    if (action === "view") return;
    onFileSelect(fileList);
  }, [fileList]);

  return (
    <>
      {fileList?.length < maxImage && action !== "view" && (
        <div className="card p-2">
          <div>
            <label className="custom-file-upload">
              <input
                type="file"
                style={{ display: "none" }}
                name="File"
                className={`form-control multiple ${
                  error?.type == "required" ? "is-invalid" : ""
                }`}
                onChange={handleFileChange}
              />
              <i className="fa fa-cloud-upload" /> Browse Files
            </label>
            {!showDesc && <label> {fileList?.length} files selected.</label>}
            {showDesc && file !== undefined && (
              <div className="grid lg:grid-cols-4 gap-3 mt-3">
                <div className="lg:grid-cols-1">
                  <img
                    src={`${
                      filePath +
                      (file?.name?.toLowerCase().includes("pdf")
                        ? "pdf-file.png"
                        : file?.name)
                    }`}
                    onClick={(e) => handlePreview(file)}
                    style={{ cursor: "pointer" }}
                    title="preview"
                  />
                </div>
              </div>
            )}
          </div>

          {error?.type == "size" && (
            <small className="block mt-2 invalid-feedback">
              ไฟล์ต้องขนาดไม่เกิน 1 MB
            </small>
          )}
          {error?.type == "format" && (
            <small className="block mt-2 invalid-feedback">
              เฉพาะไฟล์ jpg, jpeg, png, gif, pdf เท่านั้น
            </small>
          )}
          {showDesc && (
            <>
              <div className="mt-3">
                <Textarea
                  name="Remark"
                  label="คำอธิบาย"
                  placeholder=""
                  register={register}
                  type="text"
                  onChange={(e) => setValue("Remark", e?.target.value)}
                />
              </div>
              <div className="ml-1">
                <div>
                  <button
                    type="button"
                    className="btn btn btn_primary uppercase"
                    onClick={handleAddClick}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      <div
        className={`grid lg:grid-cols-6 gap-3 ${
          fileList?.length < maxImage && action !== "view" ? "mt-3" : ""
        } ${fileList?.length > 0 ? "p-2" : ""}`}
      >
        {fileList?.map((item, index) => (
          <div
            className={`flex flex-col ${
              fileList?.length === maxImage
                ? "lg:col-span-2 xl:col-span-2"
                : "lg:col-span-3 xl:col-span-3"
            }`}
            key={index}
          >
            <div
              className="card_row card_hoverable"
              style={{ flexDirection: "inherit" }}
            >
              <div>
                <div
                  className="image card"
                  style={{ margin: "0.45rem", minWidth: "0px" }}
                >
                  <div className="aspect-w-4 aspect-h-3">
                    <img
                      src={`${
                        filePath +
                        (item?.name?.toLowerCase().includes("pdf")
                          ? "pdf-file.png"
                          : item?.name)
                      }`}
                      onClick={(e) => handlePreview(item)}
                      style={{ cursor: "pointer" }}
                      className="h-80 w-72 object-cover rounded-t-xl"
                    />
                  </div>
                  <div className="px-4 py-3 w-72">
                    <div className="flex">
                      <p className="text-sm text-gray-600 cursor-auto">
                        {item?.Remark}
                      </p>
                    </div>
                  </div>
                  {action !== "view" && (
                    <div>
                      <button
                        type="button"
                        className="btn btn_danger btn-icon btn_outlined uppercase absolute top-0 right-0 rtl:left-0 mt-2 rtl:ml-1 mr-1 cursor-pointer"
                      >
                        <span
                          className="la la-remove"
                          title="remove"
                          onClick={(e) => removeFileClick(e, index)}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AttachmentForm;
