import * as zod_1 from "zod";
/**
 * Factory middleware that validates request body/query against a Zod schema.
 * @param schema - Zod schema to validate against
 * @param source - Where to read the data from ("body" | "query")
 */
const validate = (schema, source = "body") => {
    return (req, _res, next) => {
        try {
            const data = schema.parse(source === "body" ? req.body : req.query);
            // Replace source with parsed/transformed data
            if (source === "body") {
                req.body = data;
            }
            else {
                req.parsedQuery = data;
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
                _res.status(400).json({
                    success: false,
                    message: "Error de validación",
                    errors: messages,
                });
                return;
            }
            next(error);
        }
    };
};
export { validate };
