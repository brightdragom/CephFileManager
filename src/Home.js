import React, { useState, useEffect } from "react";
import config from "./config";
import { Link } from "react-router-dom";

const Home = () => {
  const [buckets, setBuckets] = useState([]);
  const [bucketItem, setBucketItem] = useState([]);
  const [downloadLinks, setDownloadLinks] = useState({});
  const [previewContent, setPreviewContent] = useState(null);
  const [currentPreviewItem, setCurrentPreviewItem] = useState(null);

  useEffect(() => {
    fetchBuckets();
    fetchBucketItem();
  }, []);

  const fetchBuckets = async () => {
    const response = await fetch(config.API_URL + "/listOfBuckets");
    const data = await response.json();
    setBuckets(data.buckets);
  };

  const fetchBucketItem = async () => {
    const response = await fetch(config.API_URL + "/getListOfBucketsItems");
    const data = await response.json();
    setBucketItem(data);
  };

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

  const handleFetchDownloadLink = async (bucket, objName) => {
    const link = await fetchDownloadLink(bucket, objName);
    if (link) {
      setDownloadLinks((prev) => ({ ...prev, [objName]: link }));
    }
  };

  function getExtensionOfFilename(obj_name) {
    if (!obj_name) return "";
    const lastDotIndex = obj_name.lastIndexOf(".");
    return lastDotIndex !== -1 ? obj_name.substring(lastDotIndex).toLowerCase() : "";
  }

  const handlePreview = async (bucket, objName) => {
    if (currentPreviewItem === objName) {
      // 🔹 이미 미리보기가 열린 파일이면 닫기
      setPreviewContent(null);
      setCurrentPreviewItem(null);
      return;
    }

    const link = await fetchDownloadLink(bucket, objName);
    if (!link) return;

    const fileType = getExtensionOfFilename(objName);
    const fileHandlers = {
      ".jpg": `<img src="${link}" alt="${objName}" class="w-auto max-h-40 mx-auto" />`,
      ".png": `<img src="${link}" alt="${objName}" class="w-auto max-h-40 mx-auto" />`,
      ".gif": `<img src="${link}" alt="${objName}" class="w-auto max-h-40 mx-auto" />`,
      ".pdf": `<embed src="${link}" type="application/pdf" class="w-auto h-40 mx-auto" />`,
      ".mp4": `<video src="${link}" controls class="w-auto h-40 mx-auto" />`,
      ".mov": `<video src="${link}" controls class="w-auto h-40 mx-auto" />`,
      default: `Unsupported file type: ${fileType}`,
    };

    setPreviewContent(fileHandlers[fileType] || fileHandlers.default);
    setCurrentPreviewItem(objName);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Ceph File Manager</h1>

      {/* 🔹 파일 목록 (테이블) */}
      <h2 className="text-lg font-semibold mb-4">Items for Each Bucket:</h2>
      <div className="border rounded-lg p-4 bg-gray-100">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Bucket</th>
              <th className="p-2">Date</th>
              <th className="p-2">Object</th>
              <th className="p-2">Size</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bucketItem.map((items, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{items.bucket}</td>
                <td className="p-2">{items.modified}</td>
                <td className="p-2">{items.name}</td>
                <td className="p-2">{items.size} bytes</td>
                <td className="p-2">
                  {/* 다운로드 버튼 */}
                  <button
                    onClick={() => handleFetchDownloadLink(items.bucket, items.name)}
                    className="p-1 bg-green-500 text-white rounded mr-2"
                  >
                    Download
                  </button>

                  {/* 미리보기 버튼 (ON/OFF 토글) */}
                  <button
                    onClick={() => handlePreview(items.bucket, items.name)}
                    className={`p-1 rounded ${
                      currentPreviewItem === items.name ? "bg-red-500" : "bg-blue-500"
                    } text-white`}
                  >
                    {currentPreviewItem === items.name ? "Hide Preview" : "Show Preview"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 미리보기 공간 (단 하나만 유지) */}
      {previewContent && (
        <div className="mt-4 border p-3 rounded bg-white shadow-md">
          <h3 className="font-semibold mb-2">{currentPreviewItem}</h3>
          <div dangerouslySetInnerHTML={{ __html: previewContent }} />
        </div>
      )}
      <nav>
        <Link to="/">Adsfasdfadsfdaafdsfadsfadsfdasfdsafsadfasdfsafsapp</Link>
      </nav>
    </div>
  );
};

export default Home;