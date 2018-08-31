/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var apigClientFactory = {};
apigClientFactory.newClient = function (config) {
    var apigClient = { };
    if(config === undefined) {
        config = {
            accessKey: '',
            secretKey: '',
            sessionToken: '',
            region: '',
            apiKey: undefined,
            defaultContentType: 'application/json',
            defaultAcceptType: 'application/json'
        };
    }
    if(config.accessKey === undefined) {
        config.accessKey = '';
    }
    if(config.secretKey === undefined) {
        config.secretKey = '';
    }
    if(config.apiKey === undefined) {
        config.apiKey = '';
    }
    if(config.sessionToken === undefined) {
        config.sessionToken = '';
    }
    if(config.region === undefined) {
        config.region = 'us-east-1';
    }
    //If defaultContentType is not defined then default to application/json
    if(config.defaultContentType === undefined) {
        config.defaultContentType = 'application/json';
    }
    //If defaultAcceptType is not defined then default to application/json
    if(config.defaultAcceptType === undefined) {
        config.defaultAcceptType = 'application/json';
    }

    
    // extract endpoint and path from url
    var invokeUrl = 'https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev';
    var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
    var pathComponent = invokeUrl.substring(endpoint.length);

    var sigV4ClientConfig = {
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        sessionToken: config.sessionToken,
        serviceName: 'execute-api',
        region: config.region,
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var authType = 'NONE';
    if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
        authType = 'AWS_IAM';
    }

    var simpleHttpClientConfig = {
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);
    
    
    
    apigClient.rootOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var rootOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(rootOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.groupGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var groupGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/group').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(groupGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.groupCreatePost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var groupCreatePostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/group/create').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(groupCreatePostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.groupUpdatePost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var groupUpdatePostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/group/update').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(groupUpdatePostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.groupSportYearIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['sport', 'year', 'id'], ['body']);
        
        var groupSportYearIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/group/{sport}/{year}/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['sport', 'year', 'id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(groupSportYearIdGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.groupSportYearIdPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['sport', 'year', 'id'], ['body']);
        
        var groupSportYearIdPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/group/{sport}/{year}/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['sport', 'year', 'id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(groupSportYearIdPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.groupSportYearIdOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var groupSportYearIdOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/group/{sport}/{year}/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(groupSportYearIdOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.nflWeekGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var nflWeekGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/nfl/week').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(nflWeekGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.nflWeekOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var nflWeekOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/nfl/week').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(nflWeekOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.nflWeekAnonGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var nflWeekAnonGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/nfl/week/anon').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(nflWeekAnonGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.nflWeekAnonOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var nflWeekAnonOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/nfl/week/anon').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(nflWeekAnonOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.nflYearWeekGamesGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['week', 'year'], ['body']);
        
        var nflYearWeekGamesGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/nfl/{year}/{week}/games').expand(apiGateway.core.utils.parseParametersToObject(params, ['week', 'year'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(nflYearWeekGamesGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.nflYearWeekGamesOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var nflYearWeekGamesOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/nfl/{year}/{week}/games').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(nflYearWeekGamesOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.nflYearWeekGamesAnonGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['week', 'year'], ['body']);
        
        var nflYearWeekGamesAnonGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/nfl/{year}/{week}/games/anon').expand(apiGateway.core.utils.parseParametersToObject(params, ['week', 'year'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(nflYearWeekGamesAnonGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.nflYearWeekGamesAnonOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var nflYearWeekGamesAnonOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/nfl/{year}/{week}/games/anon').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(nflYearWeekGamesAnonOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.nflYearWeekLeaderboardsGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['week', 'year'], ['body']);
        
        var nflYearWeekLeaderboardsGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/nfl/{year}/{week}/leaderboards').expand(apiGateway.core.utils.parseParametersToObject(params, ['week', 'year'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(nflYearWeekLeaderboardsGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.nflYearWeekLeaderboardsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var nflYearWeekLeaderboardsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/nfl/{year}/{week}/leaderboards').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(nflYearWeekLeaderboardsOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.predictionsPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        console.log("body:", body)
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var predictionsPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/predictions').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(predictionsPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.predictionsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var predictionsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/predictions').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(predictionsOptionsRequest, authType, additionalParams, config.apiKey);
    };
    

    return apigClient;
};
