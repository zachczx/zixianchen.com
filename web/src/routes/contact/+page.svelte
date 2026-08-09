<script lang="ts">
	import Nav from '$lib/Nav.svelte';
	import WebsiteFooter from '$lib/WebsiteFooter.svelte';
	import UserIcon from '~icons/lucide/user';
	import EnvelopeIcon from '~icons/lucide/mail';
	import CheckIcon from '~icons/lucide/check';
	import ExclamationCircleIcon from '~icons/lucide/circle-alert';
	import Seo from '$lib/Seo.svelte';
	let navCurrent = '';
	type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
	type Web3FormsResponse = {
		success?: boolean;
		message?: string;
	};

	let formStatus = $state<FormStatus>('idle');
	let formMessage = $state('');
	let formEl = $state() as HTMLFormElement;
	let isSubmitting = $derived(formStatus === 'submitting');

	function preventDefault(fn: (event: SubmitEvent) => void) {
		return function (event: SubmitEvent) {
			event.preventDefault();
			fn(event);
		};
	}

	/**
	 * Web3Forms submission
	 */
	const handleSubmit = async (event: SubmitEvent) => {
		const form = event.currentTarget as HTMLFormElement;

		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		formStatus = 'submitting';
		formMessage = '';

		try {
			const formData = new FormData(form);
			const object = Object.fromEntries(formData);
			const json = JSON.stringify(object);

			const response = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: json,
			});
			const result = (await response.json()) as Web3FormsResponse;

			if (!response.ok || !result.success) {
				throw new Error(result.message ?? 'Message could not be sent.');
			}

			formEl.reset();
			formStatus = 'success';
			formMessage = 'Message sent successfully.';
			setTimeout(() => {
				if (formStatus === 'success') {
					formStatus = 'idle';
					formMessage = '';
				}
			}, 4000);
		} catch {
			formStatus = 'error';
			formMessage = 'That did not go through.';
		}
	};
</script>

<Seo title="Zixian Chen - Message Me" description="Send Zixian a message." pathname="/contact" />

<div class="bg-base-200 grid min-h-dvh grid-rows-[1fr_auto] content-center justify-items-center">
	<Nav {navCurrent} />
	<main class="flex max-w-(--breakpoint-2xl) items-center">
		<section class="space-y-4 px-3 pb-2 xl:grid xl:min-w-[40rem]">
			<div class="rounded-3xl p-4 xl:min-w-[35rem]">
				<h1 class="mb-12 text-4xl font-bold lg:text-6xl">Tell Me Something</h1>
				<p class="text-base-content/65 -mt-8 mb-10 max-w-xl leading-relaxed">Send a note, question, or project lead.</p>
				<form bind:this={formEl} onsubmit={preventDefault(handleSubmit)} class="grid w-full gap-y-4">
					<input type="hidden" name="access_key" value="f29b8ecc-f01d-45b0-bb55-72005ec3975a" />
					<div class="grid gap-1.5">
						<label for="contact-name" class="text-base-content/65 ms-1 font-mono text-xs tracking-wide uppercase"
							>Name</label>
						<div class="input input-lg input-bordered flex w-full items-center gap-2">
							<UserIcon aria-hidden="true" class="h-4 w-4 opacity-70" />
							<input
								id="contact-name"
								type="text"
								class="grow"
								name="name"
								placeholder="Your name"
								autocomplete="name"
								required />
						</div>
					</div>
					<div class="grid gap-1.5">
						<label for="contact-email" class="text-base-content/65 ms-1 font-mono text-xs tracking-wide uppercase"
							>Email</label>
						<div class="input input-lg input-bordered flex w-full items-center gap-2">
							<EnvelopeIcon aria-hidden="true" class="h-4 w-4 opacity-70" />
							<input
								id="contact-email"
								type="email"
								name="email"
								class="grow"
								placeholder="you@example.com"
								autocomplete="email"
								required />
						</div>
					</div>
					<div class="grid gap-1.5">
						<label for="contact-message" class="text-base-content/65 ms-1 font-mono text-xs tracking-wide uppercase"
							>Message</label>
						<textarea
							id="contact-message"
							name="message"
							placeholder="What’s up?"
							class="textarea textarea-bordered textarea-lg w-full"
							required
							rows="5"></textarea>
					</div>
					<p class="text-base-content/65 ms-1 text-xs leading-relaxed">
						This form uses Web3Forms. Don’t send anything sensitive.
					</p>
					<div class="w-full">
						<button
							class="btn btn-neutral btn-lg text-base-100 w-full text-lg"
							disabled={isSubmitting}
							aria-busy={isSubmitting}
							>{#if isSubmitting}
								<span class="loading loading-dots loading-md text-base-100"></span>
								Sending...
							{:else}
								Send message
							{/if}
						</button>
						{#if formStatus === 'success'}
							<p aria-live="polite" class="ms-1 mt-3 text-sm text-lime-700">
								<CheckIcon aria-hidden="true" class="me-1 mb-1 inline" />
								{formMessage}
							</p>
						{:else if formStatus === 'error'}
							<p aria-live="polite" class="text-warning ms-1 mt-3 text-sm">
								<ExclamationCircleIcon aria-hidden="true" class="me-1 mb-1 inline" />
								That didn’t go through. Try again, or
								<a
									href="https://www.linkedin.com/in/zixianchen/"
									class="focus-visible:outline-accent font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2">
									message me on LinkedIn</a
								>.
							</p>
						{/if}
					</div>
				</form>
			</div>
		</section>
	</main>
	<WebsiteFooter />
</div>
