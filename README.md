# Parse Server Authy Adapter
Allows your Parse Server to authenticate users using Twilio Authy One-Time Passwords (OTPs)

## Installation

1. On your parse server config folder run `npm install parse-server-authy-adapter`

1. Go to https://www.twilio.com/console/authy/applications/, get your API key.

1. Follow the steps on the [guide](https://docs.parseplatform.org/parse-server/guide/#custom-authentication).
	```javascript
	{
		.
		.
		.
		auth: {
			authy: {
				module: 'parse-server-authy-adapter',
				apiKey: 'your-api-key',
			}
		},
	}
	```

## Usage

1. Follow Authy's instructions to receive a OTP

1. `POST` to `/users` on parse-server the following payload
	```json
	{
		"authData": {
			"authy": {
				"id": "authy-user-id",
				"otp": "one-time-password"
			}
		}
	}
	```
	Curl example:
	```curl
	curl -X POST -H "Content-Type: application/json" \
	-H "X-Parse-Application-Id: myAppId" -d '{ \
		"authData": { \
			"authy": { \
				"id": "authy-id", \
				"otp": "authy-otp" \
			} \
		} \
	}' "http://example.com/parse/users"
	```
	Response:
	```json
	{
		"objectId": "...",
		"createdAt": "...",
		"username": "...",
		"sessionToken": "..."
	}
	```