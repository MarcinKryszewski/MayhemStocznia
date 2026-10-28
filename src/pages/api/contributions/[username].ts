import type { APIRoute } from 'astro';

export const prerender = false;

const CACHE_CONTROL = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';
const UPSTREAM_TIMEOUT_MS = 10_000;
const USERNAME_PATTERN = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

function errorResponse(error: string, status: number): Response {
	return Response.json(
		{ error },
		{
			status,
			headers: { 'Cache-Control': 'no-store' },
		},
	);
}

export const GET: APIRoute = async ({ params }) => {
	const username = params.username;
	if (
		!username ||
		username.length > 39 ||
		!USERNAME_PATTERN.test(username)
	) {
		return errorResponse('invalid_username', 400);
	}

	const timeout = AbortSignal.timeout(UPSTREAM_TIMEOUT_MS);
	let upstream: Response;
	try {
		upstream = await fetch(`https://github.com/${username}.contribs`, {
			headers: { Accept: 'application/json' },
			signal: timeout,
		});
	} catch {
		return timeout.aborted
			? errorResponse('upstream_timeout', 504)
			: errorResponse('upstream_unavailable', 502);
	}

	if (upstream.status === 404) {
		return errorResponse('user_not_found', 404);
	}
	if (upstream.status === 403 || upstream.status === 429) {
		return errorResponse('upstream_rate_limited', 503);
	}
	if (!upstream.ok) {
		return errorResponse('upstream_error', 502);
	}

	let data: unknown;
	try {
		data = await upstream.json();
	} catch {
		return timeout.aborted
			? errorResponse('upstream_timeout', 504)
			: errorResponse('invalid_upstream_json', 502);
	}

	return Response.json(data, {
		headers: { 'Cache-Control': CACHE_CONTROL },
	});
};
