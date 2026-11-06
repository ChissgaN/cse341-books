import express from 'express';
import swaggerUi from 'swagger-ui-express';
import router from './src/router.js';
import swaggerDocument from './swagger.json' with { type: 'json' };

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Server is running' });
});

app.use(router);

// Express only treats a middleware as an error handler if it declares all four arguments.
app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Request body must be valid JSON' });
    }

    console.error('Unexpected error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
});

export default app;