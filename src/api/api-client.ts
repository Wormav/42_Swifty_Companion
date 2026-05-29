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
		let token = await tokenManager.getToken();

		// =========================================================================
		// ⚠️ TEST DU BONUS : RÉGÉNÉRATION AUTOMATIQUE DU TOKEN ⚠️
		// Pour prouver au correcteur que l'app s'auto-répare quand le token expire :
		// Décommente l'appel `simulateExpiredToken()` ci-dessous.
		// L'app enverra un faux token, recevra une erreur 401 de l'API, puis
		// régénérera un vrai token et rejouera la requête de façon invisible !
		// =========================================================================
		// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type
		const simulateExpiredToken = () => {
			if (!isRetry) {
				token = "fake_expired_token_for_evaluation";
				// eslint-disable-next-line no-console
				console.log("🧨 [BONUS] Token volontairement saboté pour le test !");
			}
		};
		// simulateExpiredToken(); // <-- DÉCOMMENTE CETTE LIGNE POUR TESTER LE BONUS

		// eslint-disable-next-line no-console
		console.log(`📡 [BONUS] Requête vers ${endpoint}`);
		// eslint-disable-next-line no-console
		console.log(`🔑 [BONUS] Valeur du token envoyé : ${token.substring(0, 15)}...`);

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
			// eslint-disable-next-line no-console
			console.log("⚠️ [BONUS] Erreur 401 détectée ! L'API a refusé le token.");
			// eslint-disable-next-line no-console
			console.log("🔄 [BONUS] Demande d'un nouveau token à l'API 42 et relance de la requête...");
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
				nbr_subscribers: 0,
			}));

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
