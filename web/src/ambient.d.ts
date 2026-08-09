interface BlogPostMetadata {
	title: string;
	description: string;
	date: string;
	date_updated: string;
	category?: string;
	tags: string[];
	published: boolean;
	listed?: boolean;
	slug: string;
}
