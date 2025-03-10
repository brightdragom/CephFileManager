// src/UploadDialog.js
import React, { useState, useEffect } from "react";
import { useDialog } from "./DialogContext"; // 다이얼로그 상태 사용
import config from "./config";

const UploadDialog = () => {
  const { isUploadDialogOpen, closeUploadDialog } = useDialog(); // 다이얼로그 상태 사용

  const [selectedFile, setSelectedFile] = useState(null);
  const [buckets, setBuckets] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  // 🔹 다이얼로그가 열릴 때만 버킷 목록 가져오기
  useEffect(() => {
    if (isUploadDialogOpen) fetchBuckets();
  }, [isUploadDialogOpen]);

  const fetchBuckets = async () => {
    try {
      const response = await fetch(`${config.API_URL}/listOfBuckets`);
      if (!response.ok) throw new Error("Failed to fetch buckets");
      const data = await response.json();
      setBuckets(data.buckets);
    } catch (error) {
      console.error("Error fetching buckets:", error);
    }
  };

  // 🔹 파일 선택
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file || null);
    setSelectedFileName(file ? file.name : "");
  };

  // 🔹 버킷 선택
  const handleBucketChange = (event) => {
    setSelectedBucket(event.target.value);
  };

  // 🔹 파일 업로드
  const uploadFileToCeph = async () => {
    if (!selectedFile || !selectedBucket) {
      alert("Please select a file and a bucket.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("bucket", selectedBucket);

    try {
      const response = await fetch(`${config.API_URL}/createObject_v2`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      console.log("Upload Response:", result);
      alert(`Upload Successful: ${selectedFileName}`);

      // 🔹 업로드 후 입력 필드 초기화 & 다이얼로그 닫기
      setSelectedFile(null);
      setSelectedFileName("");
      setSelectedBucket("");
      closeUploadDialog();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed.");
    }
  };

  return isUploadDialogOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg relative">
        {/* 닫기 버튼 */}
        <button
          onClick={closeUploadDialog}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✖
        </button>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📂 Ceph File Manager
        </h1>

        {/* 🔹 버킷 선택 드롭다운 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            🔽 Choose a Bucket:
          </label>
          <select
            value={selectedBucket}
            onChange={handleBucketChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="" disabled>
              Select a bucket
            </option>
            {buckets.map((bucket, index) => (
              <option key={index} value={bucket}>
                {bucket}
              </option>
            ))}
          </select>
        </div>

        {/* 🔹 파일 업로드 입력란 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            📤 Select a File:
          </label>
          <div className="relative w-full">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm text-gray-500 text-center">
              {selectedFileName || "Click to select a file"}
            </div>
          </div>
        </div>

        {/* 🔹 업로드 버튼 */}
        <button
          onClick={uploadFileToCeph}
          className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all"
        >
          ⬆ Upload File
        </button>
      </div>
    </div>
  ) : null;
};

export default UploadDialog;