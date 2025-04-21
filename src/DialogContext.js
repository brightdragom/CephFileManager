// src/DialogContext.js
import React, { createContext, useContext, useState } from "react";
import UploadDialog from "./UploadDialog"; // 다이얼로그 내용 컴포넌트
import CreateBucketDialog from "./CreateBucket";
import DeleteBucketDialog from "./DeleteBucket";
// import DeleteBucketDialog from "./DeleteBucket";
import SetNewS3ApiEnv from "./SetNewS3ApiEnv";

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const openUploadDialog = () => setIsUploadDialogOpen(true);
  const closeUploadDialog = () => setIsUploadDialogOpen(false);

  const [isCreateBucketDialogOpen, setIsCreateBucketDialogOpen] = useState(false);
  const openCreateBucketDialog = () => setIsCreateBucketDialogOpen(true);
  const closeCreateBucketDialog = () => setIsCreateBucketDialogOpen(false);

  const [isDeleteBucketDialogOpen, setIsDeleteBucketDialogOpen] = useState(false);
  const openDeleteBucketDialog = () => setIsDeleteBucketDialogOpen(true);
  const closeDeleteBucketDialog = () => setIsDeleteBucketDialogOpen(false);


  const [isSetupS3ApiEnvDialogOpen, setIsSetupS3ApiEnvDialogOpen] = useState(false);
  const openSetupS3ApiEnvDialog = () => setIsSetupS3ApiEnvDialogOpen(true);
  const closeSetupS3ApiEnvDialog = () => setIsSetupS3ApiEnvDialogOpen(false);
  return (
    <DialogContext.Provider value={{ 
      isUploadDialogOpen, openUploadDialog, closeUploadDialog, 
      isCreateBucketDialogOpen, openCreateBucketDialog, closeCreateBucketDialog,
      isDeleteBucketDialogOpen, openDeleteBucketDialog, closeDeleteBucketDialog,
      isSetupS3ApiEnvDialogOpen, openSetupS3ApiEnvDialog, closeSetupS3ApiEnvDialog
       }}>
      {children}
      {isUploadDialogOpen && <UploadDialog />} {/* 다이얼로그 내용 렌더링 */}
      {isCreateBucketDialogOpen && <CreateBucketDialog />}
      {isDeleteBucketDialogOpen && <DeleteBucketDialog />}
      {isSetupS3ApiEnvDialogOpen && <SetNewS3ApiEnv />}
    </DialogContext.Provider>
  );
};

// Hook으로 편리하게 사용 가능
export const useDialog = () => useContext(DialogContext);