import { run } from './app';

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
