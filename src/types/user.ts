export type User42 = {
	id: number;
	login: string;
	email: string;
	image: {
		link: string | null;
		versions: {
			large: string | null;
			medium: string | null;
			small: string | null;
			micro: string | null;
		};
	};
	wallet: number;
	correction_point: number;
	location: string | null;
	cursus_users: {
		level: number;
		cursus: {
			name: string;
		};
		skills: {
			id: number;
			name: string;
			level: number;
		}[];
	}[];
	projects_users: {
		id: number;
		status: string;
		final_mark: number | null;
		project: {
			name: string;
		};
	}[];
};
