import Constants from "expo-constants";

class TokenManager {
	private static instance: TokenManager;
	private accessToken: string | null = null;
	private tokenExpiresAt: number = 0;

	private constructor() {}

	public static getInstance(): TokenManager {
		if (!TokenManager.instance) {
			TokenManager.instance = new TokenManager();
		}
		return TokenManager.instance;
	}

	private async fetchNewToken(): Promise<void> {
		const uid = Constants.expoConfig?.extra?.api42Uid;
		const secret = Constants.expoConfig?.extra?.api42Secret;

		if (!uid || !secret) {
			throw new Error("Missing API credentials");
		}

		const response = await fetch("https://api.intra.42.fr/oauth/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `grant_type=client_credentials&client_id=${uid}&client_secret=${secret}`,
		});
		if (!response.ok) {
			throw new Error(`Error auth 42!: ${response.status}`);
		}
		const data = await response.json();

		this.accessToken = data.access_token;
		const expiresIn = data.expires_in || 7200;
		this.tokenExpiresAt = Date.now() + (expiresIn - 10) * 1000;
	}

	public async getToken(): Promise<string> {
		if (!this.accessToken || Date.now() > this.tokenExpiresAt) {
			await this.fetchNewToken();
		}

		return this.accessToken as string;
	}
}

export default TokenManager.getInstance();
