'use client';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { createContext, useContext, useState } from 'react';
import { MessageResponseType } from '@/lib/response/responseUtil';

const MessageContext = createContext({
  notify: ({}: MessageResponseType) => {},
});

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [message, setMessage] = useState<MessageResponseType | undefined>();

  const notify = async (data: MessageResponseType) => {
    setMessage({
      message: data.message,
      messageType: data.messageType,
      disableAutoHide: data?.disableAutoHide ?? false,
    });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setMessage(undefined);
  };

  return (
    <MessageContext.Provider value={{ notify }}>
      {message && (
        <Snackbar
          open={message !== undefined}
          autoHideDuration={message.disableAutoHide ? null : 5000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity={message.messageType}>
            {message.message}
          </Alert>
        </Snackbar>
      )}
      {children}
    </MessageContext.Provider>
  );
}

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
