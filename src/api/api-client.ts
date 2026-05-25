import tokenManager from "./token-manager";

const API_BASE_URL = "https://api.intra.42.fr/v2";

type ApiOptions = {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	headers?: Record<string, string>;
	body?: string;
};

class ApiClient {
	public async fetch42<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
		const token = await tokenManager.getToken();

		const headers = {
			...options.headers,
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		};

		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			...options,
			headers,
		});

		if (!response.ok) {
			await this.handleHttpError(response);
		}

		return response.json() as Promise<T>;
	}

	private async handleHttpError(response: Response): Promise<never> {
		let errorBody = "";
		try {
			const json = await response.json();
			errorBody = JSON.stringify(json);
		} catch {
			errorBody = await response.text();
		}

		switch (response.status) {
			case 401:
				throw new Error("401 Unauthorized : token is invalid or expired.");
			case 404:
				throw new Error("404 Not Found : Not found.");
			case 429:
				throw new Error("429 Too Many Requests : To many requests, please try again later.");
			default:
				throw new Error(`Erreur ${response.status} : ${errorBody}`);
		}
	}
}

export default new ApiClient();
