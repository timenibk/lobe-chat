import { Button, Icon } from '@lobehub/ui';
import { Loader2Icon, Network } from 'lucide-react';
import { ReactNode, memo, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FormInput, FormPassword } from '@/components/FormInput';
import { FormAction } from '@/features/Conversation/Error/style';
import { useProviderName } from '@/hooks/useProviderName';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { GlobalLLMProviderKey } from '@/types/user/settings';

import { LoadingContext } from './LoadingContext';
import { useApiKey } from './useApiKey';

interface ProviderApiKeyFormProps {
  apiKeyPlaceholder?: string;
  avatar?: ReactNode;
  description: string;
  provider: GlobalLLMProviderKey;
  showEndpoint?: boolean;
}

const ProviderApiKeyForm = memo<ProviderApiKeyFormProps>(
  ({ provider, avatar, showEndpoint = false, apiKeyPlaceholder, description }) => {
    const { t } = useTranslation(['modelProvider', 'error']);
    const { t: errorT } = useTranslation('error');
    const [showProxy, setShow] = useState(false);

    const { apiKey, baseURL, setConfig } = useApiKey(provider);
    const { showOpenAIProxyUrl } = useServerConfigStore(featureFlagsSelectors);
    const providerName = useProviderName(provider);
    const { loading } = useContext(LoadingContext);

    return (
      <FormAction
        avatar={avatar}
        description={description}
        title={t(`unlock.apiKey.title`, { name: providerName, ns: 'error' })}
      >
        <FormPassword
          autoComplete={'new-password'}
          onChange={(value) => {
            setConfig(provider, { apiKey: value });
          }}
          placeholder={apiKeyPlaceholder || 'sk-***********************'}
          suffix={<div>{loading && <Icon icon={Loader2Icon} spin />}</div>}
          value={apiKey}
        />

        {showEndpoint &&
          showOpenAIProxyUrl &&
          (showProxy ? (
            <FormInput
              onChange={(value) => {
                setConfig(provider, { baseURL: value });
              }}
              placeholder={'https://api.openai.com/v1'}
              suffix={<div>{loading && <Icon icon={Loader2Icon} spin />}</div>}
              value={baseURL}
            />
          ) : (
            <Button
              icon={<Icon icon={Network} />}
              onClick={() => {
                setShow(true);
              }}
              type={'text'}
            >
              {errorT('unlock.addProxyUrl')}
            </Button>
          ))}
      </FormAction>
    );
  },
);

export default ProviderApiKeyForm;
