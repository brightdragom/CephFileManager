import React, { useState, useEffect } from "react";
import config from "./config";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [buckets, setBuckets] = useState([]);
  const [selctedBucket, setSelectedBucket] = useState(null);
  useEffect(() => {
    fetchBuckets();
  }, []);
  const fetchBuckets = async () => {
    const response = await fetch(config.API_URL+"/listOfBuckets");
    const data = await response.json();

    console.log('data: ', data)
    setBuckets(data.buckets);
  };
  const handleFileChange_ceph = (event) =>{
    setSelectedFile(event.target.files[0]);
  }
  const uploadFileToCeph = async() => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("bucket", selctedBucket);
    console.log('uploadFileToCeph:: file >> ', selectedFile, ' :: buckets >> ', setSelectedBucket)
    await fetch(config.API_URL+"/createObject_v2", {
      method: "POST",
      body: formData,
    }).then(res => res.json()).then(res=>{
      console.log(res);
      alert("Log: ", res);
    });

    fetchBuckets();
    fetchBucketItem();
    fetchDownloadLink();
  }

  const handelBucketChange = (event) => {
    console.log('>>>>>>', event.target.value);
    setSelectedBucket(event.target.value);
  }

  const [bucketItem, setBucketItem] = useState([]);
  useEffect(() => {
    fetchBucketItem();
  }, []);

  const fetchBucketItem = async() => {
    const response = await fetch(config.API_URL+"/getListOfBucketsItems");
    // [
    //   {
    //       "bucket": "keti-rgw-bucket-67fbd2ed-5672-4108-a45d-2647d5907ea5",
    //       "modified": "2025-02-26T03:29:21.464000+00:00",
    //       "name": "rookObj",
    //       "size": 11
    //   },
    //   {
    //       "bucket": "keti-rgw-bucket-newbucket",
    //       "modified": "2025-03-05T01:50:42.363000+00:00",
    //       "name": "common.go",
    //       "size": 1412
    //   }
    // ]
    const data = await response.json();
    console.log('item data :: ', data.length);
    setBucketItem(data);
  };

  const [downloadLinks, setDownloadLinks] = useState({});
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
      console.log("fetchDownloadLink response:", data);
  
      return data.link; // API에서 다운로드 링크 반환
    } catch (error) {
      console.error("Error fetching download link:", error);
      return null;
    }
  };
  const handleFetchDownloadLink = async (bucket, objName) => {
    const link = await fetchDownloadLink(bucket, objName);
    if (link) {
      setDownloadLinks((prevLinks) => ({
        ...prevLinks,
        [objName]: link, // 파일 이름을 키로 사용하여 링크 저장
      }));
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">Ceph File Manager</h1>

      {/* Visualization Bucket List */}
      <label for="bucket-select">Choose a BucketList:</label>
      <select name="buckets" id="bucket-select" onChange={handelBucketChange}>
        {
          buckets.map((bucket, index) => (
            <option key={index} value={bucket.value}>{bucket}</option>
          ))
        }
      </select>
      <br></br>
      <input type="file" onChange={handleFileChange_ceph} className="my-2" />
      <button onClick={uploadFileToCeph} className="p-2 bg-blue-500 text-white rounded">
        Upload
      </button>
      <h2 className="mt-5 text-lg font-semibold">Bucket List:</h2>
      <ul>
        {buckets.map((bucket, index) => (
          <li key={index}>
            <div className="text-blue-500">{bucket}</div>
          </li>
        ))}
      </ul>
      <h2 className="mt-5 text-lg font-semibold">Items for Each Bucket:</h2>
      {/* <ul>
        {buckets.map((bucket, index) => (
          <li key={index}>
            <div className="text-blue-500">{bucket}</div>
            {bucketItem.filter(items => items.bucket===bucket).map((items, index) => (
              <div>
                <div key={index} > BucketName: ${items.bucket} Date: ${items.modified} ObjectName: ${items.name} Object Size: ${items.size} </div>
                <a > Link!</a>
              </div>
            ))}
          </li>
        ))}
      </ul> */}
      <ul>
  {buckets.map((bucket, index) => (
    <li key={index}>
      <div className="text-blue-500">{bucket}</div>
      {bucketItem.filter(items => items.bucket === bucket).map((items, index) => (
        <div key={index}>
          <p>📂 <strong>BucketName:</strong> {items.bucket}</p>
          <p>🕒 <strong>Date:</strong> {items.modified}</p>
          <p>📄 <strong>ObjectName:</strong> {items.name} ({items.size} bytes)</p>

          {/* 다운로드 버튼 */}
          <button
            onClick={() => handleFetchDownloadLink(items.bucket, items.name)}
            className="p-2 bg-green-500 text-white rounded"
          >
            Generate Link
          </button>

          {/* 다운로드 링크 표시 */}
          {downloadLinks[items.name] && (
            <a href={downloadLinks[items.name]} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-2">
              Download
            </a>
          )}
        </div>
      ))}
    </li>
  ))}
</ul>
    </div>
  );
};

export default App;