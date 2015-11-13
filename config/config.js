module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'JWT Token Secret',
    MONGO_URI: process.env.MONGO_URI || 'localhost',

    // OAuth 2.0
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '',
    FOURSQUARE_SECRET: process.env.FOURSQUARE_SECRET || '',
    GOOGLE_SECRET: process.env.GOOGLE_SECRET || '',
    GITHUB_SECRET: process.env.GITHUB_SECRET || '',
    INSTAGRAM_SECRET: process.env.INSTAGRAM_SECRET || '46d6cc16b2fa445595e747a3349cb6e4',

    LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || '',
    TWITCH_SECRET: process.env.TWITCH_SECRET || '',
    WINDOWS_LIVE_SECRET: process.env.WINDOWS_LIVE_SECRET || '',
    YAHOO_SECRET: process.env.YAHOO_SECRET || '',

    // OAuth 1.0
    TWITTER_KEY: process.env.TWITTER_KEY || '',
    TWITTER_SECRET: process.env.TWITTER_SECRET || '',

    // Sending Email
    EMAIL_ACCOUNT: process.env.EMAIL_ACCOUNT || 'Riggold',
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS || 'luck87@gmail.com',
    EMAIL_PWD: process.env.EMAIL_PWD || 'P0litecnico',
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'Gmail',
    EMAIL_CALLBACK_DOMAIN: process.env.EMAIL_PWD || 'http://localhost:3000/auth/verify',

};