const { Redis } = require("@upstash/redis");
require('dotenv').config({ path: '.env.local' });

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function test() {
    try {
        console.log('Testing Redis connection...');
        await redis.set('test_key', 'test_value');
        const val = await redis.get('test_key');
        console.log('Redis result:', val);
        if (val === 'test_value') {
            console.log('Redis is working correctly!');
        } else {
            console.log('Redis returned unexpected value.');
        }
    } catch (error) {
        console.error('Redis error:', error);
    }
}

test();
