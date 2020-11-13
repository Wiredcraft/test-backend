expect.extend({
    toBeValidResult(response) {
        if (response.res.statusCode !== 200) {
            return {
                message: () => `Response error. status code ${response.res.statusCode}`,
                pass: false,
            };
        } else {
            return {
                message: () => `valid`,
                pass: true,
            };
        }
    }
});
