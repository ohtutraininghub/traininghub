'use client';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { createContext, useContext, useState } from 'react';
import { MessageResponseType, MessageType } from '@/lib/response/responseUtil';

const MessageContext = createContext({
  notify: ({}: MessageResponseType | Response) => {},
});

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [message, setMessage] = useState<MessageResponseType | undefined>();

  const notify = async (data: MessageResponseType | Response) => {
    if (data instanceof Response) {
      const dataAsResponse: Response = data;

      const contentType = dataAsResponse.headers.get('Content-Type');
      if (
        !dataAsResponse.ok &&
        (!contentType || !contentType.includes('application/json'))
      ) {
        setMessage({
          message: 'Internal server error!',
          messageType: MessageType.ERROR,
        });
        return;
      }

      const jsonResponse: MessageResponseType = await dataAsResponse.json();
      if (!jsonResponse.message || !jsonResponse.messageType) {
        throw Error('Response did not use proper message format...');
      }

      setMessage({
        message: jsonResponse.message,
        messageType: jsonResponse.messageType,
      });

      return;
    }

    const dataAsMessage: MessageResponseType = data;
    setMessage({
      message: dataAsMessage.message,
      messageType: dataAsMessage.messageType,
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
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={message.messageType}
            sx={{ width: '100%' }}
          >
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
