import "whatwg-fetch";
import cache from "memory-cache";
// import { createHash } from "crypto"
import { SHA256, enc } from 'crypto-js';
import {
  userEquityResponseTransform
} from "./apiEndpoint.types";
import MasterConfix from "../../../setup/MasterConfix"



/**
 * Trade API client service, provides integration to API endpoints.
 *
 * @constructor
 * @public
 * @class TradeApiClient
 */
class ApiEndpoint {
  /**
   * Creates an instance of TradeApiClient.
   * @memberof TradeApiClient
   */

  baseUrlv1:any;
  baseUrlv2:any;
  requestAverageLatency:any;
  requestLock:any;
  token:any;

  constructor() {
    this.baseUrlv1 = MasterConfix.API_BASE_ENDPOINT;
    this.baseUrlv2 = MasterConfix.API_BASE_ENDPOINT_V2;

    /**
     * @type {Object<string, number>} Tracks request average latency.
     */
    this.requestAverageLatency = {};

    /**
     * @type {Object<string, boolean>} Tracks request lock.
     */
    this.requestLock = {};
  }

  /**
   * Set authentication token
   * @param {string} [token] Token
   * @returns {void}
   */
  setToken(token:any) {
    this.token = token;
  }

  /**
   * Generate a request unique cache ID.
   *
   * The ID will be unique for the requested endpoint with same payload
   * parameters so endpoints like getClosedPositions which resolve close/log
   * with different average latency could be differentiated.
   *
   * @param {string} endpointPath Endpoint path of the request.
   * @param {string} payload Request payload JSON stringified or empty string.
   * @returns {string} Request cache ID.
   *
   * @memberof TradeApiClient
   */
  generateRequestCacheId(endpointPath:any, payload:any) {
    // const payloadHash = createHash("md5").update(payload).digest("hex");
    const payloadHash = SHA256(payload).toString(enc.Hex);

    const cacheId = `${endpointPath}-${payloadHash}`;

    return cacheId;
  }

  /**
   * Get a request lock.
   *
   * When lock is active will prevent that the same (endpoint and payload)
   * request is performed concurrently so when latency is higuer than interval
   * we prevent that piled up request process concurrently.
   *
   * @param {string} cacheId Request cache ID (endpoint-payload md5 hash) to get lock for.
   * @returns {boolean} True when lock was acquired, false when existing lock is in place.
   *
   * @memberof TradeApiClient
   */
  getRequestLock(cacheId:any) {
    if (this.requestLock[cacheId]) {
      return false;
    }

    this.requestLock[cacheId] = true;

    // Timeout to automatically release the lock.
    // setTimeout(() => {
    //   this.releaseRequestLock(cacheId);
    // }, timeout);

    return true;
  }

  /**
   * Release request lock.
   *
   * @param {string} cacheId Request cache ID (endpoint-payload md5 hash) to get lock for.
   * @returns {Void} None.
   *
   * @memberof TradeApiClient
   */
  releaseRequestLock(cacheId:any) {
    if (this.requestLock[cacheId]) {
      delete this.requestLock[cacheId];
    }
  }

  /**
   * Store endpoint average latency.
   *
   * @param {string} cacheId Request cache ID (endpoint-payload md5 hash) to store latency for.
   * @param {number} latencyMillisec Latest request latency expressed in milliseconds.
   * @returns {void} None.
   *
   * @memberof TradeApiClient
   */
  setRequestAverageLatency(cacheId:any, latencyMillisec:any) {
    // Calculate average when there are previous observations.
    if (this.requestAverageLatency[cacheId]) {
      // Tolerance to account for other delays like response decode / error handling.
      const tolerance = 500;
      const currentAverage = this.requestAverageLatency[cacheId];
      const newAverage = (currentAverage + latencyMillisec) / 2;
      this.requestAverageLatency[cacheId] = newAverage + tolerance;

      return;
    }

    // Is the first observation.
    this.requestAverageLatency[cacheId] = latencyMillisec;
  }

  /**
   * Get similar request historical average latency.
   *
   * @param {string} cacheId Request cache ID (endpoint-payload md5 hash) to store latency for.
   * @returns {number} Average latency time in milliseconds.
   *
   * @memberof TradeApiClient
   */
  getRequestAverageLatency(cacheId:any) {
    // Default to 5 seconds when no previous average exists so when initial
    // request don't respond, and we don't have average time, we ensure to have
    // a minimum limit to avoid stampede requests.
    return this.requestAverageLatency[cacheId] || 5000;
  }

  /**
   * Throw too many requests exception.
   *
   * This error throws when duplicated requests to same endpoint and parameters
   * are accumulated due to increased latency of backend.
   *
   * @returns {any} Error object.
   *
   * @memberof TradeApiClient
   */
  tooManyRequestsError() {
    return {
      error: "Too many requests.",
      code: "apilatency",
    };
  }

  /**
   * Resolve response from cache and fail when data not found within timeout.
   *
   * @param {string} cacheId Request cache ID (endpoint-payload md5 hash) to store latency for.
   *
   * @returns {Promise<any>} Request cached response.
   */
  async resolveFromCache(cacheId:any) {
    // const timeout = 10000;
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const responseData = cache.get(cacheId);
        if (responseData) {
          // console.log(`Request ${cacheId} resolved from cache:`, responseData);
          resolve(responseData);
          clearInterval(checkInterval);
        }
      }, 100);

      // Timeout exceeded, this means higher than expected latency in backend.
      //   setTimeout(() => {
      //     clearInterval(checkInterval);
      //     reject(this.tooManyRequestsError());
      //   }, timeout);
    });
  }

  /**
   * @param {string} endpointPath
   * @param {number} apiVersion
   * @return {string} url
   */
  getUrl(endpointPath:any, apiVersion:any) {
    let baseUrl = this.baseUrlv2;
    if (apiVersion === 1) {
      // Old api
      baseUrl = this.baseUrlv1;
    } else if (apiVersion === 0) {
      // Cloudflare url
      baseUrl = baseUrl.split("/new_api")[0];
    } else if (apiVersion === 3) {
      baseUrl = process.env.GATSBY_WALLETAPI_URL;
    }

    return baseUrl + endpointPath;
  }

  /**
   * Process API HTTP request.
   *
   * @param {string} endpointPath API endpoint path and action.
   * @param {*} [payload] Request payload parameters object.
   * @param {string} [method] Request HTTP method, currently used only for cache purposes.
   * @param {number} [apiVersion] API to call (0=CF, 1=old, 2=new)
   * @param {string|boolean} [token] Optional authentication token (false to force no token).
   * @returns {Promise<*>} Promise that resolves Trade API request response.
   *
   * @memberof TradeApiClient
   */
  async doRequest(endpointPath:any, payload:any, method = "POST", apiVersion = 2, token:any) {
    let requestUrl = this.getUrl(endpointPath, apiVersion);
    let responseData = {"error":{ 'code': 0, 'error':''}};

    const authToken = token !== false ? token || this.token : null;

    /**
     * @type {*}
     */
    let options:{method:string, body?:any, mode:any, headers?:any} = {
      method: method,
      mode: 'cors' as RequestMode,
      body: '',
      headers: {
        "Content-Type": "application/json",
        "x-api-key": MasterConfix.APP_API_BASE_KEY || "",
        ...(authToken && { Authorization: "Bearer " + authToken }),
      },
    };
  
    if (method === "GET") {
      delete options.body;
      delete options.headers;
      if (payload) {
        requestUrl += `?${new URLSearchParams(
          payload.page ? { ...payload, pag_format: "body" } : payload,
        )}`;
      }
    } else {
      options.body = JSON.stringify(payload);
    }

    const cacheId = this.generateRequestCacheId(requestUrl, options.body || "");
    if (method === "GET") {
      let cacheResponseData = cache.get(cacheId);
      if (cacheResponseData) {
        return cacheResponseData;
      }

      // When duplicated request is running try during interval to resolve the
      // response from the other process cache.
      if (!this.getRequestLock(cacheId)) {
        cacheResponseData = await this.resolveFromCache(cacheId);
        if (cacheResponseData) {
          return cacheResponseData;
        }
      }
    }

    try {
      const startTime = Date.now();
      console.log(requestUrl, "::options>>>", options)
      const response = await fetch(requestUrl, options);
      const elapsedTime = Date.now() - startTime;
      this.setRequestAverageLatency(cacheId, elapsedTime);

      const parsedJson = await response.json();
      if (response.status === 200 || response.status === 201) {
        responseData = parsedJson;
      } else {
        responseData.error = parsedJson;
        if (response.status === 429) {
          // Cloudflare rate limit
          responseData.error.code = 10000;
        }
      }

      // Currently method is not taking the real effect on the HTTP method we
      // use, and it's unique effect for now is to control when a endpoint
      // request should be cached or not. We need to do some refactorings in the
      // backend to properly manage the method usage.
      if (method === "GET") {
        const cacheTTL = this.getRequestAverageLatency(cacheId);
        cache.put(cacheId, responseData, cacheTTL);
        this.releaseRequestLock(cacheId);
        // console.log(`Request ${cacheId} performed - TTL ${cacheTTL}:`, responseData);
      }
    } catch (e:any) {
      responseData.error = e.message;
    }

    if (responseData.error) {
      const customError = responseData.error.error || responseData.error;
    //   if (customError.code === 13) {
    //     // Session expired
    //     // navigateLogin();
    //   }

      throw customError;
    }

    return responseData;
  }

  /**
   * Download file
   * @param {string} endpointPath
   * @param {number} apiVersion
   * @param {string} filename
   * @returns {Promise<any>}
   */
  downloadFile(endpointPath:any, apiVersion:any, filename:any) {
    const requestUrl = this.getUrl(endpointPath, apiVersion);
    return fetch(requestUrl, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + this.token,
        // "Content-Type": "application/json",
      },
    })
      .then((res) => res.blob())
      .then((blob) => URL.createObjectURL(blob))
      .then((href) => {
        Object.assign(document.createElement("a"), {
          href,
          download: filename,
        }).click();
      });
  }

  /**
   * Login a user in Trade API.
   *
   * @param {UserLoginPayload} payload User login payload
   *
   * @returns {Promise<LoginResponse>} Promise that resolves user entity.
   *
   * @memberof TradeApiClient
   */
  async userLogin(payload:any) {
    return this.doRequest("/login", payload, "POST", 2, false);
  }

  async getStrategiesList(payload:any) {
    return await this.doRequest("/api/v1/strategies/get", payload, "GET", 2, false);
  }

  async getStrategiesByRisk(payload:any) {
    return await this.doRequest("/api/v1/strategy/risktype", payload, "POST", 2, false);
  }

  async getConnections(payload:any) {
    return this.doRequest("/connections/get", payload, "GET", 2, false);
  }

  async createConnections(payload:any) {
    return this.doRequest("/connections/create", payload, "POST", 2, false);
  }

  async getUserNotifications(payload:any) {
    return this.doRequest("/notifications/get", payload, "GET", 2, false);
  }

  async createUserNotifications(payload:any) {
    return this.doRequest("/notifications/create", payload, "POST", 2, false);
  }

  async createSubscription(payload:any) {
    return this.doRequest("/subscription/create", payload, "POST", 2, false);
  }

  async getUserAccountBalance(payload:any) {
    return this.doRequest("/account_balance/get", payload, "GET", 2, false);
  }

  

} //close ApiEndpoint class


// JS export by default guarantee a singleton instance if we export the class
// instance, see:
// https://medium.com/@lazlojuly/are-node-js-modules-singletons-764ae97519af
const apiEndpoint = new ApiEndpoint();
// Object.freeze(client);

export default apiEndpoint;