// import React, { useState, useEffect } from "react";
import React from "react";
// eslint-disable-next-line
import config from "./config";
// eslint-disable-next-line
import { BrowserRouter as Router, BrowserRouter, Routes, Route } from 'react-router-dom';
// Pages.js
import Main from './Main';
import Home from './Home';
import UploadDialog from './UploadDialog';
import NotFound from "./NotFound";

import { DialogProvider } from "./DialogContext"; // Dialog 상태 제공
import CreateBucketDialog from "./CreateBucket";
import DeleteBucketDialog from "./DeleteBucket";

const App = () => {
  return(
    <div className='App' >
    <DialogProvider> {/* 🔹 다이얼로그 상태를 모든 컴포넌트에서 사용 가능 */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/uploadDialog" element={<UploadDialog />} />
          <Route path="/createBucketDialog" element={<CreateBucketDialog />} />
          <Route path="/deleteBucketDialog" element={<DeleteBucketDialog />} />
          {/* 존재하지 않는 경로 처리 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </DialogProvider>
  </div>
  );
};

export default App;