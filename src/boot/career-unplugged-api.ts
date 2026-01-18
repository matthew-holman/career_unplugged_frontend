import { boot } from 'quasar/wrappers';
import { configureOpenApiClient } from 'src/api/openapi-client';

export default boot(() => {
  configureOpenApiClient();
});
