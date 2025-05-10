export const createTransit = async (
  companyId?: number,
  content?: string
): Promise<void> => {
  const config = useRuntimeConfig();
  const baseURL = `${config.public.apiGatewayUrl}/v2/transit`;
  return await $fetch<void>(`/create-transit/${companyId}`, {
    baseURL,
    method: "POST",
    body: { content },
  }).catch((error) => {
    console.error("Create transit:\n", error);
    throw error;
  });
};

export const updateTransit = async (
  companyId?: number,
  content?: string
): Promise<void> => {
  const config = useRuntimeConfig();
  const baseURL = `${config.public.apiGatewayUrl}/v2/transit`;
  return await $fetch<void>(`/update-transit/${companyId}`, {
    baseURL,
    method: "PUT",
    body: { content },
  }).catch((error) => {
    console.error("Update transit:\n", error);
    throw error;
  });
};
