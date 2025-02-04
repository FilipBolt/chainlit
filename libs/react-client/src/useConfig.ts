import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { useApi, useAuth } from './api';
import { configState } from './state';
import { IChainlitConfig } from './types';

const useConfig = (accessToken?: string) => {
  const [config, setConfig] = useRecoilState(configState);
  const { isAuthenticated } = useAuth();
  const language = navigator.language || 'en-US';
  const sourceLanguage = 'hr-HR';

  const {
    data: configData,
    error: configError,
    isLoading: configLoading
  } = useApi<IChainlitConfig>(
    !config && isAuthenticated
      ? `/project/settings?language=${language}`
      : null,
    { token: accessToken }
  );

  const {
    data: sourceData,
    error: sourceError,
    isLoading: sourceLoading
  } = useApi<{ sourceLanguage: string }>(
    !config && isAuthenticated
      ? `/project/settings/source?language=${sourceLanguage}`
      : null,
    { token: accessToken }
  );

  useEffect(() => {
    if (!configData || !sourceData) return;
    setConfig({
      ...configData,
      translation: {
        ...configData.translation,
        sourceLanguage: sourceData.sourceLanguage
      }
    });
  }, [configData, sourceData, setConfig]);

  return {
    config,
    error: configError || sourceError,
    isLoading: configLoading || sourceLoading,
    language,
    sourceLanguage
  };
};

export { useConfig };
