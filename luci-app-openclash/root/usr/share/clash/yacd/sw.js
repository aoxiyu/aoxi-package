var e=Object.defineProperty,t=Object.defineProperties,s=Object.getOwnPropertyDescriptors,a=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable,i=(t,s,a)=>s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[s]=a,c=(e,t)=>{for(var s in t||(t={}))n.call(t,s)&&i(e,s,t[s]);if(a)for(var s of a(t))r.call(t,s)&&i(e,s,t[s]);return e},o=(e,a)=>t(e,s(a));try{self["workbox:core:6.1.5"]&&_()}catch(J){}const h=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s};class l extends Error{constructor(e,t){super(h(e,t)),this.name=e,this.details=t}}const u=new Set;const d={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},p=e=>[d.prefix,e,d.suffix].filter((e=>e&&e.length>0)).join("-"),f=e=>e||p(d.precache),g=e=>e||p(d.runtime);function w(e,t){const s=new URL(e);for(const a of t)s.searchParams.delete(a);return s.href}let y;function m(e){e.then((()=>{}))}class b{constructor(e,t,{onupgradeneeded:s,onversionchange:a}={}){this._db=null,this._name=e,this._version=t,this._onupgradeneeded=s,this._onversionchange=a||(()=>this.close())}get db(){return this._db}async open(){if(!this._db)return this._db=await new Promise(((e,t)=>{let s=!1;setTimeout((()=>{s=!0,t(new Error("The open request was blocked and timed out"))}),this.OPEN_TIMEOUT);const a=indexedDB.open(this._name,this._version);a.onerror=()=>t(a.error),a.onupgradeneeded=e=>{s?(a.transaction.abort(),a.result.close()):"function"==typeof this._onupgradeneeded&&this._onupgradeneeded(e)},a.onsuccess=()=>{const t=a.result;s?t.close():(t.onversionchange=this._onversionchange.bind(this),e(t))}})),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){return(await this.getAllMatching(e,{query:t,count:s,includeKeys:!0})).map((e=>e.key))}async getAllMatching(e,{index:t,query:s=null,direction:a="next",count:n,includeKeys:r=!1}={}){return await this.transaction([e],"readonly",((i,c)=>{const o=i.objectStore(e),h=t?o.index(t):o,l=[],u=h.openCursor(s,a);u.onsuccess=()=>{const e=u.result;e?(l.push(r?e:e.value),n&&l.length>=n?c(l):e.continue()):c(l)}}))}async transaction(e,t,s){return await this.open(),await new Promise(((a,n)=>{const r=this._db.transaction(e,t);r.onabort=()=>n(r.error),r.oncomplete=()=>a(),s(r,(e=>a(e)))}))}async _call(e,t,s,...a){return await this.transaction([t],s,((s,n)=>{const r=s.objectStore(t),i=r[e].apply(r,a);i.onsuccess=()=>n(i.result)}))}close(){this._db&&(this._db.close(),this._db=null)}}b.prototype.OPEN_TIMEOUT=2e3;const R={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[_,z]of Object.entries(R))for(const e of z)e in IDBObjectStore.prototype&&(b.prototype[e]=async function(t,...s){return await this._call(e,t,_,...s)});class v{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}function x(e,t){const s=t();return e.waitUntil(s),s}async function C(e,t){let s=null;if(e.url){s=new URL(e.url).origin}if(s!==self.location.origin)throw new l("cross-origin-copy-response",{origin:s});const a=e.clone(),n={headers:new Headers(a.headers),status:a.status,statusText:a.statusText},r=t?t(n):n,i=function(){if(void 0===y){const t=new Response("");if("body"in t)try{new Response(t.body),y=!0}catch(e){y=!1}y=!1}return y}()?a.body:await a.blob();return new Response(i,r)}try{self["workbox:expiration:6.1.5"]&&_()}catch(J){}const U=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class q{constructor(e){this._cacheName=e,this._db=new b("workbox-expiration",1,{onupgradeneeded:e=>this._handleUpgrade(e)})}_handleUpgrade(e){const t=e.target.result.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1}),(async e=>{await new Promise(((t,s)=>{const a=indexedDB.deleteDatabase(e);a.onerror=()=>{s(a.error)},a.onblocked=()=>{s(new Error("Delete blocked"))},a.onsuccess=()=>{t()}}))})(this._cacheName)}async setTimestamp(e,t){const s={url:e=U(e),timestamp:t,cacheName:this._cacheName,id:this._getId(e)};await this._db.put("cache-entries",s)}async getTimestamp(e){return(await this._db.get("cache-entries",this._getId(e))).timestamp}async expireEntries(e,t){const s=await this._db.transaction("cache-entries","readwrite",((s,a)=>{const n=s.objectStore("cache-entries").index("timestamp").openCursor(null,"prev"),r=[];let i=0;n.onsuccess=()=>{const s=n.result;if(s){const a=s.value;a.cacheName===this._cacheName&&(e&&a.timestamp<e||t&&i>=t?r.push(s.value):i++),s.continue()}else a(r)}})),a=[];for(const n of s)await this._db.delete("cache-entries",n.id),a.push(n.url);return a}_getId(e){return this._cacheName+"|"+U(e)}}class T{constructor(e,t={}){this._isRunning=!1,this._rerunRequested=!1,this._maxEntries=t.maxEntries,this._maxAgeSeconds=t.maxAgeSeconds,this._matchOptions=t.matchOptions,this._cacheName=e,this._timestampModel=new q(e)}async expireEntries(){if(this._isRunning)return void(this._rerunRequested=!0);this._isRunning=!0;const e=this._maxAgeSeconds?Date.now()-1e3*this._maxAgeSeconds:0,t=await this._timestampModel.expireEntries(e,this._maxEntries),s=await self.caches.open(this._cacheName);for(const a of t)await s.delete(a,this._matchOptions);this._isRunning=!1,this._rerunRequested&&(this._rerunRequested=!1,m(this.expireEntries()))}async updateTimestamp(e){await this._timestampModel.setTimestamp(e,Date.now())}async isURLExpired(e){if(this._maxAgeSeconds){return await this._timestampModel.getTimestamp(e)<Date.now()-1e3*this._maxAgeSeconds}return!1}async delete(){this._rerunRequested=!1,await this._timestampModel.expireEntries(1/0)}}try{self["workbox:precaching:6.1.5"]&&_()}catch(J){}function L(e){if(!e)throw new l("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:t,url:s}=e;if(!s)throw new l("add-to-cache-list-unexpected-type",{entry:e});if(!t){const e=new URL(s,location.href);return{cacheKey:e.href,url:e.href}}const a=new URL(s,location.href),n=new URL(s,location.href);return a.searchParams.set("__WB_REVISION__",t),{cacheKey:a.href,url:n.href}}class E{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class k{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=t&&t.cacheKey||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s):e},this._precacheController=e}}try{self["workbox:strategies:6.1.5"]&&_()}catch(J){}function N(e){return"string"==typeof e?new Request(e):e}class K{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new v,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const s of this._plugins)this._pluginStateMap.set(s,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:t}=this;let s=N(e);if("navigate"===s.mode&&t instanceof FetchEvent&&t.preloadResponse){const e=await t.preloadResponse;if(e)return e}const a=this.hasCallback("fetchDidFail")?s.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))s=await e({request:s.clone(),event:t})}catch(r){throw new l("plugin-error-request-will-fetch",{thrownError:r})}const n=s.clone();try{let e;e=await fetch(s,"navigate"===s.mode?void 0:this._strategy.fetchOptions);for(const s of this.iterateCallbacks("fetchDidSucceed"))e=await s({event:t,request:n,response:e});return e}catch(i){throw a&&await this.runCallbacks("fetchDidFail",{error:i,event:t,originalRequest:a.clone(),request:n.clone()}),i}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=N(e);let s;const{cacheName:a,matchOptions:n}=this._strategy,r=await this.getCacheKey(t,"read"),i=c(c({},n),{cacheName:a});s=await caches.match(r,i);for(const c of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await c({cacheName:a,matchOptions:n,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(e,t){const s=N(e);var a;await(a=0,new Promise((e=>setTimeout(e,a))));const n=await this.getCacheKey(s,"write");if(!t)throw new l("cache-put-with-no-response",{url:(r=n.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const i=await this._ensureResponseSafeToCache(t);if(!i)return!1;const{cacheName:h,matchOptions:d}=this._strategy,p=await self.caches.open(h),f=this.hasCallback("cacheDidUpdate"),g=f?await async function(e,t,s,a){const n=w(t.url,s);if(t.url===n)return e.match(t,a);const r=o(c({},a),{ignoreSearch:!0}),i=await e.keys(t,r);for(const c of i)if(n===w(c.url,s))return e.match(c,a)}(p,n.clone(),["__WB_REVISION__"],d):null;try{await p.put(n,f?i.clone():i)}catch(y){throw"QuotaExceededError"===y.name&&await async function(){for(const e of u)await e()}(),y}for(const c of this.iterateCallbacks("cacheDidUpdate"))await c({cacheName:h,oldResponse:g,newResponse:i.clone(),request:n,event:this.event});return!0}async getCacheKey(e,t){if(!this._cacheKeys[t]){let s=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))s=N(await e({mode:t,request:s,event:this.event,params:this.params}));this._cacheKeys[t]=s}return this._cacheKeys[t]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),a=a=>{const n=o(c({},a),{state:s});return t[e](n)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve()}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const a of this.iterateCallbacks("cacheWillUpdate"))if(t=await a({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class P{constructor(e={}){this.cacheName=g(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,n=new K(this,{event:t,request:s,params:a}),r=this._getResponse(n,s,t);return[r,this._awaitComplete(r,n,s,t)]}async _getResponse(e,t,s){let a;await e.runCallbacks("handlerWillStart",{event:s,request:t});try{if(a=await this._handle(t,e),!a||"error"===a.type)throw new l("no-response",{url:t.url})}catch(n){for(const r of e.iterateCallbacks("handlerDidError"))if(a=await r({error:n,event:s,request:t}),a)break;if(!a)throw n}for(const r of e.iterateCallbacks("handlerWillRespond"))a=await r({event:s,request:t,response:a});return a}async _awaitComplete(e,t,s,a){let n,r;try{n=await e}catch(i){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:n}),await t.doneWaiting()}catch(c){r=c}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:n,error:r}),t.destroy(),r)throw r}}class M extends P{constructor(e={}){e.cacheName=f(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(M.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){const s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let s;if(!this._fallbackToNetwork)throw new l("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return s=await t.fetch(e),s}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();const s=await t.fetch(e);if(!(await t.cachePut(e,s.clone())))throw new l("bad-precaching-response",{url:e.url,status:s.status});return s}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,a]of this.plugins.entries())a!==M.copyRedirectedCacheableResponsesPlugin&&(a===M.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push(M.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}M.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},M.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await C(e):e};class O{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new M({cacheName:f(e),plugins:[...t,new k({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const t=[];for(const s of e){"string"==typeof s?t.push(s):s&&void 0===s.revision&&t.push(s.url);const{cacheKey:e,url:a}=L(s),n="string"!=typeof s&&s.revision?"reload":"default";if(this._urlsToCacheKeys.has(a)&&this._urlsToCacheKeys.get(a)!==e)throw new l("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(a),secondEntry:e});if("string"!=typeof s&&s.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==s.integrity)throw new l("add-to-cache-list-conflicting-integrities",{url:a});this._cacheKeysToIntegrities.set(e,s.integrity)}if(this._urlsToCacheKeys.set(a,e),this._urlsToCacheModes.set(a,n),t.length>0){const e=`Workbox is precaching URLs without revision info: ${t.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return x(e,(async()=>{const t=new E;this.strategy.plugins.push(t);for(const[n,r]of this._urlsToCacheKeys){const t=this._cacheKeysToIntegrities.get(r),s=this._urlsToCacheModes.get(n),a=new Request(n,{integrity:t,cache:s,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:r},request:a,event:e}))}const{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}}))}activate(e){return x(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(const n of t)s.has(n.url)||(await e.delete(n),a.push(n.url));return{deletedURLs:a}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.strategy.cacheName)).match(s)}}createHandlerBoundToURL(e){const t=this.getCacheKeyForURL(e);if(!t)throw new l("non-precached-url",{url:e});return s=>(s.request=new Request(e),s.params=c({cacheKey:t},s.params),this.strategy.handle(s))}}let A;const S=()=>(A||(A=new O),A);try{self["workbox:routing:6.1.5"]&&_()}catch(J){}const D=e=>e&&"object"==typeof e?e:{handle:e};class W{constructor(e,t,s="GET"){this.handler=D(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=D(e)}}class I extends W{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class j{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const a=s.origin===location.origin,{params:n,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:a,url:s});let i=r&&r.handler;const c=e.method;if(!i&&this._defaultHandlerMap.has(c)&&(i=this._defaultHandlerMap.get(c)),!i)return;let o;try{o=i.handle({url:s,request:e,event:t,params:n})}catch(l){o=Promise.reject(l)}const h=r&&r.catchHandler;return o instanceof Promise&&(this._catchHandler||h)&&(o=o.catch((async a=>{if(h)try{return await h.handle({url:s,request:e,event:t,params:n})}catch(r){a=r}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw a}))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:a}){const n=this._routes.get(s.method)||[];for(const r of n){let n;const i=r.match({url:e,sameOrigin:t,request:s,event:a});if(i)return n=i,(Array.isArray(i)&&0===i.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(n=void 0),{route:r,params:n}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,D(e))}setCatchHandler(e){this._catchHandler=D(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new l("unregister-route-but-not-found-with-method",{method:e.method});const t=this._routes.get(e.method).indexOf(e);if(!(t>-1))throw new l("unregister-route-route-not-registered");this._routes.get(e.method).splice(t,1)}}let H;function F(e,t,s){let a;if("string"==typeof e){const n=new URL(e,location.href);a=new W((({url:e})=>e.href===n.href),t,s)}else if(e instanceof RegExp)a=new I(e,t,s);else if("function"==typeof e)a=new W(e,t,s);else{if(!(e instanceof W))throw new l("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});a=e}return(H||(H=new j,H.addFetchListener(),H.addCacheListener()),H).registerRoute(a),a}class B extends W{constructor(e,t){super((({request:s})=>{const a=e.getURLsToCacheKeys();for(const e of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:a=!0,urlManipulation:n}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const i=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(r,t);if(yield i.href,s&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=s,yield e.href}if(a){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(n){const e=n({url:r});for(const t of e)yield t.href}}(s.url,t)){const t=a.get(e);if(t)return{cacheKey:t}}}),e.strategy)}}const $={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};var G;self.addEventListener("activate",(()=>self.clients.claim())),function(e){S().precache(e)}([{"revision":"ab6713e9359e738e073d6488c240e80f","url":"assets/Chart.min.54d214d7.js"},{"revision":"79e75acb4004d16f27e49c4670b3a88e","url":"assets/Config.c65424c9.css"},{"revision":"76268822fa2c8e9aeb9e6fbd5d0c76ce","url":"assets/Config.c7872d50.js"},{"revision":"a3c15e2d4c863fa3aafc517cc2bdd623","url":"assets/Connections.2596eb6e.js"},{"revision":"c9fbe46c74e10aab642a824cae8a8f47","url":"assets/Connections.8f8baf6a.css"},{"revision":"43261e1b96999b302a4b89b86c00dfb7","url":"assets/debounce.cc85a806.js"},{"revision":"6262ab6334018d97c6f3c7f5553485ac","url":"assets/en.41adc249.js"},{"revision":"b0d7ef825db5f9d5024a0ecd5719af5b","url":"assets/Fab.84de8b7d.js"},{"revision":"74cefdb025e01b0f1eb1a72d68b51b07","url":"assets/Fab.f9b7bbae.css"},{"revision":"c0347ad663ce0ab47fee1e6a91700f78","url":"assets/index.0706e044.js"},{"revision":"ec3b39e03ad412ded5ec29a298310724","url":"assets/index.esm.54899aec.js"},{"revision":"0fc410f321925c6b8d7a46bb4f185e50","url":"assets/index.f4bcc580.css"},{"revision":"4ce16f772ccb633433571412f26970af","url":"assets/index.fbdc8494.js"},{"revision":"08aa1c077b494ccdcfc899742bb78014","url":"assets/Logs.0237afce.js"},{"revision":"8729669bd6288f8409a3aaddce4fd16f","url":"assets/Logs.c5339eb0.css"},{"revision":"f2aa3c3c5d1f52a878540f5568138adb","url":"assets/logs.c73f6324.js"},{"revision":"cfd80f6179fe5791e31b6f90a912d8f9","url":"assets/Proxies.dba0af8d.js"},{"revision":"0df6a80a23d516fd09120e5aacbfe9db","url":"assets/Proxies.f906f5da.css"},{"revision":"5053bd15f158781cefb943fc8d09a56b","url":"assets/Rules.6cf13f46.css"},{"revision":"b3ca8127ca1443e59335855eb00544a2","url":"assets/Rules.90b13e00.js"},{"revision":"7d466629a99dd7b06fab1c1b4c514d55","url":"assets/Select.34bef176.css"},{"revision":"4379c210aadc46c7c5c377c036c1140b","url":"assets/Select.eb6a5624.js"},{"revision":"2f9b9f94979f550b257356364b69dbe4","url":"assets/TextFitler.6ef2850b.js"},{"revision":"41e678fecb33a4c4f135320a85066b03","url":"assets/TextFitler.f3ad599c.css"},{"revision":"85abf07c3ea72d42088cefecb88cc1e7","url":"assets/useRemainingViewPortHeight.c4100a43.js"},{"revision":"9aab2bec9281e26151b968ad47431f5e","url":"assets/vendor.55942996.js"},{"revision":"2fb5e17f8cc44c5b6821a7a4595cb01f","url":"assets/zh.d85002f6.js"},{"revision":"c6dd7b5a95f128e78921dd5524ace29e","url":"index.html"},{"revision":"402b66900e731ca748771b6fc5e7a068","url":"registerSW.js"},{"revision":"c0f9cb6aaf647e778bdc01c59944755b","url":"manifest.webmanifest"}]),function(e){const t=S();F(new B(t,e))}(G);const Q=new RegExp("/[^/?]+\\.[^/]+$");var V;F((({request:e,url:t})=>"navigate"===e.mode&&(!t.pathname.startsWith("/_")&&!t.pathname.match(Q))),(V="index.html",S().createHandlerBoundToURL(V))),F((({url:e})=>e.origin===self.location.origin&&e.pathname.endsWith(".png")),new class extends P{constructor(e){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift($)}async _handle(e,t){const s=t.fetchAndCachePut(e).catch((()=>{}));let a,n=await t.cacheMatch(e);if(n);else try{n=await s}catch(r){a=r}if(!n)throw new l("no-response",{url:e.url,error:a});return n}}({cacheName:"images",plugins:[new class{constructor(e={}){var t;this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:a})=>{if(!a)return null;const n=this._isResponseDateFresh(a),r=this._getCacheExpiration(s);m(r.expireEntries());const i=r.updateTimestamp(t.url);if(e)try{e.waitUntil(i)}catch(c){}return n?a:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this._getCacheExpiration(e);await s.updateTimestamp(t.url),await s.expireEntries()},this._config=e,this._maxAgeSeconds=e.maxAgeSeconds,this._cacheExpirations=new Map,e.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),u.add(t))}_getCacheExpiration(e){if(e===g())throw new l("expire-custom-caches-only");let t=this._cacheExpirations.get(e);return t||(t=new T(e,this._config),this._cacheExpirations.set(e,t)),t}_isResponseDateFresh(e){if(!this._maxAgeSeconds)return!0;const t=this._getDateHeaderTimestamp(e);if(null===t)return!0;return t>=Date.now()-1e3*this._maxAgeSeconds}_getDateHeaderTimestamp(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[e,t]of this._cacheExpirations)await self.caches.delete(e),await t.delete();this._cacheExpirations=new Map}}({maxEntries:50})]})),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}));
