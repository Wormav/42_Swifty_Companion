import { Event42 } from "../types/event";
import tokenManager from "./token-manager";

const API_BASE_URL = "https://api.intra.42.fr/v2";

type ApiOptions = {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	headers?: Record<string, string>;
	body?: string;
};

class ApiClient {
	public async fetch42<T>(endpoint: string, options: ApiOptions = {}, isRetry: boolean = false): Promise<T> {
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

		if (response.status === 401 && !isRetry) {
			tokenManager.invalidateToken();
			return this.fetch42<T>(endpoint, options, true);
		}

		if (!response.ok) {
			await this.handleHttpError(response);
		}

		return response.json() as Promise<T>;
	}

	public async fetchEvents(campusId: number = 31): Promise<Event42[]> {
		try {
			type RawExam = {
				id: number;
				name: string;
				location: string | null;
				begin_at: string;
				end_at: string;
				max_people: number | null;
			};

			// On récupère événements et examens futurs
			const [events, exams] = await Promise.all([
				this.fetch42<Event42[]>(`/campus/${campusId}/events?sort=begin_at&page[size]=10&filter[future]=true`),
				this.fetch42<RawExam[]>(`/campus/${campusId}/exams?sort=begin_at&page[size]=10&filter[future]=true`),
			]);

			const formattedExams: Event42[] = exams.map((ex) => ({
				id: `exam-${ex.id}`,
				name: ex.name,
				kind: "exam",
				description: "Examen",
				location: ex.location || "Cluster",
				begin_at: ex.begin_at,
				end_at: ex.end_at,
				max_people: ex.max_people || null,
				nbr_subscribers: 0, // Les exams n'ont pas d'inscrits dans ce endpoint
			}));

			// On fusionne et on trie par date
			const all: Event42[] = [...events, ...formattedExams].sort(
				(a, b) => new Date(a.begin_at).getTime() - new Date(b.begin_at).getTime(),
			);

			return all.slice(0, 10);
		} catch (e) {
			console.warn("Could not fetch events or exams", e);
			return [];
		}
	}

	private async handleHttpError(response: Response): Promise<never> {
		let errorBody = "";
		try {
			const text = await response.text();
			try {
				const json = JSON.parse(text);
				errorBody = JSON.stringify(json);
			} catch {
				errorBody = text;
			}
		} catch {
			errorBody = "Cannot read response body";
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
