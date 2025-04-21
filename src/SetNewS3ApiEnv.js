// src/UploadDialog.js
import React, { useState, useEffect } from "react";
import { useDialog } from "./DialogContext"; // 다이얼로그 상태 사용
import config from "./config";

const SetNewS3ApiEnv = () => {
  // const { isDialogOpen, closeDialog } = useDialog(); // 다이얼로그 상태 사용
  const { isSetupS3ApiEnvDialogOpen, closeSetupS3ApiEnvDialog } = useDialog();
  // const [buckets, setBuckets] = useState([]); //bucket list
  // const [newBucket, setNewBucket] = useState(""); //new bucket
  const [S3Host, setS3Host] = useState(""); //new bucket
  const [S3Port, setS3Port] = useState(""); //new bucket
  const [S3AccessKeyId, setS3AccessKeyId] = useState(""); //new bucket
  const [S3SecretAccessKey, setS3SecretAccessKey] = useState(""); //new bucket
  // 🔹 다이얼로그가 열릴 때만 버킷 목록 가져오기
  useEffect(() => {
    console.log("Opening dialog - 01")
    if (isSetupS3ApiEnvDialogOpen) {
      console.log("Opening dialog - 02")
      fetchS3Env();;
      setS3Host("");
      setS3Port("");
      setS3AccessKeyId("");
      setS3SecretAccessKey("");
    }
  }, [isSetupS3ApiEnvDialogOpen]);

  const fetchS3Env = async () => {
    try {
      const response = await fetch(`${config.API_URL}/getEnv`);
      if (!response.ok) throw new Error("Failed to fetch buckets");
      const data = await response.json();
      // setBuckets(data.buckets);
      console.log('now set: ', data)
    } catch (error) {
      console.error("Error fetching buckets:", error);
    }
  };
  

  const handleS3HostInputEvent = (event) => {
    setS3Host(event.target.value);
  }
  const handleS3PortInputEvent = (event) => {
    setS3Port(event.target.value);
  }
  const handleS3AccessKeyIdInputEvent = (event) => {
    setS3AccessKeyId(event.target.value);
  }
  const handleS3SecretAccessKeyInputEvent = (event) => {
    setS3SecretAccessKey(event.target.value);
  }

  const createBucketToCeph = async () => {

    const formData = new FormData();
    formData.append("host", S3Host);
    formData.append("port", S3Port);
    formData.append("rgw_access_key_id", S3AccessKeyId);
    formData.append("rgw_secret_access_key", S3SecretAccessKey);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try{
      const response = await fetch(`${config.API_URL}/s3ApiChange`, {
        method: "POST",
        body: formData,
      });
      let responsedata
      if (!response.ok) {
        responsedata = await response.json();
        console.log('ResponseData: '+JSON.stringify(responsedata.error))
        throw new Error(JSON.stringify(responsedata.error));
      }
      alert(`CreateBucket Successful`);

      closeSetupS3ApiEnvDialog();

    }catch(error){
      console.error("S3 API 환경 설정 실패:", error);
      alert("Failed to set S3 API environment. Please check the input values or server.");  
    }
  }

  return isSetupS3ApiEnvDialogOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg relative">
        {/* 닫기 버튼 */}
        <button
          onClick={closeSetupS3ApiEnvDialog}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✖
        </button>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📂 Connect to S3
        </h1>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            📤 HOST:
          </label>
          <div className="relative w-full">
            <input
              type="text"
              value={S3Host}
              onChange={handleS3HostInputEvent} // ✅ 값 입력 시 업데이트
              placeholder="Enter S3 Host"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            📤 Port:
          </label>
          <div className="relative w-full">
            <input
              type="text"
              value={S3Port}
              onChange={handleS3PortInputEvent} // ✅ 값 입력 시 업데이트
              placeholder="Enter S3 Port"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            📤 S3 Access Key ID:
          </label>
          <div className="relative w-full">
            <input
              type="text"
              value={S3AccessKeyId}
              onChange={handleS3AccessKeyIdInputEvent} // ✅ 값 입력 시 업데이트
              placeholder="Enter S3 Access Key ID"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            📤 S3 Secret Access Key:
          </label>
          <div className="relative w-full">
            <input
              type="text"
              value={S3SecretAccessKey}
              onChange={handleS3SecretAccessKeyInputEvent} // ✅ 값 입력 시 업데이트
              placeholder="Enter S3 Secret Access Key"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
    
        {/* 🔹 업로드 버튼 */}
        <button
          onClick={createBucketToCeph}
          className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all"
        >
          🆕 Setup connected S3 API
        </button>
      </div>
    </div>
  ) : null;
};

export default SetNewS3ApiEnv;