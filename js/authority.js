// import { fetch as fetch } from "whatwg-fetch";
import http from './http.js'
// import JSEncrypt from 'jsencrypt'

var encrypt = new JSEncrypt();

encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' +
    '\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3Zxr7pB0g03mtTCCrDum' +
    '\npUbETXw8bCCX8D2ESZokRhQzIL1UjX26cqFjfefh/2IbvKu3hyhKMPjt/bkVYyci' +
    '\nzBM+3EWtt8fuicYlmivLLNMk0tecDInP+AzKH/m21trx4nQw550MeFdvRslfe599' +
    '\nZM6ORUfDxjqRdmfOpgZqNFGLgD0TqtmOX5znpVV+jEHMpNa8euZoH/BtlToRPhxg' +
    '\nnQkbkA7z0xHWCL2oYvXINQXSYf1iBc8+MU5nxycdyu+5wz4Iw93cOoiq1t8lOEL0' +
    '\nbZ/k1MBX/Mvsv2O/W5ChmF7ZfXHSJFxcVh1ml11SEnxgXRd3EnOcRjsljpQBqBd3' +
    '\nxwIDAQAB\n-----END PUBLIC KEY-----');


export default {
    setToken(token) {
        if (token === undefined) return;
        else {
            sessionStorage["token"] = "Bearer " + token
            return token
        }
    },
    getToken() {
        const token = sessionStorage["token"]
        return token
    },
    clearToken() {
        sessionStorage.removeItem("token")
    },
    setLanguage(language) {
        sessionStorage["language"] = language
        return language
    },
    getLanguage() {
        const language = sessionStorage["language"]
        return language
    },
    setRoles(roles) {
        sessionStorage["roles"] = roles;
        return roles;
    },
    getRoles() {
        let roles = sessionStorage["roles"];
        return roles;
    },
    setUserCode(userCode) {
        sessionStorage['userCode'] = userCode
    },
    getUserCode() {
        let userCode = sessionStorage['userCode']
        return userCode
    },
    clearUserCode() {
        sessionStorage.removeItem('userCode')
    },
    setParticipantCode(participantCode) {
        sessionStorage['participantCode'] = participantCode
    },
    setAccessToken(accessToken) {
        if (accessToken === undefined) return;
        else {
            sessionStorage["accessToken"] = accessToken
        }
    },
    getAccessToken() {
        let accessToken = sessionStorage["accessToken"]
        return accessToken
    },
    clearAccessToken() {
        sessionStorage.removeItem("accessToken")
    },
    setUserEmail(email) {
        sessionStorage["userEmail"] = email
    },
    getUserEmail() {
        let userEmail = sessionStorage["userEmail"]
        return userEmail
    },
    //保存可修改字段值 1
    setRevisability(revisability) {
        sessionStorage["revisability"] = revisability
    },
    setWebSocketUrl(webSocketUrl) {
        sessionStorage["webSocketUrl"] = webSocketUrl
    },
    setApplicationId(applicationId) {
        sessionStorage["applicationId"] = applicationId
    },

    // login
    login(cb, email, password, code) {
        const postData = JSON.stringify({
            "username": email,
            "password": encrypt.encrypt(password),
            "code": code
        })

        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: postData
        })
            .then(function (response) {
                return response.text()
            })
            .then(function (data) {

                let result = {}
                result = JSON.parse(data)

                if (result.message === 'success') {
                    sessionStorage["token"] = "Bearer " + result.token
                    sessionStorage["roles"] = result.roles
                    sessionStorage["userCode"] = result.userCode
                } else {
                    sessionStorage["errorCode"] = result.errorCode
                }

                setTimeout(() => cb(result), 100)
            })
            .catch(function (ex) {
                console.log('parsing failed', ex)
            })

    },

    // first time login
    firstTimeLogin(cb, email, password) {
        const postData = JSON.stringify({
            "username": email,
            "password": encrypt.encrypt(password)
        })

        fetch('/api/auth/firstTimeLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: postData
        })
            .then(function (response) {
                return response.text()
            })
            .then(function (data) {
                let result = {}
                if (data.message == "Invalid credentials!") {
                    result.text = data
                    result.status = 401.2
                } else {
                    result = JSON.parse(data);
                }
                setTimeout(() => cb(result), 100)
            })
            .catch(function (ex) {
                console.log('parsing failed', ex)
            })


    },
    completeFirstTimeLogin(cb, postData) {
        fetch('/api/auth/completeFirstTimeLogin/' + postData.ref, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(function (response) {
                return response.text()
            })
            .then(function (data) {
                let result = {}

                result = JSON.parse(data);

                setTimeout(() => cb(result), 100)
            })
            .catch(function (ex) {
                console.log('parsing failed', ex)
            })
    },

    // registration
    getUserDetails(cb, ref) {
        fetch('/api/auth/registration/validate/' + ref, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(function (response) {
                return response.text()
            })
            .then(function (data) {
                let result = {}

                result = JSON.parse(data);

                setTimeout(() => cb(result), 100)
            })
            .catch(function (ex) {
                console.log('parsing failed', ex)
            })
    },
    confirmRegistration(cb, postData) {
        fetch('/api/auth/completeRegistration/' + postData.ref, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(function (response) {
                return response.text()
            })
            .then(function (data) {
                let result = {}

                result = JSON.parse(data);

                setTimeout(() => cb(result), 100)
            })
            .catch(function (ex) {
                console.log('parsing failed', ex)
            })
    },

    // register set password
    register(cb, ref, password) {
        const postData = JSON.stringify({
            "password": encrypt.encrypt(password)
        })

        fetch('/api/auth/registration/password/' + ref, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: postData
        })
            .then(function (response) {
                return response.text()
            })
            .then(function (data) {
                let result = {}

                result = JSON.parse(data);

                setTimeout(() => cb(result), 100)
            })
            .catch(function (ex) {
                console.log('parsing failed', ex)
            })
    },

    // change password
    changePwd(cb, oldPassword, newPassword) {
        const postData = {
            "oldPassword": encrypt.encrypt(oldPassword),
            "newPassword": encrypt.encrypt(newPassword)
        }

        http.post('/api/user/changePassword/', cb, postData);
    },

    // reset password
    resetPwd(cb, resetPasswordForm) {
        var postData = {
            username: resetPasswordForm.username,
            password: encrypt.encrypt(resetPasswordForm.password),
            code: resetPasswordForm.code
        }

        fetch('/api/auth/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(function (response) {
                return response.text()
            })
            .then(function (data) {
                let result = {}

                result = JSON.parse(data);

                setTimeout(() => cb(result), 100)
            })
            .catch(function (ex) {
                console.log('parsing failed', ex)
            })
    },
    logout(cb) {
        let token = this.getToken();
        fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
            .then(function (response) {
                return response.text()
            })
            .then(function (data) {
                let result = {}

                result = JSON.parse(data);

                sessionStorage.removeItem("token");
                sessionStorage.removeItem("roles");
                sessionStorage.removeItem("userCode");

                setTimeout(() => cb(result), 1000)
            })
            .catch(function (ex) {


                sessionStorage.removeItem("token");
                sessionStorage.removeItem("roles");
                sessionStorage.removeItem("userCode");

                console.log('parsing failed', ex)
            })
    },
    getOauthLoginUrl(cb) {
        //去后台取跳转的url
        http.get('/api/oauth2/sso/getLoginUrl', response => {
            cb(response)
        }, {})
    },
    getOauthLogoutPros(cb) {
        http.get('/api/oauth2/sso/getLogoutPros', response => {
            cb(response)
        }, {})

    }
}
