# Ceph File Manager

## 📌 Overview
Ceph File Manager is a React-based web application that allows users to interact with Ceph Object Storage. This application enables users to:
- View the list of available buckets.
- Upload files to a selected bucket.
- View items stored in each bucket.

## 🚀 Features
- **List Available Buckets:** Fetch and display the available buckets from Ceph.
- **Upload Files to Buckets:** Select a bucket and upload files to Ceph storage.
- **View Bucket Items:** Fetch and display objects stored in each bucket.

## 📂 Project Structure
```
📦 ceph-file-manager
 ┣ 📂 src
 ┃ ┣ 📜 App.js         # Main React component
 ┃ ┣ 📜 index.js       # React app entry point
 ┣ 📜 package.json     # Project dependencies
 ┣ 📜 README.md        # Documentation
 ┗ 📜 .env             # Environment variables (optional)
```

## 🔧 Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-repo/ceph-file-manager.git
cd ceph-file-manager
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Create `config.js`
Since `config.js` is not included in the repository, you need to create it manually inside the `src` folder.

Create a new file at `src/config.js` and add the following content:
```js
const config = {
  API_URL: "http://10.0.2.191:5000"
};
export default config;
```

### 4️⃣ Run the Application
```bash
npm start
```
The application will be available at `http://localhost:3000`.

## 🖥️ Usage
### **1. Select a Bucket**
- Choose a bucket from the dropdown list.

### **2. Upload a File**
- Click `Choose File` and select a file from your local system.
- Click the `Upload` button to upload the file to the selected bucket.

### **3. View Buckets and Items**
- The list of buckets is displayed.
- Items stored in each bucket are shown along with metadata (name, modified date, size).

## 🔍 Code Explanation
### **Fetching Buckets**
```js
const fetchBuckets = async () => {
  const response = await fetch(config.API_URL + "/listOfBuckets");
  const data = await response.json();
  setBuckets(data.buckets);
};
```
- Fetches available buckets from Ceph API.
- Updates the `buckets` state with the response.

### **Uploading a File**
```js
const uploadFileToCeph = async() => {
  if (!selectedFile) return;
  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("bucket", selectedBucket);
  await fetch(config.API_URL+"/createObject_v2", {
    method: "POST",
    body: formData,
  }).then(res => res.json()).then(res => {
    console.log(res);
    alert("Upload Success: " + res.message);
  });
};
```
- Prepares the selected file and bucket for upload.
- Sends the file to Ceph via API.

### **Fetching Bucket Items**
```js
const fetchBucketItem = async() => {
  const response = await fetch(config.API_URL+"/getListOfBucketsItems");
  const data = await response.json();
  setBucketItem(data);
};
```
- Retrieves stored objects within each bucket.
- Updates the `bucketItem` state with the retrieved data.

## ✅ Future Enhancements
- Implement **file deletion** from buckets.
- Add **progress indicators** for file uploads.
- Improve **UI design** with additional styling.

## 🤝 Contributing
Feel free to fork the repository and create pull requests.

## 📜 License
This project is licensed under the MIT License.

