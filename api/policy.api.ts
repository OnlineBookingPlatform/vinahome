export const createPolicy = async (
  companyId?: number,
  content?: string
): Promise<void> => {
  const config = useRuntimeConfig();
  const baseURL = `${config.public.apiGatewayUrl}/v2/policy`;
  return await $fetch<void>(`/create-policy/${companyId}`, {
    baseURL,
    method: "POST",
    body: { content },
  }).catch((error) => {
    console.error("Create policy:\n", error);
    throw error;
  });
};

export const updatePolicy = async (
  companyId?: number,
  content?: string
): Promise<void> => {
  const config = useRuntimeConfig();
  const baseURL = `${config.public.apiGatewayUrl}/v2/policy`;
  return await $fetch<void>(`/update-policy/${companyId}`, {
    baseURL,
    method: "PUT",
    body: { content },
  }).catch((error) => {
    console.error("Update policy:\n", error);
    throw error;
  });
};
