const https = require('https')

// Wrapper for api requests based on https://github.com/andrewchae/parse-server-reddit-auth-adapter/
function verify(id, otp, apiKey) {
    return new Promise(function(resolve, reject) {
        https.get({
            hostname: 'api.authy.com',
            path: '/protected/json/verify/' + otp + '/' + id,
            headers: {
                'X-Authy-API-Key': apiKey,
            },
        }, function(res) {
            let data = ''
            res.on('data', function(chunk) {
                data += chunk
            })
            res.on('end', function() {
                try {
                    data = JSON.parse(data)
                } catch(e) {
                    return reject(e)
                }
                resolve(data)
            })
        }).on('error', function() {
            reject('Failed to validate this user with Authy.')
        })
    })
}

function validateAuthData(authData, options) {
	const apiKey = options && options.apiKey
	if (!apiKey) { 
		return Promise.reject(new Parse.Error(
			Parse.Error.OBJECT_NOT_FOUND,
			'Authy API key is not set',
		))
	}
	const id = authData.id
	const otp = authData.otp
	if (id && otp) {
		return verify(id, otp, apiKey).then((response) => {
			if (response && response.success) {
				return
			}
			throw new Parse.Error(
				Parse.Error.OBJECT_NOT_FOUND,
				'Invalid code',
			)
		})
	} else {
		return Promise.reject(new Parse.Error(
			Parse.Error.OBJECT_NOT_FOUND,
			'Missing id or One-Time password',
		)) 
	}
}

function validateAppId() {
	return Promise.resolve()
}

module.exports = {
	validateAppId: validateAppId,
	validateAuthData: validateAuthData,
}
