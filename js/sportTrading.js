import http from './http.js'

export default {
    getActiveList(cb, form) {
        http.get('/api/banner/getActiveBannerList', cb, form)
    },
    getWebSocketUrl(cb) {
        http.get('/api/web-socket/url/get', cb);
    },
    getApplicationId(cb) {
        http.get('/api/application-id/get', cb);
    }
}
