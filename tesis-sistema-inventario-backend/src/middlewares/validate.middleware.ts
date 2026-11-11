import * as zod_1 from "zod";
/**
 * Factory middleware that validates request body/query against a Zod schema.
 * @param schema - Zod schema to validate against
 * @param source - Where to read the data from ("body" | "query")
 */
const validate = (schema, source = "body") => {
    return (req, _res, next) => {
        try {
            const input = source === "body" ? req.body : req.query;
            // Rechazar estructuras excesivas antes de que Zod recorra sus elementos.
            const pending = [{ value: input, depth: 0 }];
            let nodes = 0;
            while (pending.length) {
                const { value, depth } = pending.pop();
                if (++nodes > 2000 || depth > 8) return _res.status(413).json({ success: false, message: "La solicitud es demasiado compleja" });
                if (value && typeof value === "object") {
                    const entries = Object.entries(value);
                    if (entries.length > 500) return _res.status(413).json({ success: false, message: "La solicitud contiene demasiados elementos" });
                    for (const [, child] of entries) pending.push({ value: child, depth: depth + 1 });
                }
            }
            const data = schema.parse(input);
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
                const messages = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);
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
