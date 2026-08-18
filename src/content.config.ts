import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({
		pattern: '*.md',
		base: './src/routes/blog/posts',
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.string(),
		date_updated: z.string().optional(),
		category: z.string().optional(),
		tags: z.array(z.string()),
		published: z.boolean(),
		listed: z.boolean().optional(),
		slug: z.string(),
	}),
});

export const collections = { blog };
