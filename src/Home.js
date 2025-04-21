import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDialog } from "./DialogContext"; // 다이얼로그 컨텍스트 사용

const Home = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  // const { isUploadDialogOpen } = useDialog();
  const { openUploadDialog, openCreateBucketDialog, openDeleteBucketDialog, openSetupS3ApiEnvDialog } = useDialog();


  return (
    <div className="h-screen flex justify-center items-center bg-gray-100 ">
      <div className="w-96 p-6 bg-white shadow-xl rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Ceph Storage Manager
        </h1>

        {/* 메뉴 리스트 */}
        <ul className="space-y-4">
          {/* 🔹 버킷 목록 보기 */}
          <li>
            <Link to="/Main">
            <div
              // onClick={() => setActiveMenu("viewBuckets")}
              className="w-full text-left p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition text-center"
            >
               🗑️ View Buckets
            </div>
            </Link>
          </li>

          {/* 🔹 새로운 Bucket 생성 */}
          <li>
            <button
              // onClick={() => setActiveMenu("createBucket")}
              onClick={openCreateBucketDialog}
              className="w-full text-left p-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition text-center"
            >
              🆕 Create Bucket
            </button>
          </li>

          {/* 🔹 새로운 Object 추가 */}
          <li>
            <button
              onClick={openUploadDialog}
              className="w-full text-left p-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition text-center"
            >
              📤 Add Object 
            </button>
          </li>

          {/* 🔹 Bucket 제거 */}
          <li>
            <button
              onClick={openDeleteBucketDialog}
              className="w-full text-left p-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition text-center"
            >
              ⚠️☠️🗑️ Delete Bucket 💣☠️🔥
            </button>
          </li>
          <li>
            <div
              onClick={openSetupS3ApiEnvDialog}
              className="w-full text-left p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition text-center"
            >
               Setup S3 API
            </div>
          </li>
        </ul>

        {/* 🔹 선택된 메뉴에 따라 UI 변경 */}
        <div className="mt-6">
          {activeMenu === "viewBuckets" && <ViewBuckets />}
          {activeMenu === "createBucket" && <CreateBucket />}
          {activeMenu === "addObject" && <AddObject />}
          {activeMenu === "setupS3API" && <SetupS3API />}
        </div>
      </div>
    </div>
  );
};

/* 🔹 Bucket 목록 보기 컴포넌트 */
const ViewBuckets = () => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-lg font-semibold text-gray-800">📂 Bucket List</h2>
      <p className="text-sm text-gray-600">View all available storage buckets.</p>
    </div>
  );
};

/* 🔹 Bucket 생성 컴포넌트 */
const CreateBucket = () => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-lg font-semibold text-gray-800">🆕 Create a New Bucket</h2>
      <p className="text-sm text-gray-600">Not Yet !</p>
    </div>
  );
};

/* 🔹 Object 추가 컴포넌트 */
const AddObject = () => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-lg font-semibold text-gray-800">📤 Upload an Object</h2>
      <p className="text-sm text-gray-600">Select a bucket and upload files.</p>
    </div>
  );
};
/* 🔹 Object 추가 컴포넌트 */
const SetupS3API = () => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-lg font-semibold text-gray-800">📤 Setup S3 API Env</h2>
      {/* <p className="text-sm text-gray-600">Select a bucket and upload files.</p> */}
    </div>
  );
};
export default Home;