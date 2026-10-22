const backendUrl = process.env.REACT_APP_BACKEND_URL;

export type NotificationSearchParams = {
  limitValue: number;
  currentPage: number;
  id_user: string | number;
  search?: string;
  type?: number;
  column?: string;
  sort?: string;
};

export type NotificationTotalParams = {
  id_user: string | number;
  search?: string;
  type?: number;
};

export type NotificationCountParams = {
  id_user: string | number;
  state?: number;
  limitValue?: number;
};

export type NotificationUpdateParams = {
  id_notification: number;
  id_user: string | number;
};

export type NotificationReadParams = {
  id_user: string | number;
  state?: number;
  limitValue?: number;
};

export type NotificationDeleteParams = {
  id_notification: number;
  id_user: string | number;
};

export type NotificationSendParams = {
  id_user: string | number;
  title: string;
  body: string;
};

export type NotificationTokenParams = {
  device_token: string;
  id_user: string | number;
  platform?: string;
};

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!backendUrl) {
    throw new Error("REACT_APP_BACKEND_URL is not configured");
  }

  const response = await fetch(`${backendUrl}${path}`, {
    ...options,
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `HTTP ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

export function searchNotifications(
  params: NotificationSearchParams
): Promise<any[]> {
  return apiFetch<any[]>("/api/geop/notification/search", {
    method: "POST",
    body: JSON.stringify({
      limitValue: Number(params.limitValue) || 10,
      currentPage: Number(params.currentPage) || 1,
      id_user: params.id_user,
      search: params.search || "",
      type: Number(params.type) || 0,
      column: params.column || "timestamp",
      sort:
        String(params.sort || "DESC").toUpperCase() === "ASC"
          ? "ASC"
          : "DESC",
    }),
  });
}

export function getNotificationsTotalPage(
  params: NotificationTotalParams
): Promise<Array<{ count: number }>> {
  return apiFetch<Array<{ count: number }>>(
    "/api/geop/notification/totalpage",
    {
      method: "POST",
      body: JSON.stringify({
        id_user: params.id_user,
        search: params.search || "",
        type: Number(params.type) || 0,
      }),
    }
  );
}

export function searchAppNotifications(
  params: NotificationSearchParams
): Promise<any[]> {
  return apiFetch<any[]>("/api/geop/notification/app/search", {
    method: "POST",
    body: JSON.stringify({
      limitValue: Number(params.limitValue) || 10,
      currentPage: Number(params.currentPage) || 1,
      id_user: params.id_user,
      search: params.search || "",
      type: Number(params.type) || 0,
      column: params.column || "timestamp",
      sort:
        String(params.sort || "DESC").toUpperCase() === "ASC"
          ? "ASC"
          : "DESC",
    }),
  });
}

export function getAppNotificationsTotalPage(
  params: NotificationTotalParams
): Promise<Array<{ count: number }>> {
  return apiFetch<Array<{ count: number }>>(
    "/api/geop/notification/app/totalpage",
    {
      method: "POST",
      body: JSON.stringify({
        id_user: params.id_user,
        search: params.search || "",
        type: Number(params.type) || 0,
      }),
    }
  );
}

export function getNotificationsCount(
  params: NotificationCountParams
): Promise<any[]> {
  return apiFetch<any[]>("/api/geop/notification/count", {
    method: "POST",
    body: JSON.stringify({
      id_user: params.id_user,
      state: Number(params.state) || 0,
      limitValue: Number(params.limitValue) || 10,
    }),
  });
}

export function updateNotification(
  params: NotificationUpdateParams
): Promise<{
  success: boolean;
  id_notification: number;
  affectedRows: number;
}> {
  return apiFetch<{
    success: boolean;
    id_notification: number;
    affectedRows: number;
  }>("/api/geop/notification/update", {
    method: "POST",
    body: JSON.stringify({
      id_notification: params.id_notification,
      id_user: params.id_user,
    }),
  });
}

export function readNotifications(
  params: NotificationReadParams
): Promise<any[]> {
  return apiFetch<any[]>("/api/geop/notification/read", {
    method: "POST",
    body: JSON.stringify({
      id_user: params.id_user,
      state: Number(params.state) || 0,
      limitValue: Number(params.limitValue) || 50,
    }),
  });
}

export function getNotificationDetail(
  idNotification: number,
  idUser: string | number
): Promise<{
  success: boolean;
  data: any;
}> {
  return apiFetch<{
    success: boolean;
    data: any;
  }>(
    `/api/geop/notification/app/${idNotification}?id_user=${encodeURIComponent(
      String(idUser)
    )}`,
    {
      method: "GET",
    }
  );
}

export function deleteNotification(
  idNotification: number,
  idUser: string | number
): Promise<{
  success: boolean;
  id_notification: number;
  affectedRows: number;
}> {
  return apiFetch<{
    success: boolean;
    id_notification: number;
    affectedRows: number;
  }>(
    `/api/geop/notification/app/${idNotification}?id_user=${encodeURIComponent(
      String(idUser)
    )}`,
    {
      method: "DELETE",
    }
  );
}

export function deleteNotificationPost(
  params: NotificationDeleteParams
): Promise<{
  success: boolean;
  id_notification: number;
  affectedRows: number;
}> {
  return apiFetch<{
    success: boolean;
    id_notification: number;
    affectedRows: number;
  }>("/api/geop/notification/app/delete", {
    method: "POST",
    body: JSON.stringify({
      id_notification: params.id_notification,
      id_user: params.id_user,
    }),
  });
}

export function sendNotification(
  params: NotificationSendParams
): Promise<any> {
  return apiFetch<any>("/api/geop/notification/send", {
    method: "POST",
    body: JSON.stringify({
      id_user: params.id_user,
      title: params.title,
      body: params.body,
    }),
  });
}

export function sendNotificationToken(
  params: NotificationTokenParams
): Promise<any> {
  return apiFetch<any>("/api/geop/notification/sendtoken", {
    method: "POST",
    body: JSON.stringify({
      device_token: params.device_token,
      id_user: params.id_user,
      platform: params.platform || "unknown",
    }),
  });
}