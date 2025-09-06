<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import GlassPanel from '$lib/components/ui/GlassPanel.svelte';
</script>

<div class="container mx-auto flex flex-col gap-4 space-y-8 p-4">
	<GlassPanel>
		<h1 class="h1">Admin Login</h1>

		<p class="mb-4">Please enter the admin password to access the admin panel.</p>

		<form method="POST" action="?/login" use:enhance class="space-y-4">
			<div>
				<label for="password" class="block">Password:</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="input preset-filled-surface-200-800"
				/>
			</div>
			{#if $page.form?.error}
				<div class="mx-2 card preset-tonal-error px-4 py-1">
					<p class="text-error-900-100">{$page.form.error}</p>
				</div>
			{/if}
			<button type="submit" class="btn preset-filled-primary-500">Login</button>
		</form>
	</GlassPanel>
</div>
