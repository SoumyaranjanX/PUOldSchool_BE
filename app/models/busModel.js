import mongoose, { Schema } from "mongoose";

const busSchema = new mongoose.Schema(
    {
        "stopName": {
            "type": "string",
        },
        "timings": {
            "type": "object",
            "properties": {
                "towardSJ": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "format": "time",
                    }
                },
                "towardLibrary": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "format": "time",

                    }
                }
            },
            "required": ["towardSJ", "towardLibrary"],
        }
    }
)
export const Bus = mongoose.model("Bus", busSchema);