<script lang="ts">
	interface Props {
		title: string;
		description: string;
		pathname: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		noindex?: boolean;
		publishedTime?: string;
		modifiedTime?: string;
		structuredData?: Record<string, unknown> | Record<string, unknown>[];
	}

	let {
		title: _title,
		description: _description,
		pathname: _pathname,
		type: _type,
		image: _image,
		imageAlt: _imageAlt,
		noindex: _noindex,
		publishedTime: _publishedTime,
		modifiedTime: _modifiedTime,
		structuredData: _structuredData,
	}: Props = $props();
</script>

<!-- SEO is emitted by Astro layouts. This compatibility component is intentionally renderless. -->
