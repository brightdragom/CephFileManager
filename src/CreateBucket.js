// src/UploadDialog.js
import React, { useState, useEffect } from "react";
import { useDialog } from "./DialogContext"; // 다이얼로그 상태 사용
import config from "./config";

const CreateBucketDialog = () => {
  // const { isDialogOpen, closeDialog } = useDialog(); // 다이얼로그 상태 사용
  const { isCreateBucketDialogOpen, closeCreateBucketDialog } = useDialog();
  const [buckets, setBuckets] = useState([]); //bucket list
  const [newBucket, setNewBucket] = useState(""); //new bucket
  // 🔹 다이얼로그가 열릴 때만 버킷 목록 가져오기
  useEffect(() => {
    if (isCreateBucketDialogOpen) fetchBuckets();
  }, [isCreateBucketDialogOpen]);

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
  
  const handleNewBucketChange = (event) => {
    setNewBucket(event.target.value);
  }

  const createBucketToCeph = async () => {
    const formData = new FormData();
    formData.append("newBucket", newBucket);

    try{                                              
      const response = await fetch(`${config.API_URL}/createNewBucket`,{
        method: "POST",
        body: formData,
      });
      let responsedata
      if (!response.ok) {
        responsedata = await response.json();
        console.log('ResponseData: '+JSON.stringify(responsedata.error))
        throw new Error(JSON.stringify(responsedata.error));
      }
      alert(`CreateBucket Successful: ${newBucket}`);

      closeCreateBucketDialog();
    }catch(error){
      console.error(error);
      alert('Create Bucket failed! Because: ', error);
    }
  }

  return isCreateBucketDialogOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg relative">
        {/* 닫기 버튼 */}
        <button
          onClick={closeCreateBucketDialog}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✖
        </button>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📂 Ceph File Manager
        </h1>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            🔽 Now Bucket List:
          </label>
          <ul>
            {buckets.map((bucket, index) => (
              <li key={index} value={bucket}>
                {bucket}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            📤 Input Bucket Name:
          </label>
          <div className="relative w-full">
            <input
              type="text"
              value={newBucket}
              onChange={handleNewBucketChange} // ✅ 값 입력 시 업데이트
              placeholder="Enter bucket name"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {/* 🔹 업로드 버튼 */}
        <button
          onClick={createBucketToCeph}
          className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all"
        >
          🆕 Create Bucket
        </button>
      </div>
    </div>
  ) : null;
};

export default CreateBucketDialog;