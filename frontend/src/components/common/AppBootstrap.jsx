import React, { useEffect, useRef, useState } from 'react';
import api from '../../services/api';
import AppBootScreen from './AppBootScreen';

const MAX_ATTEMPTS = 8;
const RETRY_DELAY_MS = 3500;
const REQUEST_TIMEOUT_MS = 12000;

const sleep = (ms) => new Promise((resolve) => {
  window.setTimeout(resolve, ms);
});

const AppBootstrap = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const runIdRef = useRef(0);

  useEffect(() => {
    let isMounted = true;

    const warmBackend = async (runId) => {
      setHasError(false);

      for (let nextAttempt = 1; nextAttempt <= MAX_ATTEMPTS; nextAttempt += 1) {
        if (!isMounted || runIdRef.current !== runId) {
          return;
        }

        setAttempt(nextAttempt);

        try {
          await api.get('/healthz', {
            timeout: REQUEST_TIMEOUT_MS,
            headers: {
              'Cache-Control': 'no-cache'
            }
          });

          if (isMounted && runIdRef.current === runId) {
            setIsReady(true);
          }
          return;
        } catch (error) {
          if (nextAttempt === MAX_ATTEMPTS) {
            if (isMounted && runIdRef.current === runId) {
              setHasError(true);
            }
            return;
          }

          await sleep(RETRY_DELAY_MS);
        }
      }
    };

    const startWarmup = () => {
      const nextRunId = runIdRef.current + 1;
      runIdRef.current = nextRunId;
      setIsReady(false);
      setAttempt(1);
      warmBackend(nextRunId);
    };

    startWarmup();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetry = () => {
    const nextRunId = runIdRef.current + 1;
    runIdRef.current = nextRunId;
    setIsReady(false);
    setHasError(false);
    setAttempt(1);

    const warmBackend = async () => {
      for (let nextAttempt = 1; nextAttempt <= MAX_ATTEMPTS; nextAttempt += 1) {
        if (runIdRef.current !== nextRunId) {
          return;
        }

        setAttempt(nextAttempt);

        try {
          await api.get('/healthz', {
            timeout: REQUEST_TIMEOUT_MS,
            headers: {
              'Cache-Control': 'no-cache'
            }
          });
          if (runIdRef.current === nextRunId) {
            setIsReady(true);
          }
          return;
        } catch (error) {
          if (nextAttempt === MAX_ATTEMPTS) {
            if (runIdRef.current === nextRunId) {
              setHasError(true);
            }
            return;
          }

          await sleep(RETRY_DELAY_MS);
        }
      }
    };

    warmBackend();
  };

  if (!isReady) {
    return (
      <AppBootScreen
        attempt={attempt}
        isError={hasError}
        onRetry={handleRetry}
        onContinue={() => setIsReady(true)}
      />
    );
  }

  return children;
};

export default AppBootstrap;
