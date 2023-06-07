import { Redis } from "@upstash/redis/cloudflare";
import { UPSTASH_URL, UPSTASH_API_TOKEN } from '$env/static/private';

const redis = new Redis({
	url: UPSTASH_URL,
	token: UPSTASH_API_TOKEN
});

export default redis;
