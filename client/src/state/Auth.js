// SPDX-License-Identifier: Apache-2.0
export default class Auth {
	/**
	 * Authenticate a user. Save a token string in Local Storage
	 *
	 * @param {string} resp
	 */
	static authenticateUser(res) {
		localStorage.setItem('token', res.token);
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
	 * Deauthenticate a user. Remove a token from Local Storage.
	 *
	 */
	static deauthenticateUser() {
		localStorage.removeItem('token');
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
