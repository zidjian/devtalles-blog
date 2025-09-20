import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars{
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    DISCORD_CALLBACK_URL: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    DISCORD_CLIENT_ID: joi.string().required(),
    DISCORD_CLIENT_SECRET: joi.string().required(),
    DISCORD_CALLBACK_URL: joi.string().required(),
}).unknown(true);

const { error, value } = envsSchema.validate( process.env );

if(error) {
    throw new Error(`Invalid environment variables: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    databaseUrl: envVars.DATABASE_URL,
    jwtSecret: envVars.JWT_SECRET,
    discordClientId: envVars.DISCORD_CLIENT_ID,
    discordClientSecret: envVars.DISCORD_CLIENT_SECRET,
    discordCallbackUrl: envVars.DISCORD_CALLBACK_URL,
}