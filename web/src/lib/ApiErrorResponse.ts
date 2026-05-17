export type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  metadata?: {
    status?: number;
  };
};

type ResponseLike = {
  status?: number;
  data?: ApiErrorResponse;
};

type ErrorLike = {
  response?: ResponseLike;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorResponse(error: unknown): ResponseLike | undefined {
  if (!isRecord(error)) return undefined;

  const response = error.response;

  if (!isRecord(response)) return undefined;

  return {
    status: typeof response.status === "number" ? response.status : undefined,
    data: isRecord(response.data)
      ? {
          success:
            typeof response.data.success === "boolean"
              ? response.data.success
              : undefined,
          message:
            typeof response.data.message === "string"
              ? response.data.message
              : undefined,
          metadata: isRecord(response.data.metadata)
            ? {
                status:
                  typeof response.data.metadata.status === "number"
                    ? response.data.metadata.status
                    : undefined,
              }
            : undefined,
        }
      : undefined,
  };
}

export function getApiErrorStatus(error: unknown): number | undefined {
  const response = getErrorResponse(error);

  return response?.status ?? response?.data?.metadata?.status;
}

export function getApiErrorMessage(error: unknown): string {
  const response = getErrorResponse(error);

  return response?.data?.message ?? "";
}

export function isAuthError(error: unknown): boolean {
  const status = getApiErrorStatus(error);

  return status === 401 || status === 403;
}

export function isNoDataError(error: unknown): boolean {
  const status = getApiErrorStatus(error);
  const message = getApiErrorMessage(error).toLowerCase();

  return (
    status === 404 ||
    message.includes("belum ada") ||
    message.includes("tidak ditemukan") ||
    message.includes("data kosong") ||
    message.includes("not found")
  );
}