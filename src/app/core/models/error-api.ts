export interface ErrorApi {
  timestamp?: string;
  status?: number;
  error?: string;
  mensaje?: string;
  campos?: Record<string, string>;
}
