export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiIssue {
  path: string;
  code: string;
  message: string;
  reason?: string;
}

export interface ApiErrorBody {
  statusCode: number;
  /** English, developer-facing (string[] for some validation errors). Never shown to users. */
  message: string | string[];
  error: string;
  path?: string;
  timestamp?: string;
  issues?: ApiIssue[];
}
