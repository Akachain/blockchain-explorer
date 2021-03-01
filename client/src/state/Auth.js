// SPDX-License-Identifier: Apache-2.0
export default class Auth {
	/**
	 * Authenticate a user. Save a token, view channel, role string in Local Storage
	 *
	 * @param {string} resp
	 */
	static authenticateUser(res) {
		localStorage.setItem('token', res.token);
		localStorage.setItem('userViewChannel', res.user.data.viewchannel);
		localStorage.setItem('role', res.user.data.role);
	}

	/**
	 * Check if a user is authenticated - check if a token is saved in Local Storage
	 *
	 * @returns {boolean}
	 */
	static isUserAuthenticated() {
		return localStorage.getItem('token') !== null;
	}

	/**
	 * Deauthenticate a user. Remove a token, view channel, role from Local Storage.
	 *
	 */
	static deauthenticateUser() {
		localStorage.removeItem('token');
		localStorage.removeItem('userViewChannel');
		localStorage.removeItem('role');
	}

	/**
	 * Get a token value.
	 *
	 * @returns {string}
	 */

	static getToken() {
		return localStorage.getItem('token');
	}
}
