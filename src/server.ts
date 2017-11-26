import * as express from "express";
import "reflect-metadata";
import {createExpressServer} from "routing-controllers";
import { SeriesController } from "./controller/SeriesController";
import { createConnection } from "typeorm";
import * as OAuth2Server from "oauth2-server";
import { OauthClients } from "./entity/OauthClients";
import { OauthTokens } from "./entity/OauthTokens";
import { Users } from "./entity/Users";
import { User } from "oauth2-server";
import { OauthAuthorizationCodes } from "./entity/OauthAuthorizationCodes";
import bodyParser = require("body-parser");


//const app = express();

class Response<T>{
    limit: number;
    offset: number;
    results: [T];

    constructor(limit: number, offset: number, results: [T]) {
        this.limit = limit;
        this.offset = offset;
        this.results = results;
    }
}

createConnection().then(async connection => {
    const app = createExpressServer({
        controllers: [SeriesController] // we specify controller we want to use
    });

    /*const oauth2Model: OAuth2Server.AuthorizationCodeModel = {
        getClient: async (clientId: string, clientSecret: string): Promise<OAuth2Server.Client | OAuth2Server.Falsey> => {
            return undefined;
        },
        saveToken: async (token: OAuth2Server.Token, client: OAuth2Server.Client, user: OAuth2Server.User): Promise<OAuth2Server.Token> => {
            return token;
        },
        getAccessToken: async (accessToken: string): Promise<OAuth2Server.Token> => {
            return {
                accessToken,
                client: {id: "testClient", grants: ["access_token"]},
                user: {id: "testUser"}
            };
        },
        verifyScope: async (token: OAuth2Server.Token, scope: string): Promise<boolean> => {
            return true;
        },
        getAuthorizationCode: async (authorizationCode: string): Promise<OAuth2Server.AuthorizationCode> => {
            return {
                authorizationCode,
                expiresAt: new Date(),
                redirectUri: "www.test.com",
                client: {id: "testClient", grants: ["access_token"]},
                user: {id: "testUser"}
            };
        },
        saveAuthorizationCode: async (code: OAuth2Server.AuthorizationCode, client: OAuth2Server.Client, user: OAuth2Server.User): Promise<OAuth2Server.AuthorizationCode> => {
            return code;
        },
        revokeAuthorizationCode: async (code: OAuth2Server.AuthorizationCode): Promise<boolean> => {
            return true;
        }
    };*/


    /*const thing: OAuth2Server.AuthorizationCodeModel = {

    };
    const model: OAuth2Server.AuthorizationCodeModel = {
        // We support returning promises.
        getAccessToken: function() {
            return new Promise('works!');
        },

        // Or, calling a Node-style callback.
        getAuthorizationCode: function(done) {
            done(null, 'works!');
        },

        // Or, using generators.
        getClient: function*() {
            //yield somethingAsync();
            return 'works!';
        },

        // Or, async/wait (using Babel).
        getUser: async function() {
            //await somethingAsync();
            return 'works!';
        }
    };*/

    /*const oauth2Server = new OAuth2Server({
        model: oauth2Model
        //model: model
    });*/

    /*validateScope
    revokeAuthorizationCode
    saveAuthorizationCode
    getAuthorizationCode*/

    app.use(bodyParser.urlencoded({ extended: true }));

    const oauth2AuthroizationCodeModel: OAuth2Server.AuthorizationCodeModel = {
        getClient: async (clientId: string, clientSecret: string): Promise<OAuth2Server.Client | OAuth2Server.Falsey> => {
            //'SELECT client_id, client_secret, redirect_uri FROM oauth_clients WHERE client_id = $1 AND client_secret = $2'
            //console.log(clientId + " " + clientSecret);
            //return await OauthClients.findOne({client_id: clientId, client_secret: clientSecret})
            return await OauthClients.findOne({client_id: clientId})
                .then( (client) => {
                    //console.log(client);
                    return {
                        id: client.client_id,
                        redirectUris: [],//[client.redirect_uri],
                        grants: ['password']
                    }
                }).catch(undefined);
        },
        saveToken: async (token: OAuth2Server.Token, client: OAuth2Server.Client, user: OAuth2Server.User): Promise<OAuth2Server.Token> => {
            //'INSERT INTO oauth_tokens(access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id) VALUES ($1, $2, $3, $4)'
            let oauthToken = new OauthTokens();

            return Users.findOneById(user.id).then((user) => {
                oauthToken.access_token = token.accessToken;
                oauthToken.access_token_expires_on = token.accessTokenExpiresAt;
                oauthToken.client_id = client.id;
                oauthToken.refresh_token = token.refreshToken;
                oauthToken.refresh_token_expires_on = token.refreshTokenExpiresAt;
                oauthToken.user = user;
                return oauthToken.save().then(() => token);

            });
        },
        getAccessToken: async (accessToken: string): Promise<OAuth2Server.Token> => {
            //'SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE access_token = $1'
            console.log(accessToken);
            return OauthTokens.findOne({access_token: accessToken}).then((token) => {
                return Users.findOneById(token.user.id).then((user) => {
                    return {
                        accessToken: token.access_token,
                        client: {id: token.client_id, grants: ['password']},
                        expires: token.access_token_expires_on,
                        user: {id: user.id}
                    }
                });
            })
        },
        verifyScope: async (token: OAuth2Server.Token, scope: string): Promise<boolean> => {
            return true;
        },
        getAuthorizationCode: async (authorizationCode: string): Promise<OAuth2Server.AuthorizationCode> => {
            return OauthAuthorizationCodes.findOne({authorization_code: authorizationCode}).then((authCode) => {
                return {
                    authorizationCode,
                    expiresAt: new Date(),
                    redirectUri: "",
                    client: {id: "lolz", grants: ["access_token"]},
                    user: {id: authCode.user.id}
                };
            });
        },
        saveAuthorizationCode: async (code: OAuth2Server.AuthorizationCode, client: OAuth2Server.Client, user: OAuth2Server.User): Promise<OAuth2Server.AuthorizationCode> => {
            let oauthAuthorizationCode = new OauthAuthorizationCodes();
            return Users.findOneById(user.id).then((user) => {
                oauthAuthorizationCode.user = user;
                oauthAuthorizationCode.authorization_code = code.authorizationCode;
                oauthAuthorizationCode.expires = code.expiresAt;
                return oauthAuthorizationCode.save().then(() => code);

            });
        },
        revokeAuthorizationCode: async (code: OAuth2Server.AuthorizationCode): Promise<boolean> => {
            return true;
        }
    };

    const oauth2PasswordModel: OAuth2Server.PasswordModel = {
        getUser: async (username: string, password: string): Promise<OAuth2Server.User | OAuth2Server.Falsey> => {
            return Users.findOne({username: username, password: password})
                .then((user) => {
                    return {id: user.id}
                });
        },
        getClient: async (clientId: string, clientSecret: string): Promise<OAuth2Server.Client | OAuth2Server.Falsey> => {
            //'SELECT client_id, client_secret, redirect_uri FROM oauth_clients WHERE client_id = $1 AND client_secret = $2'
            //console.log(clientId + " " + clientSecret);
            return await OauthClients.findOne({client_id: clientId, client_secret: clientSecret})
            //return await OauthClients.findOne({client_id: clientId})
                .then( (client) => {
                    return {
                        id: client.client_id,
                        //redirectUris: [],//[client.redirect_uri],
                        grants: ['password']// todo: db call for related grants
                    }
                }).catch(undefined);
        },
        saveToken: async (token: OAuth2Server.Token, client: OAuth2Server.Client, user: OAuth2Server.User): Promise<OAuth2Server.Token> => {
            //'INSERT INTO oauth_tokens(access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id) VALUES ($1, $2, $3, $4)'
            let oauthToken = new OauthTokens();

            return Users.findOneById(user.id).then((user) => {
                oauthToken.access_token = token.accessToken;
                oauthToken.access_token_expires_on = token.accessTokenExpiresAt;
                oauthToken.client_id = client.id;
                oauthToken.refresh_token = token.refreshToken;
                oauthToken.refresh_token_expires_on = token.refreshTokenExpiresAt;
                oauthToken.user = user;
                return oauthToken.save().then(() => token);

            });
        },
        getAccessToken: async (accessToken: string): Promise<OAuth2Server.Token> => {
            //'SELECT access_token, access_token_expires_on, client_id, refresh_token, refresh_token_expires_on, user_id FROM oauth_tokens WHERE access_token = $1'
            console.log(accessToken);
            return OauthTokens.findOne({access_token: accessToken}).then((token) => {
                return Users.findOneById(token.user.id).then((user) => {
                    return {
                        accessToken: token.access_token,
                        client: {id: token.client_id, grants: ['password']},
                        expires: token.access_token_expires_on,
                        user: {id: user.id}
                    }
                });
            })
        },
        verifyScope: async (token: OAuth2Server.Token, scope: string): Promise<boolean> => {
            return true;
        },
    };

    const oauth2Server = new OAuth2Server({
        model: oauth2PasswordModel
    });


    app.post('/oauth/token', (req, res) => {

        const request = new OAuth2Server.Request(req);
        const response = new OAuth2Server.Response(res);

        console.log(request.body);

        oauth2Server.token(request, response)
            .then((success: OAuth2Server.Token) => {
                res.json(success);
            }).catch((err: any) => {
                console.log(err);
                res.status(err.code || 500).json(err);
            });

    });


    app.get('/oauth2/authorize', (req, res) => {
        const request = new OAuth2Server.Request(req);
        const response = new OAuth2Server.Response(res);


        oauth2Server.authorize(request, response)
            .then((success: OAuth2Server.AuthorizationCode) => {
                res.json(success);
            }).catch((err: any) => {
                console.log(err);
                res.status(err.code || 500).json(err);
            });
    });


    /*app.post('/oauth2/authorize', (req, res) => {
        const request = new OAuth2Server.Request(req);
        const response = new OAuth2Server.Response(res);

        oauth2Server.authorize(request, response)
            .then((success: OAuth2Server.AuthorizationCode) => {
                res.json(success);
            }).catch((err: any) => {
            res.status(err.code || 500).json(err);
        });
    });

    app.all('/oauth2/token', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const request = new OAuth2Server.Request(req);
        const response = new OAuth2Server.Response(res);

        //oauth2Server.

        oauth2Server.token(request, response)
            .then((token: OAuth2Server.Token) => {
                res.json(token);
            }).catch((err: any) => {
            res.status(err.code || 500).json(err);
        });
    });*/

    app.listen(3000, () => console.log('Comic Cloud API listening on port 3000!'));


}).catch(error => console.log("TypeORM connection error: ", error));

