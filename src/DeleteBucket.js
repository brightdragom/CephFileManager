// src/UploadDialog.js
import React, { useState, useEffect } from "react";
import { useDialog } from "./DialogContext"; // 다이얼로그 상태 사용
import config from "./config";

const DeleteBucketDialog = () => {
  // const { isDialogOpen, closeDialog } = useDialog(); // 다이얼로그 상태 사용
  const { isDeleteBucketDialogOpen, closeDeleteBucketDialog } = useDialog();
  const [buckets, setBuckets] = useState([]); //bucket list
  // 🔹 다이얼로그가 열릴 때만 버킷 목록 가져오기
  useEffect(() => {
    if (isDeleteBucketDialogOpen) fetchBuckets();
  }, [isDeleteBucketDialogOpen]);

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

  const [selectedBucket, setSelectedBucket] = useState("");

  // 🔹 버킷 선택
  const handleBucketChange = (event) => {
    setSelectedBucket(event.target.value);
  };
  const deleteBucketToCeph = async () => {
    const formData = new FormData();
    formData.append("bucket", selectedBucket);

    try{                                              
      const response = await fetch(`${config.API_URL}/deleteBucket`,{
        method: "DELETE",
        body: formData,
      });
      let responsedata
      if (!response.ok) {
        responsedata = await response.json();
        console.log('ResponseData: '+JSON.stringify(responsedata.error))
        throw new Error(JSON.stringify(responsedata.error));
      }
      alert(`Delete bucket Successfully: ${selectedBucket}`);

      closeDeleteBucketDialog();
    }catch(error){
      console.error(error);
      alert('Delete Bucket failed!\nBecause: ', error);
    }
  }
  return isDeleteBucketDialogOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg relative">
        {/* 닫기 버튼 */}
        <button
          onClick={closeDeleteBucketDialog}
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
{/* 
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            📤 Input Bucket Name:
          </label>
          <div className="relative w-full">
            <input
              type="text"
              value={deleteBucketName}
              onChange={handleBucketChange} // ✅ 값 입력 시 업데이트
              placeholder="Enter bucket name"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div> */}
        {/* 🔹 업로드 버튼 */}
        <button
          onClick={deleteBucketToCeph}
          className="w-full p-3 bg-gradient-to-r from-red-500 to-indigo-500 text-white text-lg font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all"
        >
          Delete Bucket
        </button>
      </div>
    </div>
  ) : null;
};

export default DeleteBucketDialog;