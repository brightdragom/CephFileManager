import React, { useState, useEffect } from "react";
import config from "./config";
import { Link } from "react-router-dom";
import { useDialog } from "./DialogContext";
// import { bgImage } from "./img/keti-backgound.png";
const Main = () => {
  const { isUploadDialogOpen, openUploadDialog } = useDialog(); // 다이얼로그 상태 관리
  const { isCreateBucketDialogOpen, openCreateBucketDialog } = useDialog(); // 다이얼로그 상태 관리
  const { isDeleteBucketDialogOpen, openDeleteBucketDialog } = useDialog(); // 다이얼로그 상태 관리

  const [buckets, setBuckets] = useState([]);
  const [bucketItem, setBucketItem] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [downloadLinks, setDownloadLinks] = useState({});
  const [previewContent, setPreviewContent] = useState(null);
  const [currentPreviewItem, setCurrentPreviewItem] = useState(null);

  // ✅ 1️⃣ Main.js 최초 접속 시 버킷 & 아이템 가져오기 (한 번만 실행됨)
  useEffect(() => {
    fetchBuckets();
    fetchBucketItem();
  }, []); // 🚀 빈 배열([]) → 최초 마운트 시 실행

  // ✅ 2️⃣ 다이얼로그가 닫힐 때만 최신 데이터 다시 불러오기
  useEffect(() => {
    if (!isUploadDialogOpen || !isCreateBucketDialogOpen || ! isDeleteBucketDialogOpen) {
      fetchBuckets();
      fetchBucketItem();
    }
  }, [isUploadDialogOpen, isCreateBucketDialogOpen, isDeleteBucketDialogOpen]); // 🚀 `isDialogOpen`이 false가 될 때 실행됨
  // 버킷 목록 가져오기
  const fetchBuckets = async () => {
    try {
      const response = await fetch(config.API_URL + "/listOfBuckets");
      const data = await response.json();
      setBuckets(data.buckets);
    } catch (error) {
      console.error("Error fetching buckets:", error);
    }
  };

  // 버킷 아이템 가져오기
  const fetchBucketItem = async () => {
    try {
      const response = await fetch(config.API_URL + "/getListOfBucketsItems");
      const data = await response.json();
      setBucketItem(data);
    } catch (error) {
      console.error("Error fetching bucket items:", error);
    }
  };

  // 객체 다운로드 링크 가져오기
  const fetchDownloadLink = async (bucket, objName) => {
    const formData = new FormData();
    formData.append("bucket", bucket);
    formData.append("obj", objName);

    try {
      const response = await fetch(config.API_URL + "/getDownloadObject", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.link;
    } catch (error) {
      console.error("Error fetching download link:", error);
      return null;
    }
  };

  const fetchObjDelete = async (bucket, objName) => {
    const objData = new FormData();
    objData.append("bucket", bucket);
    objData.append("obj", objName);

    try{
      const response = await fetch(config.API_URL + "/deleteObject", {
        method: "DELETE",
        body: objData,
      });
      const data = await response.json();
      console.log('obj delete success: ', data);
    }catch(error){
      console.error("Error Delete object: ", error);
    }finally{
      fetchBucketItem();
    }

  }
  //Object Delete
  const handelObjDelete = (bucket, objName) => {
    fetchObjDelete(bucket, objName);
  }

  // 다운로드 링크 설정
  const handleFetchDownloadLink = async (bucket, objName) => {
    const link = await fetchDownloadLink(bucket, objName);
    if (link) {
      setDownloadLinks((prev) => ({ ...prev, [objName]: link }));
    }
  };

  // 파일 확장자 확인
  const getExtensionOfFilename = (obj_name) => {
    if (!obj_name) return "";
    const lastDotIndex = obj_name.lastIndexOf(".");
    return lastDotIndex !== -1 ? obj_name.substring(lastDotIndex).toLowerCase() : "";
  };

  const handleClosePreview = async (objName) => {
    if (currentPreviewItem === objName) {
      setPreviewContent(null);
      setCurrentPreviewItem(null);
      return;
    }
  }
  // 파일 미리보기
  const handlePreview = async (bucket, objName) => {
    if (currentPreviewItem === objName) {
      setPreviewContent(null);
      setCurrentPreviewItem(null);
      return;
    }

    const prevlink = await fetchDownloadLink(bucket, objName);
    if (!prevlink) return;

    const fileType = getExtensionOfFilename(objName);

      // ✅ 지원하는 텍스트 파일 확장자
    const textFileExtensions = [".txt", ".go", ".js", ".json", ".log", ".md", ".html", ".css", ".sh", ".yaml", ".py"];

    if (textFileExtensions.includes(fileType)) {
      try {
        const previewContent = new FormData();
        previewContent.append("bucket", bucket);
        previewContent.append("obj", objName);

        const response = await fetch(config.API_URL + "/selectObjectPreviewContent", {
          method: "POST",
          body: previewContent,
        });
        const data = await response.json();
        console.log(data)
        setPreviewContent(
          `<pre class="w-full p-3 bg-gray-900 text-white text-sm rounded-lg overflow-auto max-h-auto">${data.content}</pre>`
        );
        setCurrentPreviewItem(objName);
        return;
      } catch (error) {
        console.error("Error fetching text file:", error);
        setPreviewContent(`<p class="text-red-500">Failed to load text preview.</p>`);
        return;
      }
    }

    const fileHandlers = {
      ".jpg": `<img src="${prevlink}" alt="${objName}" class="w-auto max-h-40 mx-auto" />`,
      // ".png": `<img src="${prevlink}" alt="${objName}" class="w-auto max-h-40 mx-auto" />`,
      ".png": `<img src="${prevlink}" alt="${objName}" class="w-auto max-h-auto mx-auto" />`,
      ".gif": `<img src="${prevlink}" alt="${objName}" class="w-auto max-h-40 mx-auto" />`,
      ".pdf": `<embed src="${prevlink}" type="application/pdf" class="w-auto h-40 mx-auto" />`,
      ".mp4": `<video src="${prevlink}" controls class="w-auto h-auto mx-auto" />`,
      ".mov": `<video src="${prevlink}" controls class="w-auto h-40 mx-auto" />`,
      default: `Unsupported file type: ${fileType}`,
    };

    setPreviewContent(fileHandlers[fileType] || fileHandlers.default);
    setCurrentPreviewItem(objName);
  };

  // 선택된 버킷 토글
  const toggleBucketList = (bucketName) => {
    setSelectedBucket((prev) => (prev === bucketName ? null : bucketName));
    setPreviewContent(null);
    setCurrentPreviewItem(null);
  };

  return (
    <div className="container mx-auto flex justify-center  h-auto m-6 space-x-6">
      {/* 왼쪽 사이드바 */}
      <div className="w-64 bg-sky-300 text-white p-6 flex flex-col space-y-4 shadow-lg rounded-lg min-h-[500px]">
        <h1 className="text-2xl font-bold">📁 Menu</h1>
        <nav className="flex flex-col space-y-2">
          <Link to="/" className="p-3 rounded-lg hover:bg-gray-600 transition">🏠 Home</Link>
          <button onClick={openUploadDialog} className="p-3 rounded-lg hover:bg-yellow-600 transition text-left">📤 Add Object</button>
          <button onClick={openCreateBucketDialog} className="p-3 rounded-lg hover:bg-green-600 transition text-left">🆕 Create Bucket</button>
          <button onClick={openDeleteBucketDialog} className="p-3 rounded-lg hover:bg-red-600 transition text-left">⚠️ Delete Bucket 🔥</button>
        </nav>
      </div>

      {/* 메인 콘텐츠 + 미리보기 */}
      <div className="flex flex-1 space-x-6 items-stretch">
        {/* 메인 콘텐츠 영역 */}
        <div className="p-6 w-full max-w-5xl bg-white shadow-lg rounded-lg flex-1 min-h-[500px]">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Buckets:</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            {buckets.map((bucketlist, index) => (
              <div key={index} onClick={() => toggleBucketList(bucketlist)}
                className={`cursor-pointer p-4 border rounded-lg shadow-sm transition-all 
                  ${selectedBucket === bucketlist ? "bg-blue-100 border-blue-500" : "bg-gray-100 hover:bg-gray-200"}`}>
                <p className="text-blue-600 font-semibold text-lg text-center">{bucketlist}</p>
              </div>
            ))}
          </div>

          {/* 선택된 버킷의 아이템 목록 */}
          {selectedBucket && (
            <div className="border rounded-lg p-5 bg-gray-50 mt-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Items in "{selectedBucket}":</h2>
              <ul className="divide-y divide-gray-300">
                {bucketItem
                  .filter((items) => items.bucket === selectedBucket)
                  .map((items, index) => (
                    <li key={index} className="py-3 px-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{items.name}</p>
                          <p className="text-xs text-gray-500">{items.modified}</p>
                          <p className="text-xs font-medium text-gray-700">{items.size} Bytes</p>
                        </div>
                        {/* 버튼 그룹 */}
                        <div className="flex space-x-2">
                          <button onClick={() => handleFetchDownloadLink(items.bucket, items.name)}
                            className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-lg shadow hover:bg-green-600 transition">
                            Download
                          </button>
                          <button onClick={() => handlePreview(items.bucket, items.name)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium shadow transition ${
                              currentPreviewItem === items.name
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}>
                            {currentPreviewItem === items.name ? "Hide Preview" : "Show Preview"}
                          </button>
                          <button onClick={() => handelObjDelete(items.bucket, items.name)}
                            className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-lg shadow hover:bg-gray-600 transition">
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* ✅ 개선된 미리보기 위치 및 크기 */}
        {previewContent && (
          <div className="absolute right-0 top-0 w-[650px] h-full border p-5 rounded-lg bg-white shadow-lg overflow-auto min-h-[500px]">
            <button
              onClick={() => handleClosePreview(currentPreviewItem)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✖
            </button>
            <h3 className="font-semibold mb-3 text-gray-800 text-center">{currentPreviewItem}</h3>
            <div className="p-3 bg-gray-100 rounded-md" dangerouslySetInnerHTML={{ __html: previewContent }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;